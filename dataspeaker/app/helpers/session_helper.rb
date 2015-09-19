module SessionHelper
  class Session
    @@TIMEOUT = -1

    def initialize rest_client=nil, session=nil, request=nil, location=nil
      @session = session
      @request = request
      @location = location
      @rest_client = rest_client
    end

    # set the default value when the first time user visit dpsearch admin web
    def setDefaultVaule
      @session[:last_active_at] = Time.now.utc
      @session[:session_ip] = @request.headers['REMOTE_ADDR']
      #@session[:session_browser_signature] = retrieve_browser_signature
    end

    # clear the session' content not session itself. otherwise, the csrf token will be changed.
    def clearSessionContent
      @session[:last_active_at] = nil
      @session[:session_ip] = nil
      #@session[:session_browser_signature] = nil
      @session[:user_name] = nil
      @session[:user_id]= nil
      @session[:user_logon_name] = nil
      @session[:time_zone_offset] = nil
      @session[:user_roles] = nil
    end

    # detect whether session is empty. check_session would return false if session is empty
    def check_session_not_empty
      notEmpty = false
      if @session[:user_name] && @session[:user_roles] && @session[:last_active_at]
        notEmpty = true
      end
      return notEmpty
    end

    #
    # check whether the cookie is legal
    #
    def check_session
      #check_session_browser_signature && check_session_expiry
      check_session_expiry && check_session_ip_binding #&& check_session_browser_signature
    end

    #
    # Check whether session has been timed out
    #
    def check_session_expiry
      if @session[:last_active_at] && (convert_string_to_utc(@session[:last_active_at]) + idle_session_timeout) < Time.now.utc
          # Session has expired.
          expire_session
      else
          # Assign a new expiry time
          set_session_expiry
          return true
      end
    end

    def convert_string_to_utc str
      if(str.class.to_s == 'String')
        return Time.zone.parse(str).utc
      end
      return str
    end

    # reset the session timeout
    def set_session_expiry
      #puts "Time: #{Time.now}"
      @session[:last_active_at] = Time.now.utc
    end

    # get the interval for session timeout which is stored in es
    def idle_session_timeout
      if @@TIMEOUT <= 0
        set_session_timeout
      end
      return @@TIMEOUT
    end

    # get the interval of session timeout from es
    def set_session_timeout
      @@TIMEOUT = 3600
    end

    #
    # Check whether remote address has been
    #

    # IP binding is not very useful in the wild since some ISP use 
    # a different IP for each request, i.e. the session uses many IPs
    def check_session_ip_binding
      if !@session[:session_ip].nil? && @session[:session_ip] != @request.headers['REMOTE_ADDR']
        # client IP has changed
        expire_session
      else
        # Assign client IP
        @session[:session_ip] = @request.headers['REMOTE_ADDR']
        return true
      end
    end

    #
    # Check browser signature
    #
    def check_session_browser_signature
      if !@session[:session_browser_signature].nil? && @session[:session_browser_signature] != retrieve_browser_signature
        @signature = retrieve_browser_signature
        # browser signature has changed
        expire_session
        return false
      else
        # Assign a browser signature
        @session[:session_browser_signature] = retrieve_browser_signature
       return true
      end
    end

    # caculate the browser signature
    def retrieve_browser_signature
      [@request.headers['HTTP_USER_AGENT'],
       @request.headers['HTTP_ACCEPT_LANGUAGE'],
       @request.headers['HTTP_ACCEPT_ENCODING']].join('|')
    end

    #
    # expire the session if
    # => 1. session has been timed out
    # => 2. Ip has been changed
    # => 3. Browser signature has been changed
    #
    def expire_session
      #@session.clear
      clearSessionContent
      session_timeout
      return false
    end

    def session_timeout
      #respond_to do |format|
      #  format.html {
      #    @notice = "session timeout" unless @notice
      #    redirect_to "/auth/login"
      #  }
      #  format.xml { head :unauthorized }
      #end
      #redirect_to "/auth/login"
    end
  end
end
