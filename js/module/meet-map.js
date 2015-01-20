var MEETMAP = {
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
		if(me.map){
			me.map = null;
		}
		APP.initCurrentPosition({
			id:'container',
			size:14,
			success:function(rt){
				me.point = rt.centerPoint;
				me.map = rt.map;
				me.getPlaceData();
			}
		});
	},
	bindEvent: function() {
		
		
	},
	//显示地点信息
	showPlaceInfo: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name'),
			addr: $item.data('addr'),
			tel: $item.data('tel'),
			point: $item.data('point'),
			city: $item.data('city'),
			x: $item.data('x'),
			y: $item.data('y')
		}
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('addr-info.html', 'addr-info', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				openwn.evalJS('addrInfoPageInit(' + JSON.stringify(data) + ')')
			})

			MEETMAP.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开

				MEETMAP.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-info.html');
		}
	},
	renderPlaceList : function(placeList){
		var me = this;
		var opts = {
			width: 260, // 信息窗口宽度
			height: 60, // 信息窗口高度
			enableMessage: false,
			offset: new BMap.Size(2, -23)
		};
		$.each(placeList, function(i, item) {
			var mypoint = new BMap.Pixel(item.x, item.y);
			var rs = APP.pointToLngLat(mypoint);
			var myIcon = new BMap.Icon("img/zhuo.png", new BMap.Size(44, 60));
			myIcon.setImageSize(new BMap.Size(22, 30))
			var marker2 = new BMap.Marker(rs, {
				icon: myIcon
			});
			marker2.addEventListener("click", function(e) {
				alert('地点的id是'+item.id);
			});
			me.map.addOverlay(marker2);
		})
	},
	
	getPlaceData: function() {
		var me = this;
		var pix = APP.lngLatToPoint(me.point);
		APP.ajax({
			//url最好用json传，然后在app中拼
			'url':CONF.apiServer + '/?method=getPlaceListByDis&x=' + pix.x + '&y=' + pix.y + '&dis=10000',
			'success':function(rt){
				me.renderPlaceList(JSON.parse(rt));
			}
		})
	}
}

APP.run(function(){MEETMAP.init();})