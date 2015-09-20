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
		// retrieve user's personal information from userService
		var user = userService.getUser().weiboUser;

		//status = 0 means the initization has not started
		//status = 8 means the initization of followers analysis has been done. User can see followers views.
		//status = 12 means the initization for statuses analysis is ready. User can see statuses views.
		$scope.hasAnalyzed = ((userService.getStatus() > 0) ? true: false);
		$scope.hasStatusesAnalyzed = ((userService.getStatus() > 8) ? true: false);

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
		$scope.lineChartConfig = CHART_CONIFG_DICT.line.standard;

		// initialize config for charts
		$scope.genderChartConfig = angular.copy($scope.pieChartConfig);
		$scope.frequencyChartConfig = angular.copy($scope.pieChartConfig);
		$scope.catogeryChartConfig = angular.copy($scope.pieChartConfig);
		$scope.allStatusCatogeryChartConfig = angular.copy($scope.pieChartConfig);
		$scope.originalStatusCatogeryChartConfig = angular.copy($scope.pieChartConfig);

		$scope.locationChartConfig = angular.copy($scope.mapChartConfig);
        $scope.locationChartConfig.series[0].allAreas = true;

        $scope.followersChartConfig = angular.copy($scope.columnChartConfig)
        $scope.registerChartConfig = angular.copy($scope.columnChartConfig)

        $scope.timelineChartConfig = angular.copy($scope.lineChartConfig)
	        
		//$scope.locationChartConfig = {};

		if($scope.hasAnalyzed){
			// retrieve the analysis result back and init dashboard
	    	weiboService.users.getResult()
	    		.success(
	    			function(data){
		        		console.log("DashboardController:: succeed to get analysis result");
		        		console.log(data.data);
		        		// get the analysis result back from mongodb
		        		$scope.initGenderAnalysis(data.data.gender);
		        		$scope.initFrequencyAnalysis(data.data.frequency);
		        		$scope.initLocationAnalysis(data.data.location);
		        		$scope.initCatogeryAnalysis(data.data.catogery);
		        		$scope.initFollowersAnalysis(data.data.followers.follower_amount);
		        		$scope.initRegisterTimeAnalysis(data.data.register_time);

		        		$scope.initTimelineAnalysis(data.data.all_timeline, data.data.original_timeline);
		        		$scope.initAllStatusCatogeryAnalysis(data.data.all_catogery);
		        		$scope.initOriginalStatusCatogeryAnalysis(data.data.original_catogery);
	    			}
	    		)
	    		.error(
	    			function(){
		        		console.log("DashboardController:: failed to get analysis result");
	    			}
	    		);
    	}
    	/*
		*	initialize gender chart
    	*/
    	$scope.initGenderAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.genderChartConfig.title.text = 'Gender';
			$scope.genderChartConfig.series[0].data = [
            	{name: "female", y: result.female_cnt},
				{name: "male", y: result.male_cnt},
				{name: "unknown", y: result.unknown_cnt}
            ];
		};

    	/*
		*	initialize frequency chart
    	*/
		$scope.initFrequencyAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.frequencyChartConfig.title.text = 'Frequency';
			$scope.frequencyChartConfig.series[0].data = [
            	{name: "Daily Active", y: result.day_active},
				{name: "Monthly Active", y: result.month_active},
				{name: "Yearly Active", y: result.year_active},
				{name: "diving", y: result.no_active}
            ];
					
		};


    	/*
		*	initialize follower catogery chart
    	*/
		$scope.initCatogeryAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.catogeryChartConfig.title.text = 'Authentication';
			$scope.catogeryChartConfig.series[0].data = [
            	{name: "Big V", y: result.v_cnt},
				{name: "Master", y: result.m_cnt},
				{name: "Genuine", y: result.g_cnt},
				{name: "Zombie", y: result.z_cnt}
            ];
					
		};


    	/*
		*	initialize follower location chart
    	*/
		$scope.initLocationAnalysis = function(result){
			if(typeof result == 'undefined') return;
			$scope.locationChartConfig.series[0].data=result;
		};


    	/*
		*	initialize follower's followers chart
    	*/
		$scope.initFollowersAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.followersChartConfig.title.text = 'Followers';
			$scope.followersChartConfig.series[0].data = result;
					
		};


    	/*
		*	initialize register time chart
    	*/
		$scope.initRegisterTimeAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.registerChartConfig.title.text = 'Register Time';
			$scope.registerChartConfig.series[0].data = result;
			$scope.registerChartConfig.options.xAxis.categories = [
				'2006', '2007', '2008', '2009', '2010', 
				'2011', '2012', '2013', '2014', '2015'
			];
					
		};


    	/*
		*	initialize statuses timeline chart
    	*/
		$scope.initTimelineAnalysis = function(allTimeline, originalTimeline){
			if(typeof allTimeline == 'undefined' || typeof originalTimeline == 'undefined') return;
    		$scope.timelineChartConfig.title.text = 'Timeline';
    		$scope.timelineChartConfig.series[0].data = allTimeline.timeline;
    		$scope.timelineChartConfig.series[1].data = originalTimeline.timeline;
		};


    	/*
		*	initialize statuses catogery chart
    	*/
		$scope.initAllStatusCatogeryAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.allStatusCatogeryChartConfig.title.text = 'Catogery(all)';
			$scope.allStatusCatogeryChartConfig.series[0].data = [
            	{name: "picture", y: result.picture},
				{name: "video", y: result.video},
				{name: "music", y: result.music},
				{name: "others", y: result.others}
            ];
		};

    	/*
		*	initialize original statuses catogery chart
    	*/
		$scope.initOriginalStatusCatogeryAnalysis = function(result) {
			if(typeof result == 'undefined') return;
    		$scope.originalStatusCatogeryChartConfig.title.text = 'Catogery(original)';
			$scope.originalStatusCatogeryChartConfig.series[0].data = [
            	{name: "picture", y: result.picture},
				{name: "video", y: result.video},
				{name: "music", y: result.music},
				{name: "others", y: result.others}
            ];
		};

    	/*
		*	trigger a task to do data collection and data analysis
    	*/
		$scope.collectAndAnalyze = function(){
			alert("Task has been triggered. You need to wait about 30s and refresh the page to see the analysis result");
			weiboService.users.startAnalysis();
		}

	    console.log("getting out of the DashboardController...");
	}
]);