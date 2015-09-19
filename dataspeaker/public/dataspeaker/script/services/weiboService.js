'use strict';

angular.module('dataspeaker.service').factory('WeiboService', [
  '$http',
  'RemoteUrl', 
  function ($http, remoteUrlProvider) {

      /*sample
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
        
      return $http(options);*/

    //Private methods
    var getUserInfo = function (uid) {
      var urlObj = remoteUrlProvider.getUrl("users.getUserInfo", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url+"?uid="+uid
      };      
      return $http(options);
    };


    var getStatus = function () {
      var urlObj = remoteUrlProvider.getUrl("users.getStatus", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url
      };      
      return $http(options);
    };

    var getResult = function () {
      var urlObj = remoteUrlProvider.getUrl("users.getResult", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url
      };      
      return $http(options);
    };
    
    return {
      users: {
        getUserInfo: getUserInfo,
        getStatus: getStatus,
        getResult: getResult
      }
    };

  }
]);