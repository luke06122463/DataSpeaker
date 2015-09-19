'use strict';

angular.module("dataspeaker.service").factory('RemoteProxy', function($http){ 	
 	var handleRequest = function(responsePromise, requestObj){
			responsePromise.success(function(data, status, headers, config) {
				if(typeof(requestObj.success)=="function"){	
					requestObj.success(data,requestObj.response);
				}
			});
		    responsePromise.error(function(data, status, headers, config) {
		    	console.log(status);
		        if(typeof(requestObj.error)=="function"){
		    		requestObj.error(data,requestObj.response);
		    	}
		    });
 	};
 	var client = {
		get:function(requestObj){
			var responsePromise = $http({
			url:requestObj.url,
			method:"GET"
			});
			handleRequest(responsePromise, requestObj);
		},
		post:function(requestObj){
			var responsePromise = $http({
			url:requestObj.url,
			method:"POST",
			data:requestObj.request
			});	
			handleRequest(responsePromise, requestObj);
		},
		delete:function(requestObj){
			var responsePromise = $http({
			url:requestObj.url,
			method:'DELETE',
			});
			handleRequest(responsePromise, requestObj);
		},
		put: function(requestObj){
			var responsePromise = $http({
			url:requestObj.url,
			method:"PUT",
			data:requestObj.request
			});	
			handleRequest(responsePromise, requestObj);
		}
	};
	return client; 
});