//取消浏览器的所有事件，使得active的样式在手机上正常生效
document.addEventListener("touchstart", function() {
	return false;
}, true);



// 禁止选择
document.oncontextmenu = function() {
	return false;
};
var ws = null,
	list = null;
// 扩展API加载完毕，现在可以正常调用扩展API 

function plusReady() {
	plus.navigator.setStatusBarBackground("#028ce6");
	plus.navigator.closeSplashscreen();
	ws = plus.webview.currentWebview();
	list = plus.webview.create('meet.html', 'meet', {
		top: '35px',
		bottom: '50px'
	});
	var currentView = 'meet';
	// Android处理返回键
	plus.key.addEventListener("backbutton", function() {
		if (confirm("确认退出？")) {
			plus.runtime.quit();
		}
	}, false);
	list.addEventListener("loaded", function() { //叶面加载完成后才显示
		FastClick.attach(document.body);
		ws.append(list);
		$('.position').on('click', function() {
			plus.webview.getWebviewById('meet').evalJS("ADDR.renderMap()")
		})
		$('.nav-item').on('click', function() {
			$('.nav-item').removeClass('active');
			$(this).addClass('active');
			var item = $(this).attr('data-id');
			changeTitle(item);
			if (item != currentView) {
				if (!plus.webview.getWebviewById(item)) {

					if (item == 'meet') {
						var myView = plus.webview.create(item + '.html', item, {
							top: '35px',
							bottom: '50px'
						});
					} else {
						var myView = plus.webview.create(item + '.html', item, {
							top: '35px',
							bottom: '50px',
							bounce: 'vertical'
						});
					}

					ws.append(myView);
				} else {
					var myView = plus.webview.getWebviewById(item);
					if (item == 'meet') {
						myView.evalJS('ADDR.centerAndZoom()')
					}
				}
				plus.webview.hide(plus.webview.getWebviewById(currentView));
				myView.show("none")

				currentView = item;
			}


		})
	}, false);

	compatibleAdjust();
}


function changeTitle(item) {

	var titleConf = {
		'user': '附近的球友',
		'addr': '附近的场地',
		'meet': '约球',
		'msg': '信息',
		'setting': '设置'
	};
	$('.nvtt').html(titleConf[item]);
}

// DOMContentLoaded事件处理
var _domReady = false;
document.addEventListener("DOMContentLoaded", function() {
	_domReady = true;
	compatibleAdjust();
}, false);
var _adjust = false;

function compatibleAdjust() {
	if (_adjust || !window.plus || !_domReady) {
		return;
	}
	_adjust = true;
	// iOS平台使用div的滚动条
	if ("iOS" == plus.os.name) {
		document.getElementById("content").className = "scontent";
	}
}

if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}