var MEETFORM = {
	hasOpenSex:false,
	init: function(data) {
		this.bindEvent();
		this.render();
	},
	render: function() {
		if(plus.storage.getItem('meet-form')==null){
			var default_data = {
				'user_id':2,
				'add_id':0,
				'add_name':'',
				'time':'',
				'people_num':2,
				'type_demand':0,
				'sex_demand':0,
				'age_demand':0,
				'skills_demand':0,
				'site_fee':0
			};
			plus.storage.setItem('meet-form',JSON.stringify(default_data));
		}
		
		var meet =JSON.parse(plus.storage.getItem('meet-form'));
		var htmlStr = template('meetFormTpl', meet);
		$('.info').html(htmlStr);
	},

	bindEvent: function() {
		window.back = function() {
			plus.storage.setItem('meet-form','');
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
			plus.storage.setItem('meet-form','');
			ws = plus.webview.currentWebview();
			ws.close();
		};
		$(document.body).on('swipeRight', function() {
			plus.storage.setItem('meet-form','');
			plus.webview.currentWebview().close()
		})
		plus.key.addEventListener("backbutton", function() {
			plus.storage.setItem('meet-form','');
			back();
		}, false);
	},
	setMeet: function(){
		var meet =JSON.parse(plus.storage.getItem('meet-form'));
		var data = '&user_id='+meet.user_id+'&add_id=' + meet.add_id + "&time=" + meet.time + "&people_num=" + meet.people_num + "&type_demand=" + meet.type_demand+ "&sex_demand=" + meet.sex_demand+ "&age_demand=" + meet.age_demand+ "&skills_demand=" + meet.skills_demand+ "&site_fee=" + meet.site_fee;
		APP.ajax({
			//url最好用json传，然后在app中拼
			'url':encodeURI(CONF.apiServer + '/?method=setMeet'+data),
			'success':function(rt){
				plus.storage.setItem('meet-form','')
				if (plus.os.name == "iOS") {
					plus.nativeUI.toast('约球成功');
				} else {
					plus.nativeUI.toast('约球成功');
				}
				//todo。这里不用后退，用跳转到原来的窗口。要容忍技术上的不完善。先完成功能上线。
				back();
			}
		});
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
			var data = JSON.parse(plus.storage.getItem('meet-form'));
			var month = (d.getMonth()+1).toString().length==1 ? ('0' + (d.getMonth()+1)):(d.getMonth()+1);
			var day = (d.getDate()).toString().length==1 ? ('0' + (d.getDate())):(d.getDate());
			var minutes = t.getMinutes().toString().length==1 ? ('0' + t.getMinutes()):t.getMinutes();
			var hour = (t.getHours()).toString().length==1 ? ('0' + (t.getHours())):(t.getHours());
			var time = d.getFullYear()+'-'+month+'-'+day+' '+hour+":"+minutes;
			data['time'] = time;
			plus.storage.setItem('meet-form',JSON.stringify(data))
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
				openwn.evalJS('MEETITEM.run(' + data + ','+index+')')
			})
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('meet-form-item.html');
		}
	},
	//显示地图
	showMeetMap : function(){
		if(plus.webview.getWebviewById('meet-map')){
			plus.webview.getWebviewById('meet-map').show("slide-in-right", 150);
		}else{
			var openwn = plus.webview.create('meet-map.html','meet-map', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
			openwn.show("slide-in-right", 150);
			})
		}
	}
}
APP.run(function(){MEETFORM.init();})