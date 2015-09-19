require 'rest_client'

class Users
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
  end

  # get the user information. If it has been cached in mongodb, then retrieve the user info from mongodb directly.
  # otherwise, request the user info from weibo server and store it into mongodb
  def get_current_user_info 
    user_info = {}
    begin
      result = @db_master[:users].find(:id => @uid.to_i).count
      if(result == 0)
        puts "we need to query the data from weibo"
        user_info = @weibo.users.show_by_uid(@uid.to_i)
        @db_master[:users].insert_one({:id=>@uid.to_i, :status=>0}) #0 for created, 1 for friend_list is ready
        @db_index[:users].insert_one(user_info)
      else
        puts "read to user information from db"
        user_db_info = @db_index[:users].find(:id => @uid.to_i).to_a
        user_info = user_db_info[0]
      end
    rescue
      puts "exception happens in get_current_user_info: #{e.to_s}"
    end
    return user_info
  end

  # get the analysis status for user
  # 0 for created, 1 for friend_list is ready, 2 for friend_list & followers_list are ready
  def get_user_status(id=@uid)
    status = -1
    puts "try to fetch the status for user #{id}"
    @db_master[:users].find(:id => id.to_i).each do |document|
      #=> Yields a BSON::Document.
      status = document["status"]
    end
    return status
  end

  # sift out the unneccessary attributes from followers
  def get_followers_key_index
    followers = Array.new
    get_user_followers().each do |follower|
      key_index = {
        :id=> follower["id"],
        :name=> follower["name"],
        :province=> follower["province"],
        :city=> follower["city"],
        :location=> follower["location"],
        :gender=> follower["gender"],
        :verified=> follower["verified"],
        :followers_count=> follower["followers_count"],
        :friends_count=> follower["friends_count"],
        :statuses_count=> follower["statuses_count"],
        :favourites_count=> follower["favourites_count"],
        :created_at=> follower["created_at"],
        :valid=> true
      }
      if(!follower["status"].nil?)
        key_index[:last_status_id] = follower["status"]["id"]
        key_index[:last_status_created_at] = follower["status"]["created_at"]
      end
      followers << key_index
    end
    return followers
  end

  # get the followers from mongodb
  def get_user_followers
    followers = Array.new
    begin
      @db_index[:followers].find().each do |follower|
        followers << follower
      end
    rescue => e
      puts "exception happens in get_user_followers: #{e.to_s}"
    end
    return followers
  end

  # request the friends from weibo through cloud api and store them in 'friends' collection
  def set_user_friends
    status = true
    count = 200
    cursor = 0
    round = 0
    request_flag = true
    friend_size = 0
    new_friend_count = 0
    begin
      while request_flag
        round = round + 1
        cursor = cursor + friend_size
        user_friends = @weibo.friendships.friends({:uid => @uid.to_i, :count => count, :trim_status=>0, :cursor=>cursor})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        friend_size = 0
        new_friend_count = 0
        user_friends["users"].each do |friend|
          friend_size =friend_size+1
          if((@db_index[:friends].find(:id => friend["id"]).count) == 0)
            @db_index[:friends].insert_one(friend)
            new_friend_count = new_friend_count + 1
          end
        end
        if(new_friend_count < 1 && friend_size < 1)# && cursor >= (user_friends["total_number"]-1))
          request_flag = false
        end
        puts "#{round} round,from [#{cursor}] to [#{cursor+count}], return [#{friend_size}] items, [#{new_friend_count}] are new friends"
      end
      # update status
    rescue => e
      puts "exception happens in set_user_friends: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  # request the followers from weibo through cloud api and store them in 'followers' collection
  def set_user_followers
    status = true
    count = 100
    cursor = 0
    round = 0
    request_flag = true
    follower_size = 0
    new_follower_count = 0
    begin
      while request_flag
        round = round + 1
        cursor = cursor + follower_size
        user_followers = @weibo.friendships.followers({:uid => @uid.to_i, :count => count, :trim_status=>0, :cursor=>cursor})
        #@db_index[:friends_raw].insert_one(:from=>0, :count=>200, :data=>user_friends)
        follower_size = 0
        new_follower_count = 0
        user_followers["users"].each do |follower|
          follower_size =follower_size+1
          if((@db_index[:followers].find(:id => follower["id"]).count) == 0)
            @db_index[:followers].insert_one(follower)
            new_follower_count = new_follower_count + 1
          end
        end
        if(new_follower_count < 1 && follower_size < 1)
          request_flag = false
        end
        puts "#{round} round,from [#{cursor}] to [#{cursor+count}], return [#{follower_size}] items, [#{new_follower_count}] are new friends"
      end
      # update status
    rescue => e
      puts "exception happens in set_user_followers: #{e.to_s}"
      status = false
    end
    if status
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    end
    return status
  end

  def get_user_info(id=@uid.to_i)
      user_info = @weibo.users.show_by_uid(id)
      return user_info
  end

  # store the analysis result into mongodb. if flush=true, then result will be updated
  def set_result(object=nil, flush=false)
    status = true
    begin
      result = @db_index[:result].find(:field => object[:field]).count
      if(result == 0)
        puts "set the result into result table"
        @db_index[:result].insert_one(object)
      elsif(flush)
        puts "update analysis result"
        # TODO: implement update
      else
        puts "result has already existed. do nothing"
      end
      # increase the process status for the current user in master table
      @db_master[:users].find(:id => @uid.to_i).update_one("$inc" => { :status => 1 })
    rescue
      puts "exception happens in get_current_user_info: #{e.to_s}"
      status = false
    end
    return status
  end

  # retrieve analysis result from db
  def get_result
    results = {}
    begin
      @db_index[:result_1].find().each do |result|
        results[result["field"]] = result["result"]
      end
    rescue => e
      puts "exception happens in get_user_followers: #{e.to_s}"
    end
    return results
  end

end