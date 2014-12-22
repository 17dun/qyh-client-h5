var MEETFORM = {
	hasOpenSex:false,
	init: function(data) {
		this.bindEvent();
		this.render(data);
	},
	render: function(data) {
		var default_data = {
			'user_id':2,
			'add_id':'',
			'time':'12313132132',
			'people_num':2,
			'type_damend':0,
			'sex_damend':0,
			'age_damend':0,
			'skills_damend':0,
			'site_fee':0
		};
		data = data == null?default_data:data;
		
		var htmlStr = template('meetFormTpl', data);
		$('.info').html(htmlStr);
		plus.storage.setItem('meet-form',JSON.stringify(data));
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
	setMeet: function(){
		var meet =JSON.parse(plus.storage.getItem('meet-form'));
		var data = '&user_id=2&addr_id=' + meet.add_id + "&time=" + meet.time + "&people_num=" + meet.people_num + "&type_damend=" + meet.type_damend+ "&sex_damend=" + meet.sex_damend+ "&age_damend=" + meet.age_damend+ "&skills_damend=" + meet.skills_damend+ "&site_fee=" + meet.site_fee;
		var url = encodeURI(CONF.apiServer + '/?method=setMeet'+data);
		alert(url)
		var ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			alert(ajax.readyState+":"+ajax.status)
			if (ajax.readyState == 4 && ajax.status == 200) {
				if (plus.os.name == "iOS") {
					alert('约球成功');
				} else {
					plus.nativeUI.toast('约球成功');
				}
				back();
			}
		}
		ajax.open("GET", url);
		ajax.send();
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
		var dTime=new Date();
		dTime.setHours(dTime.getHours()+1,0);
		plus.nativeUI.pickTime(function (e){
			var t=e.date;
			var minutes = t.getMinutes().toString().length==1 ? ('0' + t.getMinutes()):t.getMinutes();
			var data = plus.storage.getItem('meet-form');
			var time = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+t.getHours()+":"+minutes;
			data['time'] = time;
			plus.storage.setItem('meet-form',data)
			$('#val-time').html(time);
		},function (e){
			//outSet( "未选择时间："+e.message );
		},{title:'请选择时间',is24Hour:true,time:dTime});
	},
	showMeetFormItem: function(index) {
		var data =  plus.storage.getItem('meet-form');
		if (window.plus) {
			var openwn = plus.webview.create('meet-form-item.html','meet-form-item', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-right", 150);
				openwn.evalJS('MEETITEM.init(' + data + ','+index+')')
			})
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('meet-form-item.html');
		}
	}
}
APP.run(function(){MEET.init(data);})