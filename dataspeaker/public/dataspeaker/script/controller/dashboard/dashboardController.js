'use strict';

angular.module('dataspeaker.gui').controller('DashboardController', [
	'$scope', 
	'RemoteProxy',
	'RemoteUrl', 
	'UserService',
	'WeiboService',
	function($scope, remoteProxyService, remoteUrlProvider, userService, weiboService){
		console.log("start into DashboardController....");
		var user = userService.getUser().weiboUser;
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
		$scope.chartConfig = {
	        options: {
	            chart: {
	                type: 'pie'
	            },
	            tooltip: {
					pointFormat: '<b>{point.y} ({point.percentage:.1f}%)</b>'
				},
	        	plotOptions: {
					pie: {
						//allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							distance: -30,
			                color: 'white',
							enabled: true,
							style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    },
			                connectorColor: 'silver'
						},
						showInLegend: true
					}
			  	}
	        },
       
	        series: [{
	            data: []
	        }],
	        title: {
	    		text: 'Gender'
	        },

	        loading: false
		};
		$scope.genderChartConfig = angular.copy($scope.chartConfig);
		$scope.frequencyChartConfig = angular.copy($scope.chartConfig);
		$scope.catogeryChartConfig = angular.copy($scope.chartConfig);
		$scope.locationChartConfig = {
	        options: {
	            legend: {
	                enabled: false
	            },
	            plotOptions: {
	                map: {
	                    mapData: Highcharts.maps['cn-with-city'],
	                    joinBy: ['name']
	                }
	            },
	        },
	        chartType: 'map',
	        title: {
	            text: 'Location'
	        },
	        series: [{
	             // Basic China map
	            data: [],
	            cursor:'pointer',
	            dataLabels: {
	                enabled: true,
	                format: '{point.name}',
	                style: {
	                    fontSize: '8px'
	                }
	            },
	            tooltip: {
	                enabled: true,
	                headerFormat: '',
	                pointFormat: '{point.name}: <b>{point.value}</b>'
	            }
	        }]
	       
	    };
        $scope.locationChartConfig.series[0].allAreas = true;

        $scope.followersChartConfig = {
	        options: {
	           chart: {
					type: 'column',
					zoomType: 'xy',										
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				legend: {
					enabled: false
				},
				tooltip: {
					 formatter: function() {
	        			return  this.x + ' <br> <b>'+ this.series.name +':' + this.y + '</b>';
	    				}
				},			
				plotOptions: {
					 column: {
	                    pointPadding: 0.2,
	                    borderWidth: 0,
				        allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							distance: -30,
			                color: 'white',
							enabled: true,
							style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    },
		                connectorColor: 'silver'
						},
						showInLegend: true
	                }
				},
				xAxis: {
		            categories: [
		                '0KB-100KB',
		                '100KB-1M',
		                '1M-10M',
		                '10M-100M',
		                '>100M'
		            ]
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            }
		        }
	        },
	        //end options
	        series: [{
				type: 'column',
				name: 'Count',  // TODO: need I18n text here
				data: srcData.results,
				point: {
					events: {
						click: function (event) {
							scope.showChart = false;
							scope.$emit('search:fileSize', this.id);
						}
					}
				}
			}],

	        title: {
	            text: title
	        },

	        loading: false
		};
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
		
	    console.log("getting out of the DashboardController...");
	}
]);