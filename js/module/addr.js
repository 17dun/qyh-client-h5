var ADDR = {
	ws: null,
	list: null,
	hasOpen: false,
	init: function() {
		plus.navigator.closeSplashscreen();
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
		this.list = $("#list");
		this.setFresh();
		var htmlStr = plus.storage.getItem('addrList');
		//this.getNewList();//调试时使用	
		if (htmlStr) {
			this.rendlocal();
		} else {
			this.getNewList();
		}
	},

	bindEvent: function() {
		$('.data-item').live('click', function() {
			ADDR.showInfo($(this));
		})

	},
	setFresh: function() {
		this.ws.setPullToRefresh({
			support: true,
			height: "45px",
			range: "100px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, this.getNewList);
	},

	getNewList: function() {
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			var addr = ADDR;
			if (ajax.readyState == 4 && ajax.status == 200) {
				addr.freshList(JSON.parse(ajax.responseText));
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getPlaceList');
		ajax.send();
	},

	freshList: function(data) {
		var data = {
			list: data
		}
		var htmlStr = template('test', data);
		this.list.prepend(htmlStr);
		this.ws.endPullToRefresh();
		plus.storage.setItem('addrList', htmlStr)
	},

	rendlocal: function() {
		var htmlStr = plus.storage.getItem('addrList');
		this.list.prepend(htmlStr);
	},


	showInfo: function($item) {
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

			ADDR.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开

				ADDR.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-info.html');
		}
	}
}

APP.run(function(){ADDR.init()});