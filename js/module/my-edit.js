var MYEDIT = {
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

	},

	add: function() {


	},
	sendMsg: function() {



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