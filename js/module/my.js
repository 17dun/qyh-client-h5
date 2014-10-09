var MY = {
	init: function() {
		this.bindEvent();
		this.getData();
	},
	getData: function() {
		var id = 2;
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			var my = MY;
			if (ajax.readyState == 4 && ajax.status == 200) {
				my.render(JSON.parse(ajax.responseText));
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