'use strict';

angular.module('dataspeaker.gui').controller('DashboardController', [
	'$scope', 
	'RemoteProxy',
	'RemoteUrl', 
	'UserService',
	'WeiboService',
	'CHART_CONIFG_DICT',
	function($scope, remoteProxyService, remoteUrlProvider, userService, weiboService, CHART_CONIFG_DICT){
		console.log("start into DashboardController....");
		var user = userService.getUser().weiboUser;
		$scope.hasAnalyzed = ((userService.getStatus() > 0) ? true: false);
		console.log($scope.processStatus);
		//user personal information
		$scope.userProfile = {
			name: user.name,
			id: user.idstr,
			avatar: user.avatar_large,
			description: user.description,
			followersCnt: user.followers_count,
			friendsCnt: user.friends_count,
			messagesCnt: user.statuses_count,
			location: user.location
		}
		// set the default value for each chart
		$scope.pieChartConfig = CHART_CONIFG_DICT.pie.standard;
		$scope.mapChartConfig = CHART_CONIFG_DICT.map.customized;
		$scope.columnChartConfig = CHART_CONIFG_DICT.column.customized;

		$scope.genderChartConfig = angular.copy($scope.pieChartConfig);
		$scope.frequencyChartConfig = angular.copy($scope.pieChartConfig);
		$scope.catogeryChartConfig = angular.copy($scope.pieChartConfig);
		$scope.locationChartConfig = angular.copy($scope.mapChartConfig);
        $scope.locationChartConfig.series[0].allAreas = true;

        $scope.followersChartConfig = angular.copy($scope.columnChartConfig)
	        
		//$scope.locationChartConfig = {};


		// retrieve the analysis result back and init dashboard
    	weiboService.users.getResult()
    		.success(
    			function(data){
	        		console.log("DashboardController:: succeed to get analysis result");
	        		console.log(data.data);
	        		$scope.initGenderAnalysis(data.data.gender);
	        		$scope.initFrequencyAnalysis(data.data.frequency);
	        		$scope.initLocationAnalysis(data.data.location);
	        		$scope.initCatogeryAnalysis(data.data.catogery);
	        		$scope.initFollowersAnalysis(data.data.followers.follower_amount);
    			}
    		)
    		.error(
    			function(){
	        		console.log("DashboardController:: failed to get analysis result");
    			}
    		);

    	$scope.initGenderAnalysis = function(result) {
    		$scope.genderChartConfig.title.text = 'Gender';
			$scope.genderChartConfig.series[0].data = [
            	{name: "female", y: result.female_cnt},
				{name: "male", y: result.male_cnt},
				{name: "unknown", y: result.unknown_cnt}
            ];
		}

		$scope.initFrequencyAnalysis = function(result) {
    		$scope.frequencyChartConfig.title.text = 'Frequency';
			$scope.frequencyChartConfig.series[0].data = [
            	{name: "Daily Active", y: result.day_active},
				{name: "Monthly Active", y: result.month_active},
				{name: "Yearly Active", y: result.year_active},
				{name: "diving", y: result.no_active}
            ];
					
		}

		$scope.initCatogeryAnalysis = function(result) {
    		$scope.catogeryChartConfig.title.text = 'Authentication';
			$scope.catogeryChartConfig.series[0].data = [
            	{name: "Big V", y: result.v_cnt},
				{name: "Master", y: result.m_cnt},
				{name: "Genuine", y: result.g_cnt},
				{name: "Zombie", y: result.z_cnt}
            ];
					
		}

		$scope.initLocationAnalysis = function(result){
			$scope.locationChartConfig.series[0].data=result;
		};

		$scope.initFollowersAnalysis = function(result) {
    		$scope.followersChartConfig.title.text = 'Followers';
			$scope.followersChartConfig.series[0].data = result;
					
		}
		
	    console.log("getting out of the DashboardController...");
	}
]);