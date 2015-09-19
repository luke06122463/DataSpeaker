'use strict';
angular.module('dataspeaker.gui').controller('AdminController', [
	'$scope', 
	'$route',
	'$rootScope', 
	'$location',
	'LoginService',
	'UserService',
	'AUTH_EVENTS',
	'RemoteProxy',
	'RemoteUrl', 
	'WeiboService',
	function($scope, $route, $rootScope, $location, loginService, userService, AUTH_EVENTS, remoteProxyService, remoteUrlProvider, weiboService){
		console.log("step into AdminController");
		//init css for the whole website
		$scope.website = {
			css: {
				color: '#515151' //grey
			},
			layout: {
				showNavigationItem: false,
				showLoginItem: true,
				showRegisterItem: true,
				showUserProfileMenu: false
			},
			user: {
				name: '',
				avatar:''
			}
		};
		$rootScope.$on(AUTH_EVENTS.USER_AUTHENTICATION, function(event, args){
			console.log('AdminController:: USER_AUTHENTICATION event'+args);
			loginService.doAuthenticationCheck().success($scope.handleAuthenticationSuccess).error($scope.handleAuthenticationFailure);
		});

		$scope.handleAuthenticationSuccess = function(data) {
	        if(data.has_login){
	        	console.log("AdminController:: authentication has passed.");
	        	if(userService.isUserLoggedIn() && userService.isUserInitialized()){
	        		// since user has logged in, the page has finished its draw and all menus are ready, so do not prevent user's request
	        		console.log("AdminController:: userService is not empty and the drawing of the page has been ready");
		        }else{
		        	/* userService is unintialized or unloggedin but user can pass authentication, so it must be:
		        	*	1. refresh the current page after he logged in
		        	*	2. open a new tab after he logged in
		        	* So load the user information back to useService and do not prevent user's request
		        	*/
		        	console.log("AdminController:: userService is empty and load the information for userService");
		            console.log("AdminController:: user session is as below:");
		            console.log(data.login_data);
		        	weiboService.users.getUserInfo(data.login_data.uid)
		        		.success(
		        			function(data){
				        		console.log("AdminController:: succeed to get user information");
		            			userService.setUser(true, data.info);
		            			console.log(data);
		            			// inform AngularJS to draw the page
		            			$rootScope.$broadcast(AUTH_EVENTS.LOGIN_SUCCESS, userService.getUser());
		        			}
		        		)
		        		.error(
		        			function(){
				        		console.log("AdminController:: failed to get user information");
					            userService.setUser(false, {});
					            $location.path('/login');
		        			}
		        		);
		            /*userService.setUser(true, data.login_data);
		            // inform AngularJS to draw the page
		            $rootScope.$broadcast(AUTH_EVENTS.LOGIN_SUCCESS, userService.getUser());*/
		        }
	            //$location.path('/option');
	        }else{
	        	console.log("AdminController:: authentication failed to passed.");
	        	if(userService.isUserInitialized()){
	        		// user authentication is expired due to some reason. 
	        		// todo: show relogin dailog
	        		console.log("AdminController:: authentication has been expired and show the relogin dailog");
	        	}else{
	        		// it's user's first visit to this page. redirect to login page.
	        		console.log("AdminController:: user has not logged in. redirect him to login page");
		            userService.setUser(false, {});
		            $location.path('/login');
					$scope.website.css.color= '#515151'; //white
		        }
	        }
		};

		$scope.handleAuthenticationFailure = function(){
			console.log('AdminController:: something is wrong.');
		}

		/*
		 * if login successfully, reset the profile- menu and navigation-menu
		 */
		$rootScope.$on(AUTH_EVENTS.LOGIN_SUCCESS, function(event, args){

			// change the background to white
			//$scope.website.css.color= '#E7F3FA';//#fff'; //white
			$scope.website.css.color= '#fff'; //white

			// control which layout should be displayed which are not
			$scope.website.layout.showNavigationItem=true;
			$scope.website.layout.showLoginItem=false;
			$scope.website.layout.showRegisterItem=false;
			$scope.website.layout.showUserProfileMenu=true;

			// redirect user to where he want to go
		    $location.path('/');

			// set greet message for user, "Welcome, **"
			if(args.isLoggedIn){
				//get the user name
				$scope.website.user.name = args.userName;
				$scope.website.user.avatar = args.avatar;//'http://tp2.sinaimg.cn/1695054681/50/5684772094/1';
			}

		});


	}
]);

