module UtilityHelper
  class Utility

    def self.calculate_day_diff(created_at=nil)
      diff = 0
      begin
        time_utc = Time.zone.parse(created_at).utc
        now = Time.now.utc
        diff = (now - time_utc)/(60*60*24)
      rescue => e
        puts "exception happens in set_user_followers: #{e.to_s}"
      end
      return diff
    end

    def self.convert_to_utc(created_at=nil)
      diff = 0
      begin
        time_utc = Time.zone.parse(created_at).utc
      rescue => e
        puts "exception happens in set_user_followers: #{e.to_s}"
      end
      return time_utc
    end

    def self.calculate_day_off(created_at=nil, base=nil)
      diff = 0
      begin
        time_utc = Time.zone.parse(created_at).utc
        base_utc = Time.utc(base,1,1,0,0,1)#Time.now.utc
        diff = (time_utc - base_utc)/(60*60*24)
      rescue => e
        puts "exception happens in set_user_followers: #{e.to_s}"
      end
      return diff
    end

    def self.calcute_quarter_num(base=nil)
      return (Time.now.utc.year - base + 1) * 4;
    end

  end
end
