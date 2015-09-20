require 'json'
require 'constants'
require 'mongo'
require 'util/fake_client'

class UsersController < ApplicationController
  # request user personal information
  def info
    uid = params[:uid]
    users_model = Users.new session
    user_info = users_model.get_current_user_info()
    user_status = users_model.get_user_status()
    render :json=> {:info=>user_info, :status=>user_status}
  end

  # request analysis result
  def result
    users_model = Users.new session
    user_info = users_model.get_result()
    render :json=> {:data=>user_info}
  end

  # request for process status. pre_analyze and analyze operation have been broken down to several steps.
  # process status will indicate which step we are now
  def status
    users_model = Users.new session
    user_info = users_model.get_user_status()
    render :json=> {:data=>user_info}
  end

  def analyze
    users_model = Users.new(session)
    location_model = Location.new(session)
    statuses_model = Statuses.new(session)
    analyzer = AnalyzerHelper::Analyzer.new(users_model, location_model, statuses_model)
    if(analyzer.collect())
      result = analyzer.analyze()
    end
    render :json=> {:data=> result}
  end

  def friends
    users_model = Users.new(session)
    user_info = users_model.set_user_friends()
    render :json=> {:data=>user_info}
  end

  def followers
    users_model = Users.new(session)
    user_info = users_model.set_user_followers()
    render :json=> {:data=>user_info}
  end

  #workaround. do not expose this api to user.
  def statuses
    statuses_model = Statuses.new(session)
    statuses_model.set_all_statuses()
    statuses_model.set_original_statuses()
    statuses_model.set_picture_statuses()
    statuses_model.set_video_statuses()
    result = statuses_model.set_music_statuses()
    render :json=>{:data=> result}
  end

  def test
    users_model = Users.new(session)
    location_model = Location.new(session)
    statuses_model = Statuses.new(session)
    analyzer = AnalyzerHelper::Analyzer.new(users_model, location_model, statuses_model)
    result = analyzer.extra_analyze()
    render :json=>{:data=>result}
  end

end
