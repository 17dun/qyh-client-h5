var ADDRCOMMENTLIST = {
	ws: null,
	list: null,
	hasOpen: false,
	init: function(data) {
		plus.navigator.closeSplashscreen();
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
		this.list = $("#list");
		this.setFresh();
		localStorage.clear();
		var htmlStr = plus.storage.getItem('commentList');
		this.getNewList(data);
		/*if(htmlStr){
			this.rendlocal();
		}else{
			this.getNewList(data);	
		}*/
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

		$('.addComment').on('click', function() {
			ADDRCOMMENTLIST.showAddComment($('#addr_info'));
		});
		$('.info-select').on('click', function() {
			$('#dialog-select').hide();
		});

	},
	showAddComment: function($item) {
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
				openwn.show("slide-in-right", 300);
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

	getNewList: function(data) {
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				ADDRCOMMENTLIST.freshList(JSON.parse(ajax.responseText), data);
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getAddrCommentsById&id=' + data.id);
		ajax.send();
	},

	freshList: function(list, data) {
		var data = {
			list: list,
			staticServer: CONF.staticServer,
			id: data.id,
			name: data.name
		}
		$(".comment-head").html(data.name);
		var htmlStr = template('commentListTpl', data);
		this.list.prepend(htmlStr);
		this.ws.endPullToRefresh();
		plus.storage.setItem('commentList', htmlStr);
	},

	rendlocal: function() {
		var addrName = plus.storage.getItem('addrName');
		$(".comment-head").html(addrName);
		var htmlStr = plus.storage.getItem('commentList');
		this.list.prepend(htmlStr);
	}
}

function addrCommentListPageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		document.addEventListener("touchstart", function() {
			return false;
		}, false); //取消浏览器的所有事件，使得active的样式在手机上正常生效
		document.oncontextmenu = function() {
			return false;
		};
		if (window.plus) {
			ADDRCOMMENTLIST.init(data);
		} else {
			document.addEventListener("plusready", function() {
				ADDRCOMMENTLIST.init(data)
			}, false);
		}
	})
}