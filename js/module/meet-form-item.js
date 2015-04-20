var MEETITEM = {
	dataArrEN:['type_demand','sex_demand','age_demand','skills_demand','site_fee','people_num'],
	run : function(data,index){
		var me = this;
		APP.run(function(){
			me.init(data,index);
		})
	},
	init: function(data,index) {
		data = data;
		this.initEvent();
		this.render(data,index);
		this.bindEvent();
	},
	render: function(data,index) {
		var str="",
		len=0,
		dataArrCN=['类型','性别要求','年龄要求','球技要求','场地费','人数'];
		itemArr=CONF[MEETITEM.dataArrEN[index]];
		$('#myhead').html(dataArrCN[index]);
		len = itemArr.length;
		for(var i =0;i<len;i++){
			var active = data[MEETITEM.dataArrEN[index]]==i?'block':'';
			var bottom = i==len-1?'nonebottom':'';
			str += "<div class='info-item item-row' data-index='"+index+"' data-item='"+i+"'><span class='span-title'>"+itemArr[i]+"</span><span class='"+active+" span-chance "+bottom+"'><img class='imgab' src='img/ab1.png' /></span></div>"
			
		}
		$('#chance-item').html(str);
	},
	initEvent:function(){
		plus.key.addEventListener("backbutton", function() {
			back();
		}, false);
	},
	bindEvent: function() {
		$('.info-item').on('click',function(){
			var data =JSON.parse(plus.storage.getItem('meet-form'));
			data[MEETITEM.dataArrEN[$(this).data('index')]]=$(this).data('item');
			plus.storage.setItem('meet-form',JSON.stringify(data));
			plus.webview.hide(plus.webview.currentWebview(),"slide-out-right", 150);
			plus.webview.getWebviewById('meet-form').evalJS('MEETFORM.init(' +JSON.stringify(data) + ')');
		});
	}
}