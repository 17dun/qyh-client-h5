var ADDRINFO = {
	init: function(data) {
		this.bindEvent();
		this.renderHead(data);
		this.getData(data);
		//this.getCommentData(data);
	},
	renderHead: function(data) {
		var htmlStr = template('infoHead', data);
		$('.info-head').html(htmlStr);
	},
	getData: function(data) {
		var id = data.id;
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				ADDRINFO.renderBody(JSON.parse(ajax.responseText));
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getPlaceInfo&id=' + id);
		ajax.send();
	},
	renderBody: function(data) {
		var htmlStr = template('placeInfoTpl', data);
		$('.info-body').html(htmlStr);
	},
	
	renderComments: function(data) {
		if (data[0].name != null) {
			var htmlStr = template('commentsTpl', data[0]);
			$('.commentsInfo').html(htmlStr);
			$('.commentsInfo').animate({
				opacity: 1
			}, 100, 'ease-in');
		}
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
			ADDRINFO.showInfo($('#addrHead'));
		});
		$('.commentsInfo').on('click', function() {
			ADDRINFO.showCommentList($('#addrHead'));
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

			ADDRINFO.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				ADDRINFO.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-comment.html');
		}
	},
	showCommentList: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name')
		}
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('addr-comment-list.html', 'addr-comment-list', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				openwn.evalJS('addrCommentListPageInit(' + JSON.stringify(data) + ')')
			})

			ADDRINFO.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				ADDRINFO.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-comment-list.html');
		}
	}
}

function plusReady() {

}

function addrInfoPageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			ADDRINFO.init(data);
		} else {
			document.addEventListener("plusready", function() {
				ADDRINFO.init(data)
			}, false);
		}


	})
}