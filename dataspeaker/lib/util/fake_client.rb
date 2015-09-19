require 'json'

module Client
  class Rest_Client
    def initialize(token)
      @token = token
      @is_expired = (token.nil?) ? true : false
      @is_cis_error = false
    end

    def request_deliver(url,params)
      case url
        when USER_AUTHENTICATION_URL
          return user_authentication(params)
        when BOOKMARK_URL
          return get_bookmark_by_page(params)
      end
    end

    def user_authentication(params)
      result = {:authenticated => false}
      if(!params.nil?)
        if(params[:username] == 'luke' && params[:password] == 'luke')
          result[:authenticated] = true
          result[:user_name] = "luke"
          result[:first_name] = "Kai"
          result[:last_name] = "Lu"
          result[:user_id] = "001"
          result[:user_logon_name] = "lul4"
          result[:user_roles] = 1
        elsif(params[:username] == 'daisy' && params[:password] == 'daisy')
          result[:authenticated] = true
          result[:user_name] = "daisy"
          result[:first_name] = "Hui"
          result[:last_name] = "Ren"
          result[:user_id] = "002"
          result[:user_logon_name] = "renh1"
          result[:user_roles] = 2
        end
      end
      return result
    end

    def get_bookmark_by_page(params)
      bookmarks = Array.new
      bookmarks << {:title=>'ng-repeat的性能问题', :url => 'http://www.mamicode.com/info-detail-504104.html', :summary=>'(十三)通过DOM事件DOMNodeRemoved，看ng-repeat的性能问题以及track by的作用'}
      bookmarks << {:title=>'Oledata.mso attachment', :url => 'https://support.microsoft.com/en-us/kb/222330', :summary=>'You see a file with the extension of.wmz when you receive a message with Oledata.mso attachment'}
      bookmarks << {:title=>'How to Open Oledata.Mso Files', :url => 'http://www.ehow.com/how_6553901_open-oledata_mso-files.html', :summary=>'Oledata.Mso computer files are specifically formatted files relating to an attachment that is sent via email using Microsoft Outlook.'}
      bookmarks << {:title=>'Office & Productivity Software forum', :url => 'http://www.cnet.com/forums/discussions/what-are-oledata-mso-files-12465/', :summary=>'What are oledata.mso files?'}
      bookmarks << {:title=>'$watch How the $apply Runs a $digest', :url => 'http://angular-tips.com/blog/2013/08/watch-how-the-apply-runs-a-digest/', :summary=>'Angular users want to know how data-binding works. There is a lot of vocabulary around this: $watch, $apply, $digest, dirty-checking… What are they and how do they work?'}
      bookmarks << {:title=>'vertical-align in table cells', :url => 'http://phrogz.net/CSS/vertical-align/index.html', :summary=>'When used in table cells, vertical-align does what most people expect it to, which is mimic the (old, deprecated) valign attribute. '}
      bookmarks << {:title=>'ng-repeat的性能问题', :url => 'http://www.mamicode.com/info-detail-504104.html', :summary=>'(十三)通过DOM事件DOMNodeRemoved，看ng-repeat的性能问题以及track by的作用'}
      bookmarks << {:title=>'Oledata.mso attachment', :url => 'https://support.microsoft.com/en-us/kb/222330', :summary=>'You see a file with the extension of.wmz when you receive a message with Oledata.mso attachment'}
      bookmarks << {:title=>'How to Open Oledata.Mso Files', :url => 'http://www.ehow.com/how_6553901_open-oledata_mso-files.html', :summary=>'Oledata.Mso computer files are specifically formatted files relating to an attachment that is sent via email using Microsoft Outlook.'}
      bookmarks << {:title=>'Office & Productivity Software forum', :url => 'http://www.cnet.com/forums/discussions/what-are-oledata-mso-files-12465/', :summary=>'What are oledata.mso files?'}
      bookmarks << {:title=>'$watch How the $apply Runs a $digest', :url => 'http://angular-tips.com/blog/2013/08/watch-how-the-apply-runs-a-digest/', :summary=>'Angular users want to know how data-binding works. There is a lot of vocabulary around this: $watch, $apply, $digest, dirty-checking… What are they and how do they work?'}
      bookmarks << {:title=>'vertical-align in table cells', :url => 'http://phrogz.net/CSS/vertical-align/index.html', :summary=>'When used in table cells, vertical-align does what most people expect it to, which is mimic the (old, deprecated) valign attribute. '}
      return {
        :success=> true,
        :result=>bookmarks
      }
    end

  end
end
