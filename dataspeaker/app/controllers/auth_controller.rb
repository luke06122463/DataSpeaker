require 'json'
require 'constants'
require 'util/fake_client'

class AuthController < ApplicationController
  
  def logout
    puts "user logout"
    session.clear
    render :json => {:logout_flag => true}
  end

  #check whether user has been logged in
  def check_authentication
    puts "check authentication"
    # todo: check whether the token has been expired
    if !session[:access_token].nil?
      render :json => {
        :has_login => true, 
        :login_data => {
          :uid => session[:uid],
          :access_token => session[:access_token],
          :expired_at => session[:expires_at]
        }
        #:login_data => weibo_client.users.show_by_uid(session[:uid].to_i)
      }
    else
      render :json => {
        :has_login => false
      }
    end
  end

  def get_token
    render :json=>{:token=>session[:access_token]}
  end

  def authorization
    #WeiboOAuth2::Config.redirect_uri = "http://192.168.1.109:3000/auth/callback"
    client = WeiboOAuth2::Client.new
    redirect_to client.authorize_url
  end

  # callback function for weiboauth2
  def callback
    #access_token = '79fd8c3c2e70b1b1e97df9b24ec98dc0'
    client = WeiboOAuth2::Client.new
    access_token = client.auth_code.get_token(params[:code].to_s)
    session[:uid] = access_token.params["uid"]
    session[:access_token] = access_token.token
    session[:expires_at] = access_token.expires_at

    render :json=>{:token=>session[:access_token], :uid=>session[:uid]}
  end

end
