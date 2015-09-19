class Location
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


  def get_provinces
    begin
      #
      # TODO: user the following code to fetch the provinces resource from weibo server rather than hard code
      # The reason for hard code is the result from weibo server is a string object rather than json object
      #
      #parameters = {:params=>{:access_token=>@session[:access_token],:country=>"001"},:content_type => 'application/json'}
      #provinces = RestClient.get("https://api.weibo.com/2/common/get_province.json",parameters)
      provinces = {
        11=> "北京", 12=> "天津", 13=> "河北", 14=> "山西", 15=> "内蒙古", 21=> "辽宁", 22=> "吉林", 23=> "黑龙江",
        31=> "上海", 32=> "江苏", 33=> "浙江", 34=> "安徽", 35=> "福建", 36=> "江西", 37=> "山东", 41=> "河南", 42=> "湖北", 
        43=> "湖南", 44=> "广东", 45=> "广西", 46=> "海南", 50=> "重庆", 51=> "四川", 52=> "贵州", 53=> "云南", 54=> "西藏", 
        61=> "陕西", 62=> "甘肃", 63=> "青海", 64=> "宁夏", 65=> "新疆", 71=> "台湾", 81=> "香港", 82=> "澳门", 100=> "其他",
        400=> "海外"
      }
    rescue=> e
      puts "exception happens in get_provinces: #{e.to_s}"
    end
    return provinces
  end

end