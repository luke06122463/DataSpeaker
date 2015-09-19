'use strict';

angular.module('dataspeaker.login').factory('LoginService', [
  '$http',
  'RemoteUrl',
  'URL_DICT',
  function ($http, remoteUrlProvider, URL_DICT) {
    //Private methods
    var login = function (username, password) {
      var params = {
          username: username,
          password: password
        };
      var urlObj = remoteUrlProvider.getUrl(URL_DICT.USER_LOGIN, false);
      var options = {
          method: urlObj.action,
          url: urlObj.url,
          headers: urlObj.header,
          ignoreAuthModule: true,
          data: $.param(params)
        };
        
      return $http(options);
    };
    var logout = function () {
      var urlObj = remoteUrlProvider.getUrl(URL_DICT.USER_LOGOUT, false);
      var options = {
          method: urlObj.action,
          url: urlObj.url
        };
      return $http(options);
    };

    var hasUserLoggedIn = function(){
      var urlObj = remoteUrlProvider.getUrl(URL_DICT.CHECK_AUTHENTICATION, false);
      var options = {
          method: urlObj.action,
          url: urlObj.url,
          headers: urlObj.header,
          ignoreAuthModule: true,
          data:{}
        };
      return $http(options);
    };
    
    return {
      doLogin: function (username, password) {
        return login(username, password);
      },
      doLogout: logout,
      doAuthenticationCheck: hasUserLoggedIn
    };
  }
]);