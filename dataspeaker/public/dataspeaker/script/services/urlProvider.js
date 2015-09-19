'use strict';

var dataspeakerProvider = angular.module("dataspeaker.provider");

//Init URL_MAP, TODO: get url map from json file
dataspeakerProvider.constant('URL_MAP',url_map);

dataspeakerProvider.provider('RemoteUrl', function(URL_MAP){
	this.urlDictionary = [];
	var fetchDataFromJson = function (name){
		var accessArray = name.split(".");
		var result = URL_MAP;
		for (var i=0; i< accessArray.length; i++){
			result = result[accessArray[i]];
		}
		return result;
	};
	this.getUrl = function(name, isFaked){
				var result = fetchDataFromJson(name);
				return isFaked ? result.faked : result.product;
			};
	this.addUrl = function(name, object){
				var result = fetchDataFromJson(name);
				for (var attr in object){
					result[attr] = object[attr];
				}
			};
	this.removeUrl = function(name){
				 	var accessArray = string_symbol.split(".");
					var result = URL_MAP;
					for (var i=0; i<accessArray.length -1 ; i++){
						result = result[accessArray[i]];
					}
					delete result[accessArray[i]];		
			};
	this.$get = function(){
		return {
			getUrl: this.getUrl,
			addUrl: this.addUrl,
			removeUrl: this.removeUrl
		};
	}
});