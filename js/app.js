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
	
	closeWebview:function(){
		var ws = plus.webview.currentWebview();
		ws.close();
	},
	
	init : function(){
		
		this.run(function(){
			FastClick.attach(document.body);
			//绑定退出键
			plus.key.addEventListener("backbutton", function() {
				if (confirm("确认退出？")) {
					plus.runtime.quit();
				}
			}, false);
			
			window.back = function() {
				ws = plus.webview.currentWebview();
				ws.close();
			};
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

	//公共的定位组件，输入地图渲染的div的ID：contentId，地图放大比例size,回调 sucess，失败回调fail
	
	initCurrentPosition :function(options){
		var contentId = options.id;
		var mapSize = options.size;
		var success = options.success;
		plus.geolocation.getCurrentPosition(function(pos) {
			var centerPoint = new BMap.Point(pos.coords.longitude, pos.coords.latitude);
			var map = new BMap.Map(contentId);
			map.centerAndZoom(centerPoint, mapSize);
			var myIcon = new BMap.Icon("img/point.png", new BMap.Size(20, 20));
			myIcon.setImageSize(new BMap.Size(20, 20))
			var marker = new BMap.Marker(centerPoint, {icon: myIcon});
			map.addOverlay(marker);
			var label = new BMap.Label("我的位置", {
				offset: new BMap.Size(-15, 18)
			});
			marker.setLabel(label);
			success({'centerPoint':centerPoint,'map':map});
		}, null, {
			coordsType: 'bd09ll',
			provider:'baidu'
		});
	},
	
	
	//将经纬度转换为像素点
	lngLatToPoint : function(lngLat){
		var projection = new BMap.MercatorProjection();
		var point = projection.lngLatToPoint(lngLat);
		return point;
	},
	
	//将像素点转换为经纬度
	pointToLngLat : function(point){
		var projection = new BMap.MercatorProjection();
		var lngLat = projection.pointToLngLat(point);
		return lngLat;
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
		var success = options.success;
		//失败的回调
		var fail = options.fail;
		//数据类型
		
		if(datas){
			var dataList = [];
			for (key in datas){
				if (typeof datas[key] != 'undefined')
					dataList.push(key + '=' + decodeURIComponent(datas[key]));
			}
			if(url.indexOf('/?')!=-1){
				url = url+'&'+dataList.join('&');
			}else{
				url = url+'/?'+dataList.join('&');
			}
		}
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
