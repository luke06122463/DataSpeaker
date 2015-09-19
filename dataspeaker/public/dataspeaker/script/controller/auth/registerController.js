'use strict';
angular.module('dataspeaker.login').controller('RegisterController', [
  '$scope',
  '$rootScope',
  '$templateCache',
  'LoginService',
  'UserService',
  'AUTH_EVENTS',
  '$window',
  '$i18next',
  function ($scope, $rootScope, $templateCache, loginService, userService, AUTH_EVENTS, $window, $i18next) {


    $scope.handleRegisterBtn = function () {
        console.log("loginController try to login");
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
    
    
  }
]);