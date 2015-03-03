var MEETINFO = {
	data:null,
	init: function(data) {
		this.data = data;
		data.staticServer = CONF.staticServer;
		this.bindEvent();
		this.getData(data);
	},
	getData: function(data) {
		var me = this;
		APP.ajax({
			//url最好用json传，然后在app中拼
			'url':CONF.apiServer + '/?method=getMeetInfo&id=' + data.id,
			'success':function(rt){
				me.renderBody(JSON.parse(rt));
			}
		});
	},
	renderBody: function(data) {
		data.usersNum = data.meetUsers.length;
		this.data.userIds='|';
		for(var i =0,len=data.usersNum;i<len;i++){
			this.data.userIds +=data.meetUsers[i].user_id+'|';
		}
		data.staticServer = CONF.staticServer;
		var htmlStr = template('meetInfoTpl', data);
		$('.info').html(htmlStr);
	},
	bindEvent: function() {
		
	},
	addMeet: function() {
		var me = this;
		var userid = 5;//暂时写死
		if(me.data.userIds.indexOf('|'+userid+'|')==-1){
			APP.ajax({
				//url最好用json传，然后在app中拼
				'url':CONF.apiServer + '/?method=setMeetUsers&is_leader=0&user_id='+userid+'&meet_id=' + me.data.id,
				'success':function(rt){
					if (plus.os.name == "iOS") {
						alert('加入成功');
						me.init(me.data);
					} else {
						plus.nativeUI.toast('加入成功');
						me.init(me.data);
					}
				}
			});
		}else{
			if (plus.os.name == "iOS") {
				alert('您已经是该活动成员啦!');
			} else {
				plus.nativeUI.toast('您已经是该活动成员啦!');
			}
		}
	},
	sendMsg: function() {
		
	},
	showInfo: function($item) {
		var data = {
			id: $item.data('id'),
			name: $item.data('name')
		}
		if (this.hasOpen) {
			return;
		}
		if (window.plus) {
			var openwn = plus.webview.create('addr-comment.html', 'addr-comment', {
				scrollIndicator: 'none',
				scalable: false
			});
			openwn.addEventListener("loaded", function() {
				openwn.show("slide-in-bottom", 300);
				openwn.evalJS('commentPageInit(' + JSON.stringify(data) + ')')
			})

			MEETINFO.hasOpen = true;
			openwn.addEventListener("close", function() { //页面关闭后可再次打开
				MEETINFO.hasOpen = false;
			}, false);
		} else {
			var rootView = plus.webview.getWebviewById(plus.runtime.appid);
			rootView.open('addr-comment.html');
		}
	}
}
