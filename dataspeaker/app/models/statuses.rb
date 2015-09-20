class Statuses
  def initialize(session=nil)
    @session = session
    @uid = @session[:uid]
    # create client for weiboauth2. It will be used in the later interaction with weibo
    @weibo = WeiboOAuth2::Client.new
    @weibo.get_token_from_hash({:access_token => @session[:access_token], :expires_at => @session[:expires_at]}) 
    # create client for mongodb. It will be used in the later interaction with Mongodb
    # prepare the master dbs which records the analysis status for each user
    @db_master = Mongo::Client.new([ DBURL ], :database => DBMASTER)
    # prepare the user dbs. dataspeaker create a db for each user
    @db_index_name = DBPREFIX+@uid
    @db_index = Mongo::Client.new([ DBURL ], :database => @db_index_name)
    #workaround to get statuses for specific user
    @luke06122463_id = 1695054681
    @luke06122463_index = Mongo::Client.new([ DBURL ], :database => (DBPREFIX+@luke06122463_id.to_s))
  end

  # 0 for all, 1 for original, 2 for picture, 3 for video, 4 for music
  def get_statuses_key_index(feature=0)
    statuses = Array.new
    user_statuses = get_statuses(feature)
    user_statuses.each do |status|
      statuses << {
        :created_at=> status["created_at"],
        :id=> status["id"],
        :text=> status["text"],
        :source=> status["source"],
        :reposts_count=> status["reposts_count"],
        :comments_count=> status["comments_count"],
        :attitudes_count=> status["attitudes_count"]
      }
    end
    return statuses
  end

  # get the followers from mongodb
  def get_statuses(feature=0)
    statuses = Array.new
    begin
      if(feature==1)
        user_statuses = @db_index[:statuses_1].find()
      elsif(feature==2)
        user_statuses = @db_index[:statuses_2].find()
      elsif(feature==3)
        user_statuses = @db_index[:statuses_3].find()
      elsif(feature==4)
        user_statuses = @db_index[:statuses_4].find()
      else
        user_statuses = @db_index[:statuses_0].find()
      end
          
      user_statuses.each do |status|
        statuses << status
      end
    rescue => e
      puts "exception happens in get_all_statuses: #{e.to_s}"
    end
    return statuses
  end


  # request the friends from weibo through cloud api and store them in 'friends' collection
  def set_all_statuses
    status = true
    count = 100
    feature = 0
    round = 0
    page = 1
    request_flag = true
    statuses_size = 0
    new_statues_count = 0
    begin
      while request_flag
        round = round + 1
        statuses = @weibo.statuses.home_timeline({:count => count, :page=> page, :feature=>feature, :base_app=> 0, :trim_user=> 0})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        statuses_size = 0
        new_statues_count = 0
        statuses["statuses"].each do |status|
          statuses_size =statuses_size+1
          #puts "#{status["user"]["id"]} ==> #{status["text"]}"
          if(status["user"]["id"] == @luke06122463_id)
            puts "#{status["user"]["id"]} == #{@luke06122463_id}"
            if((@luke06122463_index[:statuses_0].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_0].insert_one(status)
              new_statues_count = new_statues_count + 1
            end
          end
        end
        if(count > statuses_size)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{(page-1)*count}] to [#{page*count}], return [#{statuses_size}] items, [#{new_statues_count}] are new friends"
        page = page + 1
      end
      # update status
    rescue => e
      puts "exception happens in set_all_statuses: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  # request the friends from weibo through cloud api and store them in 'friends' collection
  def set_original_statuses
    status = true
    count = 100
    feature = 1
    round = 0
    page = 1
    request_flag = true
    statuses_size = 0
    new_statues_count = 0
    new_original_statues_count = 0
    begin
      while request_flag
        round = round + 1
        statuses = @weibo.statuses.home_timeline({:count => count, :page=> page, :feature=>feature, :base_app=> 0, :trim_user=> 0})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        statuses_size = 0
        new_statues_count = 0
        new_original_statues_count = 0
        statuses["statuses"].each do |status|
          statuses_size =statuses_size+1
          #puts "#{status["user"]["id"]} ==> #{status["text"]}"
          if(status["user"]["id"] == @luke06122463_id)
            if((@luke06122463_index[:statuses_0].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_0].insert_one(status)
              new_statues_count = new_statues_count + 1
            end
            if((@luke06122463_index[:statuses_1].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_1].insert_one(status)
              new_original_statues_count = new_original_statues_count + 1
            end
          end
        end
        if(count > statuses_size)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{(page-1)*count}] to [#{page*count}], return [#{statuses_size}] items, [#{new_statues_count}] are new statuses, [#{new_original_statues_count}] are original statuses"
        page = page + 1
      end
      # update status
    rescue => e
      puts "exception happens in set_all_statuses: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  def set_picture_statuses
    status = true
    count = 100
    feature = 2
    round = 0
    page = 1
    request_flag = true
    statuses_size = 0
    new_statues_count = 0
    new_original_statues_count = 0
    begin
      while request_flag
        round = round + 1
        statuses = @weibo.statuses.home_timeline({:count => count, :page=> page, :feature=>feature, :base_app=> 0, :trim_user=> 0})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        statuses_size = 0
        new_statues_count = 0
        new_original_statues_count = 0
        statuses["statuses"].each do |status|
          statuses_size =statuses_size+1
          #puts "#{status["user"]["id"]} ==> #{status["text"]}"
          if(status["user"]["id"] == @luke06122463_id)
            if((@luke06122463_index[:statuses_0].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_0].insert_one(status)
              new_statues_count = new_statues_count + 1
            end
            if((@luke06122463_index[:statuses_2].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_2].insert_one(status)
              new_original_statues_count = new_original_statues_count + 1
            end
          end
        end
        if(count > statuses_size)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{(page-1)*count}] to [#{page*count}], return [#{statuses_size}] items, [#{new_statues_count}] are new statuses, [#{new_original_statues_count}] are picture statuses"
        page = page + 1
      end
      # update status
    rescue => e
      puts "exception happens in set_all_statuses: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  def set_video_statuses
    status = true
    count = 100
    feature = 3
    round = 0
    page = 1
    request_flag = true
    statuses_size = 0
    new_statues_count = 0
    new_original_statues_count = 0
    begin
      while request_flag
        round = round + 1
        statuses = @weibo.statuses.home_timeline({:count => count, :page=> page, :feature=>feature, :base_app=> 0, :trim_user=> 0})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        statuses_size = 0
        new_statues_count = 0
        new_original_statues_count = 0
        statuses["statuses"].each do |status|
          statuses_size =statuses_size+1
          #puts "#{status["user"]["id"]} ==> #{status["text"]}"
          if(status["user"]["id"] == @luke06122463_id)
            if((@luke06122463_index[:statuses_0].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_0].insert_one(status)
              new_statues_count = new_statues_count + 1
            end
            if((@luke06122463_index[:statuses_3].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_3].insert_one(status)
              new_original_statues_count = new_original_statues_count + 1
            end
          end
        end
        if(count > statuses_size)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{(page-1)*count}] to [#{page*count}], return [#{statuses_size}] items, [#{new_statues_count}] are new statuses, [#{new_original_statues_count}] are video statuses"
        page = page + 1
      end
      # update status
    rescue => e
      puts "exception happens in set_all_statuses: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  def set_music_statuses
    status = true
    count = 100
    feature = 3
    round = 0
    page = 1
    request_flag = true
    statuses_size = 0
    new_statues_count = 0
    new_original_statues_count = 0
    begin
      while request_flag
        round = round + 1
        statuses = @weibo.statuses.home_timeline({:count => count, :page=> page, :feature=>feature, :base_app=> 0, :trim_user=> 0})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        statuses_size = 0
        new_statues_count = 0
        new_original_statues_count = 0
        statuses["statuses"].each do |status|
          statuses_size =statuses_size+1
          #puts "#{status["user"]["id"]} ==> #{status["text"]}"
          if(status["user"]["id"] == @luke06122463_id)
            if((@luke06122463_index[:statuses_0].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_0].insert_one(status)
              new_statues_count = new_statues_count + 1
            end
            if((@luke06122463_index[:statuses_4].find(:id => status["id"]).count) == 0)
              @luke06122463_index[:statuses_4].insert_one(status)
              new_original_statues_count = new_original_statues_count + 1
            end
          end
        end
        if(count > statuses_size)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{(page-1)*count}] to [#{page*count}], return [#{statuses_size}] items, [#{new_statues_count}] are new statuses, [#{new_original_statues_count}] are music statuses"
        page = page + 1
      end
      # update status
    rescue => e
      puts "exception happens in set_all_statuses: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

end