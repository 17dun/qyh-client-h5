var INDEX = {
	ws : null,
	list : null,
	currentView : 'meet',
	init : function(){
		plus.navigator.setStatusBarBackground("#028ce6");
		plus.navigator.closeSplashscreen();
		this.ws = plus.webview.currentWebview();
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

		$('.position').on('click', function() {
			plus.webview.getWebviewById('meet').evalJS("MEET.init()");
		})

		$('.nav-item').on('click', function() {
			$('.nav-item').removeClass('active');
			$(this).addClass('active');
			var item = $(this).attr('data-id');
			me.changeTitle(item);
			me.changeToolBtn(item);
				if (!plus.webview.getWebviewById(item)) {
					if (item == 'meet'||item == 'my') {
						var myView = plus.webview.create(item + '.html', item, {
							top: '45px',
							bottom: '50px'
						});
					} else {
						var myView = plus.webview.create(item + '.html', item, {
							top: '45px',
							bottom: '50px',
							bounce: 'vertical'
						});
					}
					me.ws.append(myView);
				} else {
					var myView = plus.webview.getWebviewById(item);
					if (item == 'meet') {
						myView.evalJS('ADDR.centerAndZoom()');
					}
				}
				plus.webview.hide(plus.webview.getWebviewById(me.currentView));
				myView.show("none");
				me.currentView = item;
		})
	},
	renderFirstPage : function(){
		var me = this;
		me.list = plus.webview.create('meet.html', 'meet', {
			top: '45px',
			bottom: '50px'
		});
		me.list.addEventListener("loaded", function() {		
			me.ws.append(me.list);
		}, false);

	},
	changeTitle : function(item){
		var titleConf = CONF.title;
		$('.nvtt').html(titleConf[item]);
	},
	changeToolBtn : function(item){
		$('.nvbtrbt').hide();
		$('.'+item+'-btn').show();
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