Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  ROOT                = 'dataspeaker'

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true
  # DataSpeaker account
  WeiboOAuth2::Config.api_key = "374187827"
  WeiboOAuth2::Config.api_secret = "cc5ef80576f7dbf26f9fcc26a67ef966"

  # Test account
  #WeiboOAuth2::Config.api_key = "1508020719"
  #WeiboOAuth2::Config.api_secret = "c8c236a23e6a36a714e9400d3992c59e"
  WeiboOAuth2::Config.redirect_uri = "http://10.43.81.136:3000/auth/callback"

  Mongo::Logger.level = ::Logger::INFO

  ## v4 is stable version
  DBURL = "127.0.0.1:27017"
  DBPREFIX = "v4_"
  DBMASTER = "v4_master"
  #DBURL = "127.0.0.1:27017"
  #DBPREFIX = "v3_"
  #DBMASTER = "v3_master"

  #momgodb_config_url = "127.0.0.1:27017"
  #momgodb_config_prefix = "v1_"
  #momgodb_config_master = "v1_master"

end
