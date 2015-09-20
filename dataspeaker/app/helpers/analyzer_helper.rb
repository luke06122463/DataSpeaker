module AnalyzerHelper
  class Analyzer

    def initialize(user_model=nil, location_model=nil, statuses_model=nil)
      @user_model = user_model
      @location_model = location_model
      @statuses_model = statuses_model
    end

    def pre_analyze
      steps = {
        :step_1 => true,
        :step_2 => false,
        :step_3 => false,
        :result => false
      }
      if steps[:step_1]
        steps[:step_2] = @user_model.set_user_friends()
      end
      if steps[:step_2]
        steps[:step_3] = @user_model.set_user_followers()
        steps[:result] = steps[:step_3]
      end
      return steps[:result]
    end

    # Break the analyze operation into several steps so that we can eailsy figure out which step fails if there is any exception happens. 
    # Each step will store its result into mongodb and each step will only be excuted by once even if user retry
    def analyze
      steps = {
        :step_3 => true,
        :step_4 => false,
        :step_5 => false,
        :step_6 => false,
        :step_7 => false,
        :result => false
      }
      followers = @user_model.get_followers_key_index()
      if steps[:step_3]
        # calculate the gender distribution for followers
        steps[:step_4] = gender_analyze(followers)
      end
      if steps[:step_4]
        # calculate how frequent user post a message
        steps[:step_5] = frequency_analyze(followers)
      end
      if steps[:step_5]
        # calculate the followers distribution for each follower
        steps[:step_6] = follower_amount_analyze(followers)
      end
      if steps[:step_6]
        # calculate the location distribution for each follower
        steps[:step_7] = location_analyze(followers)
      end
      if steps[:step_7]
        # classify followers to four groups: V users, Micro-weibo Master, Genuine User, Zombie
        steps[:step_7] = catogery_analyze(followers)
        steps[:result] = steps[:step_7]
      end
      return steps[:result]
    end

    def extra_analyze
      steps = {
        :step_7 => true,
        :step_8 => false,
        :step_9 => false,
        :result => false
      }
      if steps[:step_7]
        # analyse the timeline for all statuses
        all_statuses = @statuses_model.get_statuses_key_index(0)
        steps[:step_8] = all_timeline_analyze(all_statuses)
      end
      if steps[:step_8]
        # analyse the timelien for all original statuses
        original_statuses = @statuses_model.get_statuses_key_index(1)
        steps[:step_9] = original_timeline_analyze(original_statuses)
        steps[:result] = steps[:step_9]
      end

      return steps[:result]
    end

    # analyze how many followers are male and how many are female
    def gender_analyze(users=nil)
      male_cnt = female_cnt = unknown_cnt = 0
      users.each do |user|
        if(user[:gender]=="m")
          male_cnt = male_cnt + 1
        elsif(user[:gender]=="f")
          female_cnt = female_cnt + 1
        else
          unknown_cnt = unknown_cnt + 1
        end   
      end
      gender = {:male_cnt=> male_cnt, :female_cnt=> female_cnt, :unknown_cnt=> unknown_cnt}
      puts "the result of gender_analyze is: #{gender.to_s}"
      # store the result into mongodb. set_result(obj, true) will update the result
      return @user_model.set_result({:field=>"gender", :result=>gender})
    end

    # analyze how frequent user post messages.
    # rule: 
    # => daily: statuses_count > diff (how many days passed since user registered to weibo)
    # => monthly: statuses_count > diff/30
    # => yearly: statuses_count > diff/365
    def frequency_analyze(users=nil)
      no_active = day_active = month_active = year_active = 0
      users.each do |user|
        day_diff = UtilityHelper::Utility.calculate_day_diff(user[:created_at])
        if(day_diff < user[:statuses_count])
          day_active = day_active + 1
        elsif(day_diff < (user[:statuses_count]*30))
          month_active = month_active + 1
        elsif(day_diff < (user[:statuses_count]*365))
          year_active = year_active + 1
        else
          no_active = no_active + 1
        end 
      end
      frequency = {:day_active=> day_active, :month_active=> month_active, :year_active=> year_active, :no_active=>no_active}
      puts "the result of frequency_analyze is: #{frequency.to_s}"
      return @user_model.set_result({:field=>"frequency", :result=>frequency})
    end

    # anaylyze how many followers that each of your follower has
    # rules:
    # => 0 - 99, 100 - 199, 200 - 299, 300 - 399, 400 - 499
    # => 500 - 599, 600 - 699, 700 - 799, 800 - 899, 900 - 999, 1000 - NaN
    def follower_amount_analyze(users=nil)
      follower_amount = [0,0,0,0,0,0,0,0,0,0,0]
      users.each do |user|
        index = (user[:followers_count]/100).to_i
        if(index>=10)
          puts "user name is #{user[:id]}, #{user[:name]}, #{user[:followers_count]}"
        end
        index = (index > 10) ? 10 : index
        follower_amount[index] = follower_amount[index] + 1
      end
      followers = {:follower_amount => follower_amount}
      puts "the result of follower_amount_analyze is: #{followers.to_s}"
      return @user_model.set_result({:field=>"followers", :result=>followers})
    end

    # analyze the location distribution for each followers
    def location_analyze(users=nil)
      location = Array.new
      location_amount = {}
      province = @location_model.get_provinces()
      #statistic how many followers are in each provinces
      users.each do |user|
        puts "province=> #{user[:province]}, location=> #{user[:location]}"
        if(!location_amount[user[:province]].nil?)
          location_amount[user[:province]][:value] = location_amount[user[:province]][:value] + 1
        else
          location_amount[user[:province]] = {:value=>1, :name=>province[user[:province].to_i]}
        end
      end
      location_amount.each do |k, v|
        # HighMap could only accept existing provices, so province code 100 and 400 need to be sifted out
        if(k.to_i < 100)
          location << v#{:value=> v[:value], :name=>province[k.to_i]}
        end
      end
      puts "the result of location_analyze is: #{location.to_s}"
      return @user_model.set_result({:field=>"location", :result=>location})
    end

    # classify followers to four groups: V users, Micro-weibo Master, Genuine User, Zombie
    # => V users: if the user is valified by weibo, then he is a V user
    # => Micro-weibo Master: 1)who is daily active or 2)whose followers exceeds 500
    # => Zombie: 1)statuses is less than 10 or 2)ratio of friends to followers is bigger than 10 or
    #     3)followers is less than 10
    # => Genuine User: others
    def catogery_analyze(users=nil)
      #v_cnt is for the amount of V users, m_cnt for Micro-weibo Master, z_cnt for zombie and  g_cnt for Genuine user
      v_cnt = m_cnt = z_cnt = g_cnt = 0
      users.each do |user|
        if(user[:verified])
          v_cnt = v_cnt + 1
        elsif((UtilityHelper::Utility.calculate_day_diff(user[:created_at]) < user[:statuses_count]) || (user[:followers_count] > 500))
          m_cnt = m_cnt + 1
        elsif(user[:statuses_count]<10 || user[:followers_count] < 10 || (user[:friends_count]/((user[:followers_count]>0) ? user[:followers_count]:0)).to_i > 10)
          z_cnt = z_cnt + 1
        else
          g_cnt = g_cnt + 1
        end
      end
      catogery = {:v_cnt=> v_cnt, :m_cnt=> m_cnt, :z_cnt=> z_cnt, :g_cnt=> g_cnt}
      puts "the result of catogery_analyze is: #{catogery.to_s}"
      return @user_model.set_result({:field=>"catogery", :result=>catogery})
    end

    def all_timeline_analyze(statuses)
      timeline = timeline_analyze(statuses)
      puts "the result of all_timeline_analyze is: #{timeline.to_s}"
      return @user_model.set_result({:field=>"all_timeline", :result=>timeline})
    end

    def original_timeline_analyze(statuses)
      timeline = timeline_analyze(statuses)
      puts "the result of original_timeline_analyze is: #{timeline.to_s}"
      return @user_model.set_result({:field=>"original_timeline", :result=>timeline})
    end

    def timeline_analyze(statuses)
      # get the created_at of weibo account
      account_created_at = @user_model.get_current_user_info()["created_at"]
      # convert the date string to utc
      account_utc = UtilityHelper::Utility.convert_to_utc(account_created_at)
      # calculte how many quarter should be displayed on the dashboard
      quarter_num = UtilityHelper::Utility.calcute_quarter_num(account_utc.year)
      timeline = Array.new(quarter_num, 0)
      statuses.each do |status|
        day_diff = UtilityHelper::Utility.calculate_day_off(status[:created_at],account_utc.year)
        quarter_index = (day_diff/90).to_i
        timeline[quarter_index] = timeline[quarter_index] + 1
      end
      return {:base=>account_utc.year, :timeline=>timeline}
    end

  end
end
