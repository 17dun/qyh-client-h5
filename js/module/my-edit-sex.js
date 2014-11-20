var MYEDITSEX = {
	hasOpen:false,
	data:null,
	init: function(data) {
		data=data;
		this.bindEvent();
		this.render(data);
	},
	render: function(data) {
		$('.boy').hide();
		$('.gril').hide();
		if(data[0]['sex']==0){
			$('.gril').show();
		}else{
			$('.boy').show();
		}
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
		$('.info-item').on('click',function(){
			data =JSON.parse(plus.storage.getItem('myEdit'));
			data[0]['sex']=$(this).data('sex');
			plus.storage.setItem('myEdit',JSON.stringify(data));
			data =JSON.parse(plus.storage.getItem('myEdit'));
			if (this.hasOpen) {
				return;
			}
			if (window.plus) {
				var openwn = plus.webview.create('my-edit.html', 'my-edit', {
					scrollIndicator: 'none',
					scalable: false
				});
				openwn.addEventListener("loaded", function() {
					openwn.show("slide-in-left", 150);
					openwn.evalJS('MYEDIT.init(' +JSON.stringify(data) + ')');
				})
				MYEDITSEX.hasOpen = true;
				openwn.addEventListener("close", function() { //页面关闭后可再次打开
					MYEDITSEX.hasOpen = false;
				}, false);
			} else {
				var rootView = plus.webview.getWebviewById(plus.runtime.appid);
				rootView.open('my-edit.html');
			}
		})
	}
}


function plusReady() {

}

function pageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			MYEDITSEX.init(data);
		} else {
			document.addEventListener("plusready", function() {
				MYEDITSEX.init(data)
			}, false);
		}
	})
}