/*
 *index只管底部的按钮，全局的事件和全局的设置
 * */

var INDEX = {
	webview : null,
	subView : null,
	currentViewId : 'meet',
	init : function(){
		plus.navigator.setStatusBarBackground("#028ce6");
		plus.navigator.closeSplashscreen();
		this.webview = plus.webview.currentWebview();
		this.bindEvent();
		this.renderFirstPage();
	},
	bindEvent : function(){
		var me = this;
		FastClick.attach(document.body);
		plus.key.addEventListener("backbutton", function() {
			if (confirm("确认退出？")) {
				plus.runtime.quit();
			}
		}, false);
		document.oncontextmenu = function() {
			return false;
		};

		$('.nav-item').on('click', function() {
			me.showPage($(this));
		})
	},
	showPage : function($item){
		var me = this;
		$('.nav-item').removeClass('active');
		$item.addClass('active');
		var itemId = $item.data('id');
		var itemBounce = $item.data('bounce');
		//如果不存在该webview，则创建之
		if (!plus.webview.getWebviewById(itemId)) {
			alert(me.currentViewId);
			var myView = plus.webview.create(itemId + '.html', itemId, {
				top: '45px',
				bottom: '50px',
				bounce: itemBounce
			});
			me.webview.append(myView);
		}else {
			var myView = plus.webview.getWebviewById(itemId);
			if (itemId == 'meet') {
				myView.evalJS('ADDR.centerAndZoom()');
			}
		}
		plus.webview.hide(plus.webview.getWebviewById(me.currentViewId));
		myView.show("none");
		me.currentViewId = itemId;
	},
	renderFirstPage : function(){
		var me = this;
		me.subView = plus.webview.create('meet.html', 'meet', {
			top: '0px',
			bottom: '50px'
		});
		me.subView.addEventListener("loaded", function() {		
			me.webview.append(me.subView);
		}, false);
	}
}

$(function() {
	if (window.plus) {
		INDEX.init();
	}else{
		$(document).on('plusready', function() {
			INDEX.init()
		});
	}
})