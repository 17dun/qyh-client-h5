var MYEDITITEM = {
	data:null,
	dataItem:'',
	init: function(data,index) {
		data=data;
		this.render(data,index);
		this.bindEvent();
	},
	render: function(data,index) {
		var str="",
			itemArr=null,
			len=0;
		switch(index){
			case 0:
			$('#myhead').html('性别');
			itemArr =CONF.sex;
			dataItem = 'sex';
			break;
			case 1:
			$('#myhead').html('球龄');
			itemArr =CONF.ballage;
			dataItem = 'ballage';
			break;
			case 2:
			$('#myhead').html('擅长');
			itemArr =CONF.style;
			dataItem = 'style';
			break;
			case 3:
			$('#myhead').html('拍型');
			itemArr =CONF.paixing;
			dataItem = 'paixing';
			break;
		}
		
		len = itemArr.length;
		for(var i =0;i<len;i++){
				var active = data[0][dataItem]==i?'block':'';
				str += "<div class='info-item item-row' data-index='"+index+"' data-item='"+i+"'><span class='span-title'>"+itemArr[i]+"</span><span class='"+active+" span-chance'><img class='imgab' src='img/ab1.png' /></span></div>"
			}
		$('#edit-item').html(str);
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
			data[0][dataItem]=$(this).data('item');
			plus.storage.setItem('myEdit',JSON.stringify(data));
			data =JSON.parse(plus.storage.getItem('myEdit'));
			
			plus.webview.hide(plus.webview.currentWebview(),"slide-out-right", 150)
			plus.webview.getWebviewById('my-edit').evalJS('MYEDIT.init(' +JSON.stringify(data) + ')');
			
		});
		
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