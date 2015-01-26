var INDEX = {
	ws : null,
	list : null,
	currentView : 'meet',
	/*初始化的时候，保证首页中的几个子页面被加载，但不显示，加载完成后，再关闭启动动画，同时停留在第一个选项*/
	init : function(){
		this.preLoadSubPages();
		plus.navigator.setStatusBarBackground('#028ce6');
		this.ws = plus.webview.currentWebview();
		this.bindEvent();
	},
	preLoadSubPages:function(){
		var me = this;
		var loadPage = 0; 
		$.each(CONF.rootPageStyleList,function(i,item){
			var myView = plus.webview.create(item.id + '.html', item.id, item);
			myView.addEventListener("loaded", function() {
				loadPage++;
				if(item.id=='meet'){
					me.ws.append(myView);
					me.freshTitle('meet');
				}
				if(loadPage==4){
					plus.navigator.closeSplashscreen();
				}
			}, false)
			
		})
	},
	
	bindEvent : function(){
		var me = this;
		//我的页面顶部按钮
		$(document).on('click','.my-btn', function() {
			plus.webview.getWebviewById('my').evalJS("MY.editMy();");
		});
		$('.quan-btn').live('click',function() {
			plus.webview.getWebviewById('quan').evalJS("QUAN.editQuan();");
		});
		
		//附近的球友和附近的场地切换
		$(document).on('click','.nvbar',function(){
			var itemId = $(this).attr('data-id');
			if(itemId!=='user'){
				plus.webview.hide(plus.webview.getWebviewById('user'));
				APP.getPeerPageById('addr').show("none");
			}else{
				plus.webview.hide(plus.webview.getWebviewById('addr'));
				plus.webview.getWebviewById('user').show("none");
			}
		})
		
		//约球页面顶部定位
		$(document).on('click','.position',function() {
			plus.webview.getWebviewById('meet').evalJS("MEET.init()");
		})
		//底部tab切换
		$('.nav-item').on('click', function() {
			$('.active').removeClass('active');
			$(this).addClass('active');
			var item = $(this).attr('data-id');
			if(item==me.currentView){
				return false;
			}
			setTimeout(function(){
				me.freshTitle(item);
				var myView = plus.webview.getWebviewById(item);
				plus.webview.hide(plus.webview.getWebviewById(me.currentView));
				myView.show('none');
				me.currentView = item;
			},50)
		})
	},
	freshTitle : function(itemId){
		var headHttml = template(itemId,null)();
		$('header').html(headHttml);
	}
}
APP.run(function(){INDEX.init();})