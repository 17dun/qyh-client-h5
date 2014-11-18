var MY = {
	data: null,
	hasOpen: false,
	init: function() {
		this.getData();
		this.bindEvent();
	},
	getData: function() {
		var id = 2;
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			var my = MY;
			if (ajax.readyState == 4 && ajax.status == 200) {
				data = JSON.parse(ajax.responseText)
				my.render(data);
			}
		}
		ajax.open("GET", CONF.apiServer + '/?method=getUserInfo&id=' + id);
		ajax.send();
	},

	render: function(data) {
		data[0].staticServer = CONF.staticServer
		var htmlStr = template('userInfoTpl', data[0]);
		$('.wrap').html(htmlStr);
	},

	bindEvent: function() {
		
	},
	editMy: function() {
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('my-edit.html', 'my-edit', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-bottom", 150);
				openwn.evalJS('MYEDIT.init(' + JSON.stringify(data) + ')');
			})

			MY.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				MY.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('my-edit.html');
		}
	}
}

$(function() {
	FastClick.attach(document.body);
	if (window.plus) {
		MY.init();
	} else {
		document.addEventListener("plusready", function() {
			MY.init()
		}, false);
	}
})