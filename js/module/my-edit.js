var MYEDIT = {
	hasOpenSex:false,
	init: function(data) {
		this.bindEvent();
		this.renderHead(data);
		this.render(data);
	},
	renderHead: function(data) {
		data.staticServer = CONF.staticServer
		var htmlStr = template('infoHead', data);
		$('.info-head').html(htmlStr);
	},

	render: function(data) {
		var htmlStr = template('userInfoTpl', data[0]);
		$('.info').html(htmlStr);
		plus.storage.setItem('myEdit',JSON.stringify(data));
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
		$('.info-item').live('click', function() {
			my.showMyEditSex();
		})
	},
	showMyEditSex: function() {
		if (this.hasOpenSex) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('my-edit-sex.html', 'my-edit-sex', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				var data =  plus.storage.getItem('myEdit');
				openwn.evalJS('MYEDITSEX.init(' + data + ')')
			})
			MYEDIT.hasOpenSex = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				MYEDIT.hasOpenSex = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('my-edit-sex.html');
		}
	}
}


function plusReady() {

}

function pageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			MYEDIT.init(data);
		} else {
			document.addEventListener("plusready", function() {
				MYEDIT.init(data)
			}, false);
		}
	})
}