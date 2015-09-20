var url_map = {
	"login": {
		"checkAuthentication":{
			"product":{
				"url":"auth/check_authentication",
				"action":"post", 
				"header": { 'Content-Type': 'application/x-www-form-urlencoded' }
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
		"userLogin":{
			"product":{
				"url":"auth/prologin",
				"action":"post", 
				"header": { 'Content-Type': 'application/x-www-form-urlencoded' }
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
		"userLogout":{
			"product":{
				"url":"auth/logout",
				"action":"get"
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
	},
	"users": {
		"getUserInfo":{
			"product":{
				"url":"users/info",
				"action":"get"
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
		"getStatus":{
			"product":{
				"url":"users/status",
				"action":"get"
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
		"getResult":{
			"product":{
				"url":"users/result",
				"action":"get"
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		},
		"startAnalysis":{
			"product":{
				"url":"users/analyze",
				"action":"get"
			}, 
			"faked":{"url":"/admin/sample/result.json", "action":"get"}
		}
	}
};
