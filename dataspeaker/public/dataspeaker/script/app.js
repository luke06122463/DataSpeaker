'use strict';

angular
  .module('dataspeaker.gui', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'jm.i18next',
    'highcharts-ng',
    'dataspeaker.login',
    'dataspeaker.service',
    'dataspeaker.provider',
    'wu.masonry'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider      
      .when('/', {
        templateUrl: '/dataspeaker/views/dashboard.html',
        controller: 'DashboardController'
      })
      .when('/login', {
        templateUrl: 'dataspeaker.login.login-flatUiPage.html',//,'dataspeaker.login.login-loginPage.html'
        controller: 'LoginController'//'AdminController'
      }) 
      .when('/register', {
        templateUrl: 'dataspeaker.login.register-flatUiPage.html'
      })      
      .when('/home', {
        templateUrl: '/dataspeaker/views/dashboard.html'
      })      
      .when('/history', {
        templateUrl: '/dataspeaker/views/dashboard.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .constant('AUTH_EVENTS',{
    LOGIN_SUCCESS: 'user:loginSuccess',
    LOGIN_FAILED: 'user:loginFailed',
    LOGIN_INITIATED: 'user:loginInitiated',
    LOGOUT_SUCCESS: 'user:logoutSuccess',
    LOGOUT_FAILED: 'user:logoutFailed',
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_AUTHENTICATION: 'user:authentication',
    ACCESS_DENY: 'user:accessDeny',
    AUTHENTICATION_EXPIRED: 'user:authenticationExpired'
  })
  .constant('URL_DICT',{
    CHECK_AUTHENTICATION: 'login.checkAuthentication',
    USER_LOGIN: 'login.userLogin',
    USER_LOGOUT: 'login.userLogout'
  })
  .constant('CHART_CONIFG_DICT',chartConfig)
  .run([
    '$rootScope', 
    'UserService', 
    'AUTH_EVENTS', 
    '$route',
    function ($rootScope, userService, AUTH_EVENTS, $route){
      $rootScope.$on('$routeChangeStart', function(e, curr, prev){
        var node = curr;

        //check whether dpsearch support current browser
        if(node.originalPath == '/login'){
          //do nothing. show the login page for the user to login
          console.log("APP:: Do nothing, for user wants to visit login page");
        }else if(node.originalPath == '/register'){
          //do nothing. show the login page for the user to login
          console.log("APP:: Do nothing, for user wants to visit register page");
        }else if(!userService.isUserInitialized()){
          /* Check whether user has logged in or not. If user has loggin in then redirect him to where he wants to go. Otherwise, go to login page
           *  So the scenario for this case are following
           *  1. access the page by specifing the url, eg. http://localhost/bsm, http://localhost/bsm#/search
           *  2. refresh the page, eg. F5 or clear the browser
           */
          console.log("APP:: try to broadcast the Authentication Event since user has not logged in yet");
          /* Prevent user from accessing the view he requests since we donot whether he has logged in or not
          * So that we wouldn't see the changing from what user requests to the login view
          */
          e.preventDefault();
          $rootScope.$broadcast(AUTH_EVENTS.USER_AUTHENTICATION, node.originalPath);
        }else{
          console.log("APP:: user has logged in because isUserInitialized is true. let it visit =>" + node.originalPath);
        }
        
      });
    }
  ]);
