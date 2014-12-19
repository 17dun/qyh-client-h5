var MEETFORM = {
	hasOpenSex:false,
	init: function() {
		this.bindEvent();
		this.render();
	},
	render: function() {
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
		window.close = function() {
			ws = plus.webview.currentWebview();
			ws.close();
		};
		$(document.body).on('swipeRight', function() {
			plus.webview.currentWebview().close()
		})
		plus.key.addEventListener("backbutton", function() {
			back();
		}, false);
		
	},
	pickDate:function(){
		var dDate=new Date(),
			minDate=new Date(),
			maxDate=new Date();
			minDate.setFullYear(dDate.getFullYear(),dDate.getMonth(),dDate.getDate());
			
		plus.nativeUI.pickDate( function(e) {
			var d=e.date;
			MEETFORM.pickTime(d);
		},function(e){
			//outSet( "未选择日期："+e.message );
		},{title:"请选择日期",date:dDate,minDate:minDate});
	},
	pickTime:function (d){
		alert(1)
		var dTime=new Date();
		dTime.setHours(dTime.getHours()+1,0);
		plus.nativeUI.pickTime(function (e){
			var t=e.date;
			var minutes = t.getMinutes().toString().length==1 ? ('0' + t.getMinutes()):t.getMinutes();
			$('#val-time').html(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+t.getHours()+":"+minutes);
		},function (e){
			//outSet( "未选择时间："+e.message );
		},{title:'请选择时间',is24Hour:true,time:dTime});
	},
	showMeetSelectItem: function(index) {
		var data =  plus.storage.getItem('meet-form');
		if(index != 6){
			if (window.plus) {
				var openwn = plus.webview.create('meet-select-item.html','meet-select-item', {
					scrollIndicator: 'none',
					scalable: false
				});
				openwn.addEventListener("loaded", function() {
					openwn.show("slide-in-right", 150);
					openwn.evalJS('MEETITEM.init(' + data + ','+index+')')
				})
			} else {
				var rootView = plus.webview.getWebviewById(plus.runtime.appid);
				rootView.open('meet-select-item.html');
			}
		}else{
			if (window.plus) {
				var openwn = plus.webview.create('my-oftenAddr.html','my-oftenAddr', {
					scrollIndicator: 'none',
					scalable: false
				});
				openwn.addEventListener("loaded", function() {
					openwn.show("slide-in-right", 150);
					openwn.evalJS('MYOFTENADDR.init(' + data + ')')
				})
			} else {
				var rootView = plus.webview.getWebviewById(plus.runtime.appid);
				rootView.open('my-oftenAddr.html');
			}
		}
	}
}
APP.run(function(){MEET.init();})