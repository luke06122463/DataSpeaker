module UtilityHelper
  class Utility

    def self.calculate_day_diff(created_at=nil)
      diff = 0
      begin
        last_refresh_time_utc = Time.zone.parse(created_at).utc
        now = Time.now.utc
        diff = (now - last_refresh_time_utc)/(60*60*24)
      rescue => e
        puts "exception happens in set_user_followers: #{e.to_s}"
      end
      return diff
    end

  end
end
