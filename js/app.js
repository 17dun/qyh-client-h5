var APP = {
	run : function(callback){
		$(function() {
			if (window.plus) {
				callback.call(this);
			}else{
				$(document).on('plusready', function() {
					callback.call(this);
				});
			}
		})
	},
	init : function(){
		this.run(function(){
			//快速点击
			FastClick.attach(document.body);
			//绑定退出键
			plus.key.addEventListener("backbutton", function() {
				if (confirm("确认退出？")) {
					plus.runtime.quit();
				}
			}, false);
			//去除默认菜单
			document.oncontextmenu = function() {
				return false;
			};
		})
		
	},
	//尝试根据id获取页面，如果没有则创建之并挂载到当前webview的父页面，并得到页面的引用
	getPeerPageById : function(pageId,param){
		var me = this;
		if(plus.webview.getWebviewById(pageId)){
			var webviewObj = plus.webview.getWebviewById(pageId);
		}else{
			var webviewObj = plus.webview.create(pageId + '.html', pageId, {
				top: '45px',
				bottom: '50px'
			});
			
			plus.webview.currentWebview().append(webviewObj);
		}
		return webviewObj;
	},
	
	//尝试根据id获取页面，如果没有则创建之并挂载到当前webview，并得到页面的引用
	getSubPageById : function(pageId,param){
		var me = this;
		if(plus.webview.getWebviewById(pageId)){
			var webviewObj = plus.webview.getWebviewById(pageId);
		}else{
			var webviewObj = plus.webview.create(pageId + '.html', pageId, param);
			plus.webview.currentWebview().append(webviewObj);
		}
		return webviewObj;
	},

	ajax:function(options){
		
		var ajaxObj = new plus.net.XMLHttpRequest();

		//超时时间设置
		var timeout = options.timeout||60;

		//请求的url
		var url = options.url;

		//请求的数据
		var datas = options.data;

		var paramStr = '';

		//成功的回调
		var sucess = options.success;

		//失败的回调
		var fail = options.fail;

		

		//数据类型
		ajaxObj.onreadystatechange = function() {
			if (ajaxObj.readyState == 4) {
				if(ajaxObj.status == 200){
					success(ajaxObj.responseText);
				}else{
					fail(ajaxObj.statusText)
				}
			}
		}

		ajaxObj.open("GET",url);

		ajaxObj.send();
	},
	
	formatAge : function(date){
		var newDate = new Date();
	    var ageDate = new Date(date-0);
	    if(date!=0){
			return newDate.getFullYear()-ageDate.getFullYear();
		}else{
			return "未完善";
		}
	}
}
APP.init();
