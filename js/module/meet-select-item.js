var MEETITEM = {
	data:null,
	dataArrEN:['sex','ballage','style','paixing','purpose','timePeriod'],
	init: function(data,index) {
		data=data;
		this.initEvent();
		this.render(data,index);
		this.bindEvent();
	},
	render: function(data,index) {
		var str="",
		len=0,
		dataArrCN=['类型','球龄','擅长','拍型','打球目的','常打时段'];
		itemArr=CONF[MEETITEM.dataArrEN[index]];
		$('#myhead').html(dataArrCN[index]);
		len = itemArr.length;
		
		for(var i =0;i<len;i++){
			var active = data[0][MEETITEM.dataArrEN[index]]==i?'block':'',
			bottom = i==len-1?'nonebottom':'';
			
			str += "<div class='info-item item-row' data-index='"+index+"' data-item='"+i+"'><span class='span-title'>"+itemArr[i]+"</span><span class='"+active+" span-chance "+bottom+"'><img class='imgab' src='img/ab1.png' /></span></div>"
		}
		alert(str)
		$('#select-item').html(str);
		
	},
	initEvent:function(){
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
	},
	bindEvent: function() {
		$('.info-item').on('click',function(){
			data =JSON.parse(plus.storage.getItem('meet-form'));
			data[0][MEETITEM.dataArrEN[$(this).data('index')]]=$(this).data('item');
			plus.storage.setItem('meet-form',JSON.stringify(data));
			data =JSON.parse(plus.storage.getItem('meet-form'));
			plus.webview.hide(plus.webview.currentWebview(),"slide-out-right", 150);
			plus.webview.getWebviewById('meet-form').evalJS('MEETFORM.init(' +JSON.stringify(data) + ')');
		});
		
	}
}

function pageInit(data,index) {
	$(function() {
		FastClick.attach(document.body);
		if (window.plus) {
			MEETITEM.init(data,index);
		} else {
			document.addEventListener("plusready", function() {
				MEETITEM.init(data,index)
			}, false);
		}
	})
}