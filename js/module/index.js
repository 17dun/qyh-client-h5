var INDEX = {
	ws : null,
	list : null,
	currentView : 'meet',
	init : function(){
		plus.navigator.closeSplashscreen();
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
		this.renderFirstPage();
	},
	bindEvent : function(){
		var me = this;
		//我的页面顶部按钮
		$('.edit').on('click', function() {
			plus.webview.getWebviewById('my').evalJS("MY.editMy();");
		});
		//约球页面顶部定位
		$('.position').on('click', function() {
			plus.webview.getWebviewById('meet').evalJS("MEET.init()");
		})
		//底部tab切换
		$('.nav-item').on('click', function() {
			var item = $(this).attr('data-id');
			if(item==me.currentView){
				return false;
			}
			$('.nav-item').removeClass('active');
			$(this).addClass('active');
			me.freshTitle(item);
			me.freshToolBtn(item);
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
	freshTitle : function(item){
		var titleConf = CONF.title;
		$('.nvtt').html(titleConf[item]);
	},
	freshToolBtn : function(item){
		$('.nvbtrbt').hide();
		$('.'+item+'-btn').show();
	}
}

APP.run(function(){INDEX.init();})