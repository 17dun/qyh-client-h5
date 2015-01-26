var QUAN = {
	ws: null,
	list: null,
	hasOpen: false,
	myscroll: null,
	init: function() {
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
		this.list = $("#list");
		this.setFresh();
		this.getNewList();
	},

	bindEvent: function() {
		$('.data-item').live('click', function() {
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
			'url': CONF.apiServer + '/?method=getContentList',
			'success':function(rt){
				QUAN.freshList(JSON.parse(rt));
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
	},
	editQuan:function(){
		if (this.hasOpen) {
			return;
		}
		var openwn = plus.webview.create('quan-edit.html', 'quan-edit', {
			scrollIndicator: 'none',
			scalable: false
		});
		openwn.addEventListener("loaded", function() {
			openwn.show("slide-in-bottom", 150);
		})

		QUAN.hasOpen = true;
		openwn.addEventListener("close", function() { //页面关闭后可再次打开
			QUAN.hasOpen = false;
		}, false);
		
	}
}
APP.run(function(){QUAN.init()});
