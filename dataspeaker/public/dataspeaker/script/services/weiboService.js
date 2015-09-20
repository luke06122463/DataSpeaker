'use strict';

angular.module('dataspeaker.service').factory('WeiboService', [
  '$http',
  'RemoteUrl', 
  function ($http, remoteUrlProvider) {

    /*
    * retrieve user's personal information
    */
    var getUserInfo = function (uid) {
      var urlObj = remoteUrlProvider.getUrl("users.getUserInfo", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url+"?uid="+uid
      };      
      return $http(options);
    };

    /*
    * get the status of where the analysis is
    */
    var getStatus = function () {
      var urlObj = remoteUrlProvider.getUrl("users.getStatus", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url
      };      
      return $http(options);
    };

    /*
    * retrieve the analysis result back
    */
    var getResult = function () {
      var urlObj = remoteUrlProvider.getUrl("users.getResult", false);
      var options = {
        method: urlObj.action,
        url: urlObj.url
      };      
      return $http(options);
    };

    /*
    * trigger a task to do data collection and analysis
    */
    var startAnalysis = function () {
      var urlObj = remoteUrlProvider.getUrl("users.startAnalysis", false);
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
        getResult: getResult,
        startAnalysis: startAnalysis
      }
    };

  }
]);