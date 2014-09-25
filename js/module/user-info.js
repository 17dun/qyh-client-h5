var USERINFO = {
	init: function(data) {



		this.bindEvent();
		this.renderHead(data);
		setTimeout(function() {
			USERINFO.getData(data);
		}, 100)
	},
	renderHead: function(data) {
		data.staticServer = CONF.staticServer
		var htmlStr = template('infoHead', data);
		$('.info-head').html(htmlStr);
	},

	getData: function(data) {
		var id = data.id;
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			var userinfo = USERINFO;
			if (ajax.readyState == 4 && ajax.status == 200) {
				userinfo.render(JSON.parse(ajax.responseText));
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getUserInfo&id=' + id);
		ajax.send();
	},

	render: function(data) {
		var htmlStr = template('userInfoTpl', data[0]);
		$('.info').html(htmlStr);
		$('.info').animate({
			opacity: 1
		}, 100, 'ease-in')
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
			USERINFO.init(data);
		} else {
			document.addEventListener("plusready", function() {
				USERINFO.init(data)
			}, false);
		}
	})
}