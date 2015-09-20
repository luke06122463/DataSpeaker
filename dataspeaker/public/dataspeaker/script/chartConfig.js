var chartConfig = {
	pie: {
		standard: {
			options:{
				chart:{
					type:"pie"
				},
				plotOptions:{
					series:{
						stacking:""
					}
				},
	            tooltip: {
					pointFormat: '<b>{point.y} ({point.percentage:.1f}%)</b>'
				},
			},
			series:[{
				data:[]
			}],
			title:{
				text:"Hello"
			},
			credits:{"enabled":false},
			loading:false,
			size:{},
			useHighStocks:false
		},
		customized: {
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
		}
	},
	map: {
		customized: {
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
		}
	},
	column: {
		customized: {
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
		                '0-99',
		                '100-199',
		                '200-299',
		                '300-399',
		                '400-499',
		                '500-599',
		                '600-699',
		                '700-799',
		                '800-899',
		                '900-999',
		                '>1000',
		            ],
	                labels: {
	                    rotation: -30,
	                    align: 'right'
	                },
		            title:{
		            	text: 'Followers Interval'
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: 'My Followers'
		            }
		        }
	        },
	        series: [{
				type: 'column',
				name: 'Followers',  // TODO: need I18n text here
				data: [],
			}],
	        title: {
	            text: "Followers"
	        },
	        loading: false
		}
	},
	line:{
		standard:{
		  options: {
		    chart: {
		      type: "line"
		    },
		    plotOptions: {
		      series: {
		        stacking: ""
		      }
		    },
		    xAxis: {
	            categories: [
	                '2010 Q1',
	                'Q2',
	                'Q3',
	                'Q4',
	                '2011 Q1',
	                'Q2',
	                'Q3',
	                'Q4',
	                '2012 Q1',
	                'Q2',
	                'Q3',
	                'Q4',
	                '2013 Q1',
	                'Q2',
	                'Q3',
	                'Q4',
	                '2014 Q1',
	                'Q2',
	                'Q3',
	                'Q4',
	                '2015 Q1',
	                'Q2',
	                'Q3',
	                'Q4'
	            ],
                labels: {
                    rotation: -30,
                    align: 'right'
                },
	            title:{
	            	text: 'Quarter'
	            }
	        }
		  },
		  series: [
		   {
		      data: [],
		      id: "s1",
		      name: "Status"
		    },
		    {
		      data: [],
		      id: "s2",
		      name: "Original Status"
		    }
		  ],
		  title: {
		    text: "Hello"
		  },
		  credits: {
		    enabled: false
		    },
		  loading: false,
		  size: {},
		  useHighStocks: false
		}
	}

};