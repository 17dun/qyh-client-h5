var MYOFTENADDR = {
	init: function(data) {
		this.bindEvent();
		this.render(data);
	},
	render: function(data) {
		var areaArr,
			area,
			subArea,
			oftenAddr=''
			dataOften =data[0].oftenAddr;
			if(!dataOften){
				$('#item').attr('class','block')
			}
			if(dataOften.indexOf(',')>-1){
				areaArr = dataOften.split(',');
				for(var i=0;i<areaArr.length;i++){
					area= areaArr[i].split('|');
					subArea = area[1].split('$');
					for(var k=0;k<subArea.length;k++){
						oftenAddr+="<span class='span-label'>"+CONF.subArea[area[0]][k]+"</span>";
					}
				}
			}else{
				area= dataOften.split('|');
				subArea = area[1].split('$');
				for(var k=0;k<subArea.length;k++){
					oftenAddr+="<span class='span-label'>"+CONF.subArea[area[0]][k]+"</span>";
				}
			}
			$('#item').html(oftenAddr);
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
	}
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