'use strict';
angular.module('dataspeaker.login').controller('LoginController', [
  '$scope',
  '$rootScope',
  '$templateCache',
  'LoginService',
  'UserService',
  'AUTH_EVENTS',
  '$window',
  '$i18next',
  function ($scope, $rootScope, $templateCache, loginService, userService, AUTH_EVENTS, $window, $i18next) {
    /**
    * all the login page related information will be kept by loginController itself
    * so that login page can controll the behavior of login fails or other error-handling.
    */
    $scope.status = {
        isUseNameInitized: false, // initialization of username-inputbox means user did some modification on it
        isPasswardInitized: false, // when the empty inputbox is loaded, error message shouldn't be shown until empty again
        isLoggedIn: false
    }

    $scope.result = {
        loginSuccess: false,
        loginError: false,
        loginErrorMsg: 'Login failed',
        loginModalIsOpen: false,
        serverUrl: '/'
    }


    /*
    *  Watch area
    */

    // watch the change of username to find out whether the input has been modified
    $scope.$watch(function(){
        return $scope.username;
    },function(newVal, oldVal){
        if(typeof newVal != 'undefined')
            $scope.status.isUseNameInitized = true;
    });

    // watch password inputbox
    $scope.$watch(function(){
        return $scope.password;
    },function(newVal, oldVal){
        if(typeof newVal != 'undefined')
            $scope.status.isPasswardInitized = true;
    });

    $scope.handleLoginBtn = function () {
        console.log("loginController try to login");
        var user = userService.getUser();
        user.userName = $scope.username;
        $rootScope.$broadcast(AUTH_EVENTS.LOGIN_INITIATED, user);
        $scope.result.loginError = false;
        //$scope.loadingConfig.isLoading = true;
        loginService.doLogin($scope.username, $scope.password).success(handleLoginSuccess).error(handleLoginFailure);
    };

    /**
     * The handler method for success of login
     * @param data
     */
    var handleLoginSuccess = function (data) {
        if(data.login_flag){
            $scope.result.loginError = false;
            //$scope.loadingConfig.isLoading = false;
            $scope.result.loginSuccess = true;
            $scope.result.serverUrl = $scope.host;
            userService.setUser(true, data.login_data);
            //clear out the form so we do not have the password anymore.
            $scope.username = '';
            $scope.password = '';
            $rootScope.$broadcast(AUTH_EVENTS.LOGIN_SUCCESS, userService.getUser());
            //$scope.loginClose();
        }else{
            $scope.result.loginError = true;
            $scope.result.loginErrorMsg = data.login_notice;
            $scope.result.loginSuccess = false;

            //$scope.loadingConfig.isLoading = false;

            userService.setUser(false, {});
            $rootScope.$broadcast(AUTH_EVENTS.LOGIN_FAILED, data);
        }
    };
    /**
     * The handler method for error of login
     * @param response
     * @param status
     */
    var handleLoginFailure = function (response, status) {
      //console.log('handle failure', $scope, $scope.loginError);
      $scope.result.loginError = true;
      $scope.result.loginErrorMsg = response.message;
      $scope.result.loginSuccess = false;

      //$scope.loadingConfig.isLoading = false;

      userService.setUser(false, undefined, undefined, undefined, $rootScope.role);
      $rootScope.$broadcast(AUTH_EVENTS.LOGIN_FAILED, response);
    };
    //----------------------
    // LOGOUT
    // ---------------------
    /**
     * Simply sets the user as not logged in.
     */
    var handleLogoutSuccess = function () {
      userService.clearUser();
      $scope.result.loginSuccess = false;
      $scope.result.loginError = false;
      $rootScope.$broadcast(AUTH_EVENTS.LOGOUT_SUCCESS);
      $scope.reload();
    };
    var handleLogoutFailure = function (response, status) {
      $rootScope.$broadcast(AUTH_EVENTS.LOGOUT_FAILED, response);
      $scope.reload();
    };

    $scope.reload = function () {
      $window.location.href = '';
    };


    var doLogout = function () {
      loginService.doLogout().success(handleLogoutSuccess).error(handleLogoutFailure);
    };
    /**
     * LOGIN EVENT LISTENER
     */
    $rootScope.$on(AUTH_EVENTS.USER_LOGIN, function () {
      doLogin();
    });

    /**
     * LOGOUT EVENT LISTENER
     */
    $rootScope.$on(AUTH_EVENTS.USER_LOGOUT, function () {
      doLogout();
    });
    
  }
]);