var MYEDIT = {
	hasOpenSex:false,
	init: function(data) {
		this.bindEvent();
		this.render(data);
	},
	render: function(data) {
		var htmlStr = template('userInfoTpl', data[0]);
		$('.info').html(htmlStr);
		plus.storage.setItem('myEdit',JSON.stringify(data));
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
	pickDate:function(date){
		var dDate=new Date(),
			ageDate=new Date(date-0),
			minDate=new Date(),
			maxDate=new Date();
			minDate.setFullYear(1900,1,1);
			maxDate.setFullYear(maxDate.getFullYear(),maxDate.getMonth()+1,maxDate.getDate());
			ageDate.setFullYear(ageDate.getFullYear(),ageDate.getMonth(),ageDate.getDate());
			plus.nativeUI.pickDate( function(e) {
				var d=e.date;
				data =JSON.parse(plus.storage.getItem('myEdit'));
				data[0]['age']=(new Date(d.getFullYear(),(d.getMonth()+1),d.getDate())).getTime();
				plus.storage.setItem('myEdit',JSON.stringify(data));
				$('#val-age').html(dDate.getFullYear()-d.getFullYear());
			},function(e){
				//outSet( "未选择日期："+e.message );
			},{title:"请选择日期",date:ageDate,minDate:minDate,maxDate:maxDate});
	},
	showMyEditItem: function(index) {
		if (window.plus) {
			
			var openwn = plus.webview.create('my-edit-item.html','my-edit-item', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				var data =  plus.storage.getItem('myEdit');
				openwn.evalJS('MYEDITITEM.init(' + data + ','+index+')')
			})
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('my-edit-item.html');
		}
	},
	showMyEditoftenAddr: function() {
		if (window.plus) {
			
			var openwn = plus.webview.create('my-edit-oftenAddr.html','my-edit-oftenAddr', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				var data =  plus.storage.getItem('myEdit');
				openwn.evalJS('MYEDITOFTENADDR.init(' + data + ')')
			})
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('my-edit-oftenAddr.html');
		}
	},
}


function plusReady() {

}

function pageInit(data) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			MYEDIT.init(data);
		} else {
			document.addEventListener("plusready", function() {
				MYEDIT.init(data)
			}, false);
		}
	})
}