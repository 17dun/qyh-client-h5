var USER = {
	ws: null,
	list: null,
	hasOpen: false,
	myscroll: null,
	init: function() {
		$('.loading').show();
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
		this.list = $("#list");
		this.setFresh();
		localStorage.clear();
		this.getNewList();
		/*var htmlStr = plus.storage.getItem('userList');
		
		if (htmlStr) {
			this.rendlocal();
		} else {
			this.getNewList();
		}*/
	},

	bindEvent: function() {
		$('.data-item').live('click', function() {
			USER.showInfo($(this));
		})

	},
	setFresh: function() {
		this.ws.setPullToRefresh({
			support: true,
			height: "45px",
			range: "200px",
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
		var me = this;
		APP.ajax({
			'url': CONF.apiServer + '/?method=getUserList',
			'sucess':function(rt){
				USER.freshList(JSON.parse(rt));
			},
			'fail':function(rt){
			}
		})
	},

	freshList: function(data) {

		var data = {
			list: data,
			api: 1111,
			staticServer: CONF.staticServer
		}
		var htmlStr = template('test', data);
		this.list.prepend(htmlStr);
		plus.storage.setItem('userList', htmlStr);
		this.ws.endPullToRefresh();
		this.list.show();
		$('.loading').hide();
	},

	rendlocal: function() {
		var htmlStr = plus.storage.getItem('userList');
		this.list.prepend(htmlStr);
		this.ws.endPullToRefresh();
		this.list.show();
		$('.loading').hide();
	},


	showInfo: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name'),
			sex: $item.data('sex'),
			pic: $item.data('pic'),
			age: $item.data('age'),
			ballage: $item.data('ballage'),
			style:$item.data('style'),
			score:$item.data('score')
		}
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
	}
}
APP.run(function(){USER.init()});
