var MEETINFO = {
	init: function(data) {
		data.staticServer = CONF.staticServer
		this.bindEvent();
		this.renderHead(data);
		this.getData(data);
	},
	renderHead: function(data) {
		var htmlStr = template('infoHeadTpl', data);
		$('.head').html(htmlStr);
	},
	getData: function(data) {
		var me = this;
		APP.ajax({
			//url最好用json传，然后在app中拼
			'url':CONF.apiServer + '/?method=getMeetInfo&id=' + data.id,
			'success':function(rt){
				me.renderBody(JSON.parse(rt));
			}
		})
	},
	renderBody: function(data) {
		alert(JSON.stringify(data))
		var htmlStr = template('meetInfoTpl', data[0]);
		$('.info').html(htmlStr);
	},
	bindEvent: function() {
		window.back = function() {
			ws = plus.webview.currentWebview();
			if (window.plus) {
				ws.close();
			} else if (history.length > 1) {
				history.back();
			} else {
				window.close();
			}
		};
		$(document.body).on('swipeRight', function() {
			plus.webview.currentWebview().close()
		})

		plus.key.addEventListener("backbutton", function() {
			back();
		}, false);
		$('.add').on('click', function() {
			MEETINFO.showInfo($('#addrHead'));
		});
	},
	add: function() {

	},
	sendMsg: function() {},
	showInfo: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name')
		}
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('addr-comment.html', 'addr-comment', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-bottom", 300);
				openwn.evalJS('commentPageInit(' + JSON.stringify(data) + ')')
			})

			MEETINFO.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				MEETINFO.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-comment.html');
		}
	}
}

function meetInfoPageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			MEETINFO.init(data);
		} else {
			document.addEventListener("plusready", function() {
				MEETINFO.init(data)
			}, false);
		}


	})
}