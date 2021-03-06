var MEET = {
	point: null,
	map: null,
	windowStatus : {},
	hasOpen: false,
	centerAndZoom: function() {
		if (this.map) {
			this.map.centerAndZoom(this.point, 14);
		}
	},
	init: function() {
		var me = this;
		if(me.map){
			me.map = null;
		}
		APP.initCurrentPosition({
			id:'container',
			size:14,
			success:function(rt){
				me.point = rt.centerPoint;
				me.map = rt.map;
				me.getMeetListData();
			}
		});
	},

	showMeetForm: function() {
		var me = this;
		if(me.windowStatus['meetForm']){
			return;
		}
		var openwn = plus.webview.create('meet-form.html', 'meet-form', {
			scrollIndicator: 'none',
			scalable: false
		});
		openwn.addEventListener("loaded", function() {
			openwn.show("slide-in-bottom", 150);
			openwn.evalJS('MEETFORM.init(null,true)');
			me.windowStatus['meetForm'] = true;
		});
		openwn.addEventListener("close", function() { //页面关闭后可再次打开
			me.windowStatus['meetForm'] = false;
		}, false);
	},

	showMeetInfo: function($item) {
		var me = this;
		var data = {
			id: $item.data('meetid'),
			user_id :$item.data('userid'),
			add_id: $item.data('addid'),
			user_name: $item.data('username'),
			add_name: $item.data('addname'),
			pic: $item.data('pic'),
			topic: $item.data('topic'),
			time:$item.data('time'),
			created:$item.data('created'),
			tel:$item.data('tel'),
		}
		if(me.windowStatus['meetInfo']){
			return;
		}
		var openwn = plus.webview.create('meet-info.html', 'meet-info', {
			scrollIndicator: 'none',
			scalable: false
		});
		openwn.addEventListener("loaded", function() {
			openwn.show("slide-in-right", 150);
			openwn.evalJS('MEETINFO.init(' + JSON.stringify(data) + ')');
			me.windowStatus['meetInfo'] = true;
		})

		openwn.addEventListener("close", function() { //页面关闭后可再次打开
			me.windowStatus['meetInfo'] = false;
		}, false);
		
	},
	renderMeetList:function(meetList){
		var me = this;
		var opts = {
			width: 260, // 信息窗口宽度
			height: 60, // 信息窗口高度
			enableMessage: false,
			offset: new BMap.Size(2, -23)
		};
		$.each(meetList, function(i, item) {
			var mypoint = new BMap.Pixel(item.x, item.y);
			var rs = APP.pointToLngLat(mypoint);
			var myIcon = new BMap.Icon("img/yue.png", new BMap.Size(44, 60));
			myIcon.setImageSize(new BMap.Size(22, 30))
			var marker2 = new BMap.Marker(rs, {
				icon: myIcon
			});
			var meetInfoHtml  = template('meetTipTpl', item);
			marker2.addEventListener("click", function(e) {
				var p = e.target;
				var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
				var infoWindow = new BMap.InfoWindow(meetInfoHtml, opts);
				me.map.openInfoWindow(infoWindow, point);
			});
			me.map.addOverlay(marker2);
		})
	},

	getMeetListData: function(){
		var me = this;
		var pix = APP.lngLatToPoint(me.point);
		APP.ajax({
			'data':{
				'method':'getMeetListByDis',
				'x':pix.x,
				'y':pix.y,
				'dis':100000
			},
			//url最好用json传，然后在app中拼
			'url':CONF.apiServer,
			'success':function(rt){
				me.renderMeetList(JSON.parse(rt));
			}
		})
	}
}

APP.run(function(){MEET.init();})