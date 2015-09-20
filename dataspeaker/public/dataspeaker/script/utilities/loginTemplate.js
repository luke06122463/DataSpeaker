'use strict';
angular.module('dataspeaker.login.templates', []).run([
  '$templateCache',
  function ($templateCache) {
    var loginTemp = {
        loginTemplateOpen: '<div class="loginContainer" id="loginContainer" ng-show="!result.loginSuccess">',
        //this header ONLY appears on the full page.
        loginHeader: '' + '<label class="loginTitle">{{"bsm:login.title" | i18next}}</label>',
        loginErrorArea: '' 
            + '<div class="loginErrorArea">'
                + '<div ng-show="status.isUseNameInitized && loginForm.inputUsername.$error.required" class="alert alert-danger">{{"bsm:login.usernameEmptyErrorTip" | i18next}}</div>'
                + '<div ng-show="status.isPasswardInitized && !(loginForm.inputUsername.$error.required) && loginForm.inputPassword.$error.required" class="alert alert-danger">{{"bsm:login.passwordEmptyErrorTip" | i18next}}</div>'
                + '<div ng-show="result.loginError && !(loginForm.inputUsername.$error.required) && !(loginForm.inputPassword.$error.required)" class="alert alert-danger">{{result.loginErrorMsg}}</div>'
            + '</div>',
        loginFormWrapOpen: ''  + '<form class="form-horizontal" id="loginForm" name="loginForm" autocomplete="off">',
        loginTemplate: '' 
            + '<div class="emc-flex-column" style="overflow:auto;">'
                + '<div class="form-row required">' 
                    + '<div class="form-row-input">' 
                        + '<input type="text" tabindex="0" autofocus id="inputUsername" name="inputUsername" class="fill" placeholder=\'{{"bsm:login.userNameHolder" | i18next}}\' ng-model="username" required/>' 
                        //+ '<span ng-show="loginForm.inputUsername.$dirty && loginForm.inputUsername.$error.required" class="help-block">Username is required</span>'
                    + '</div>' 
                + '</div>' 
                + '<div class="form-row required">' 
                    + '<div class="form-row-input">' 
                        + '<input type="password" tabindex="0" id="inputPassword" name="inputPassword" class="fill" placeholder=\'{{"bsm:login.passwordHolder" | i18next}}\' ng-model="password" required/>' 
                    + '</div>' 
                + '</div>'
            + '</div>',
        loginFeedback: '',
        loginFormWrapClose: '' + '</form>',
        //these buttons ONLY appear on the full page.
        loginButtons: '' 
            + '<div class="form-row-footer">' 
                + '<button type="submit" id="loginSubmit" tabindex="1" ng-disabled="loginForm.$invalid" class="emc-button emc-button-primary" ng-click="handleLoginBtn()">{{"bsm:login.signIn" | i18next}}</button>' 
            + '</div>',
        //loading bar
        loginLoading: '',
        // closes login header
        loginTemplateClose: '' + '</div>'
    };

    var reLoginTemp = {
        loginBackdrop: '' + '<div class="emc-login-backdrop login-backdrop"></div>' ,
        loginBegin: '' + '<div id="emcLoginDialog" class="emc-login login-div">',
        //this header ONLY appears on the full page.
        loginHeader: '' + '<label class="loginTitle">{{"bsm:login.title" | i18next}}</label>',
        loginErrorArea: '' 
            + '<div class="loginErrorArea">'
                //+ '<div ng-show="status.isUseNameInitized && status.isPasswardInitized" class="alert alert-danger">{{msg}}</div>'
                + '<div ng-show="status.isUseNameInitized && reLoginForm.reLoginInputUsername.$error.required" class="alert alert-danger">{{"bsm:login.usernameEmptyErrorTip" | i18next}}</div>'
                + '<div ng-show="status.isPasswardInitized && !(reLoginForm.reLoginInputUsername.$error.required) && reLoginForm.reLoginInputPassword.$error.required" class="alert alert-danger">{{"bsm:login.passwordEmptyErrorTip" | i18next}}</div>'
                + '<div ng-show="result.loginError && !(reLoginForm.reLoginInputUsername.$error.required) && !(reLoginForm.reLoginInputPassword.$error.required)" class="alert alert-danger">{{result.loginErrorMsg}}</div>'
            + '</div>',
        loginFormWrapOpen: ''  + '<form class="form-horizontal" id="reLoginForm" name="reLoginForm" autocomplete="off">',
        loginTemplate: '' 
            + '<div class="emc-flex-column" style="overflow:auto;">'
                + '<div class="form-row">' 
                    + '<div class="form-row-input">' 
                        + '<input type="text" tabindex="0" autofocus id="reLoginInputUsername" name="reLoginInputUsername" class="fill" placeholder=\'{{"bsm:login.userNameHolder" | i18next}}\' ng-model="username" required/>' 
                    + '</div>' 
                + '</div>' 
                + '<div class="form-row form-row-alert">' 
                    + '<div class="form-row-input">' 
                        + '<input type="password" tabindex="0" id="reLoginInputPassword" name="reLoginInputPassword" class="fill" placeholder=\'{{"bsm:login.passwordHolder" | i18next}}\' ng-model="password" required/>' 
                    + '</div>' 
                + '</div>'
            + '</div>',
        loginFormWrapClose: '' + '</form>',
        //these buttons ONLY appear on the full page.
        loginButtons: '' 
            + '<div class="form-row-footer">' 
                + '<button type="submit" id="loginSubmit" tabindex="1"  ng-disabled="reLoginForm.$invalid" class="emc-button emc-button-primary" ng-click="handleLoginBtn()">{{"bsm:login.signIn" | i18next}}</button>'  
            + '</div>',
        //loading bar
        loginLoading: '' + '<emc-loading config="loadingConfig"></emc-loading>',
        loginEnd: '</div>'
    };

    var flatUILoginTemp = ''
        +'<div class="bsm-login-container">'
          +'<div class="login-form">'
            +'<div class="control-group">'
              +'<input type="text" class="bsm-login-field" value="" placeholder="Enter your name" id="login-name" ng-model="username">'
              +'<label class="login-field-icon fui-user" for="login-name"></label>'
            +'</div>'
            +'<div class="control-group">'
              +'<input type="password" class="bsm-login-field" value="" placeholder="Password" id="login-pass" ng-model="password">'
              +'<label class="login-field-icon fui-lock" for="login-pass"></label>'
            +'</div>'
            +'<a class="btn btn-primary btn-large btn-block" href  ng-click="handleLoginBtn()">Login</a>'
            +'</br><a class="btn btn-primary btn-large btn-block" style="margin-top:-15px" href="/auth/authorization">Weibo Account</a>'
          +'</div>'
        +'</div>';

    var flatUIRegisterTemp = ''
        +'<div class="bsm-login-container">'
          +'<div class="login-form">'
            +'<div class="control-group">'
              +'<input type="text" class="bsm-login-field" value="" placeholder="Enter your name" id="login-name" ng-model="username">'
              +'<label class="login-field-icon fui-user" for="login-name"></label>'
            +'</div>'
            +'<div class="control-group">'
              +'<input type="password" class="bsm-login-field" value="" placeholder="Password" id="login-pass" ng-model="password">'
              +'<label class="login-field-icon fui-lock" for="login-pass"></label>'
            +'</div>'
            +'<div class="control-group">'
              +'<input type="password" class="bsm-login-field" value="" placeholder="Confirm Password" id="login-pass" ng-model="confirmPwd">'
              +'<label class="login-field-icon fui-lock" for="login-pass"></label>'
            +'</div>'
            +'<a class="btn btn-primary btn-large btn-block" href  ng-click="handleLoginBtn()">Register</a>'
            +'<a class="login-link" href="#/login" style="text-decoration: underline">Already have an account?</a>'
          +'</div>'
        +'</div>';

    $templateCache.put('dataspeaker.login.login-loginModal.html', ''
        + reLoginTemp.loginBackdrop + reLoginTemp.loginBegin + reLoginTemp.loginHeader 
        + reLoginTemp.loginErrorArea + reLoginTemp.loginFormWrapOpen + reLoginTemp.loginTemplate 
        + reLoginTemp.loginButtons + reLoginTemp.loginFormWrapClose + reLoginTemp.loginLoading + reLoginTemp.loginEnd);

    $templateCache.put('dataspeaker.login.login-loginPage.html', ''
        + loginTemp.loginTemplateOpen + loginTemp.loginHeader + loginTemp.loginErrorArea + loginTemp.loginFormWrapOpen 
        + loginTemp.loginTemplate +  loginTemp.loginFeedback 
        + loginTemp.loginButtons + loginTemp.loginFormWrapClose + loginTemp.loginLoading + loginTemp.loginTemplateClose);

    $templateCache.put('dataspeaker.login.login-flatUiPage.html',flatUILoginTemp);
    $templateCache.put('dataspeaker.login.register-flatUiPage.html',flatUIRegisterTemp);
  }
]);