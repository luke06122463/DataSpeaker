'use strict';
angular.module('dataspeaker.login').provider('UserService', [
  '$httpProvider',
  function ($http) {
    //private properties
    var user = {
        isLoggedIn: false,
        isInitialized: false,
        userId: undefined,
        userName: '',
        avatar: '',
        status: 0,
        weiboUser: undefined
      };
    this.$get = [
      '$http',
      function ($http) {
        return {
          user: user,
          getUser: function () {
            return user;
          },
          setUser: function (isLoggedIn, userObj, status) {
            user.isLoggedIn = isLoggedIn;
            if(isLoggedIn){
              user.isInitialized = isLoggedIn;
              user.userId = userObj.id;
              user.userName = userObj.screen_name;
              user.avatar = userObj.profile_image_url;
              user.status = status;
              user.weiboUser = userObj;
            }
          },
          isUserLoggedIn: function () {
            return user.isLoggedIn;
          },
          isUserInitialized: function () {
            return user.isInitialized;
          },
          getUserRole: function () {
            return user.role;
          },
          getStatus: function () {
            return user.status;
          },
          getUserName: function () {
            return user.userName;
          },
          getUserId: function () {
            return user.userId;
          },
          getAvatar: function () {
            return user.avatar;
          },
          clearUser: function () {
            user.isLoggedIn = false;
          }
        };
      }
    ];
  }
]);