require 'util/fake_client'
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  before_filter :authenticate,:except=>[:prologin,:logout, :check_authentication, :initDB, :authorization, :callback, :get_token]

  private
  def authenticate 
#=begin
    # 1. User hasn't logged in yet, so deny his any request and redirect to the login page
    if !session[:access_token].nil? then
      # output the session
      puts "user token: #{session[:access_token]}"

      #
      # TODO: check whether session has been timed out
      #
      @session_valid_flag = true
    # 1.1 sessiom timeout, so let handle it accordting to the request method, ajax or normal http request
      if @session_valid_flag == false
# session timeout
        render :nothing => true, :status => 401
        return false
      end
    else
# unautheorized, user hasn't logged in yet
      puts "session is empty for user [#{session[:user_name]}]"
      render :nothing => true, :status => 401
      return false
    end
#=end
  end
end
