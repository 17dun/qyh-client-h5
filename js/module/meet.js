$(function() {
	if (window.plus) {
		ADDR.init();
	} else {
		document.addEventListener("plusready", function() {
			ADDR.init();
		}, false);
	}
})
var ADDR = {
	point: null,
	map: null,
	hasOpen: false,
	centerAndZoom: function() {
		if (this.map) {
			this.map.centerAndZoom(this.point, 14);
		}
	},
	init: function() {
		var me = this;
		me.bindEvent();
		plus.geolocation.getCurrentPosition(function(pos) {
			var centerPoint = new BMap.Point(pos.coords.longitude, pos.coords.latitude);
			me.point = centerPoint;
			var map = new BMap.Map("container");
			me.map = map;
			map.centerAndZoom(centerPoint, 14);
			var myIcon = new BMap.Icon("img/point.png", new BMap.Size(20, 20));
			myIcon.setImageSize(new BMap.Size(20, 20))
			var marker = new BMap.Marker(centerPoint, {
				icon: myIcon
			});
			map.addOverlay(marker);
			var label = new BMap.Label("我的位置", {
				offset: new BMap.Size(-15, 18)
			});
			marker.setLabel(label);
			me.getPlaceData();
			me.getUserListData();
		}, null, {
			coordsType: 'bd09ll'
		})
	},
	bindEvent: function() {

	},
	showUserInfo: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name'),
			sex: $item.data('sex'),
			pic: $item.data('pic'),
			age: $item.data('age'),
			bollage: $item.data('bollage')
		};
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('user-info.html', 'user-info', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				openwn.evalJS('USERINFO.init(' + JSON.stringify(data) + ')')
			})

			USER.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开

				USER.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('user-info.html');
		}
	},

	getPlaceData: function() {
		var me = this;
		//projection 可以抽离出去
		var projection = new BMap.MercatorProjection();
		var pix = projection.lngLatToPoint(me.point);
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var addrList = JSON.parse(ajax.responseText);
				var opts = {
					width: 200, // 信息窗口宽度
					height: 50, // 信息窗口高度
					enableMessage: false,
					offset: new BMap.Size(2, -23)
				};
				$.each(addrList, function(i, item) {
					var mypoint = new BMap.Pixel(item.x, item.y);
					var projection = new BMap.MercatorProjection();
					var rs = projection.pointToLngLat(mypoint);
					var myIcon = new BMap.Icon("img/zhuo.png", new BMap.Size(44, 60));
					myIcon.setImageSize(new BMap.Size(22, 30))
					var marker2 = new BMap.Marker(rs, {
						icon: myIcon
					});
					var addrName = item.name;
					var addrPlace = item.addr;
					if (item.tel == 'undefined') {
						var addrtel = '暂无';
					} else {
						var addrtel = item.tel;
					};
					var content = '地址：' + addrPlace + '<br/>电话：' + addrtel;
					marker2.addEventListener("click", function(e) {
						var p = e.target;
						var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
						opts.title = addrName;
						var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
						me.map.openInfoWindow(infoWindow, point);
					});
					me.map.addOverlay(marker2);
				})

				function openInfo(content, e) {
					var p = e.target;
					var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
					var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
					map.openInfoWindow(infoWindow, point); //开启信息窗口
				}
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getPlaceListByDis&x=' + pix.x + '&y=' + pix.y + '&dis=10000');
		ajax.send();
	},

	getUserListData: function() {
		var me = this;
		//projection 可以抽离出去
		var projection = new BMap.MercatorProjection();
		var pix = projection.lngLatToPoint(me.point);
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var userList = JSON.parse(ajax.responseText);
				var opts = {
					width: 240, // 信息窗口宽度
					height: 70, // 信息窗口高度
					enableMessage: false,
					title: '场地',
					offset: new BMap.Size(2, -23)
				};

				$.each(userList, function(i, item) {
					var mypoint = new BMap.Pixel(item.x, item.y);
					var projection = new BMap.MercatorProjection();
					var rs = projection.pointToLngLat(mypoint);
					var myIcon = new BMap.Icon("img/you.png", new BMap.Size(44, 60));
					myIcon.setImageSize(new BMap.Size(22, 30));
					var content = '<div ontouchend="ADDR.showUserInfo($(this))" class="user-card" data-pic="' + item.pic + '" data-id="' + item.id + '" data-name="' + item.name + '" data-sex="' + item.sex + '" data-age="' + item.age + '" data-bollage="' + item.bollage + '">';
					content += '<img style="border-radius:10px;width:50px;height:50px;"  class="item-col" src="' + CONF.staticServer + '/images/' + item.pic + '">';
					content += '<div class="item-col" style="margin-left:0.5em;width:150px;">';
					content += '性别:' + CONF.sex[item.sex] + ' 年龄:' + item.age + '岁</br>';
					content += '惯用:' + CONF.paixing[item.paixing] + ' 擅长:' + CONF.style[item.style];
					content += '</div><div class="item-col user-card-bk"></div></div>';

					var marker2 = new BMap.Marker(rs, {
						icon: myIcon
					});
					marker2.addEventListener("click", function(e) {
						var p = e.target;
						var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
						opts.title = item.name;
						var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
						infoWindow.enableCloseOnClick();
						me.map.openInfoWindow(infoWindow, point);
					});
					me.map.addOverlay(marker2);
				})

				function openInfo(content, e) {
					var p = e.target;
					var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
					var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
					map.openInfoWindow(infoWindow, point); //开启信息窗口
				}
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getUserListByDis&x=' + pix.x + '&y=' + pix.y + '&dis=10000');
		ajax.send();
	},
	dis: function(a, b) {
		return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	}
}