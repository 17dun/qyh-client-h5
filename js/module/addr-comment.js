var commentArr = new Array('很差', '一般', '好', '很好', '非常好')
var ADDRComment = {
	init: function(data) {
		this.bindEvent();
		this.renderHead(data);
	},
	renderHead: function(data) {
		$('.comment-head').html(data.name);
		$('#addr_id').val(data.id)
	},
	bindEvent: function(data) {
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
		plus.key.addEventListener("backbutton", function() {
			back();
		}, false);
		$(".submit-comment").on("click", function() {
			ADDRComment.setData();
		});
		$(".comment-star").on('click', function(e) {
			var index = $(e.target).val();
			$('li').attr('class', '');
			var li = $('li');
			for (var i = 0; i < index; i++) {
				li[i].className = "active";
			}
			$('.star-tip').html(commentArr[i - 1]);
			$('#star').val(index);
		});
	},
	setData: function() {
		var id = $('#addr_id').val(),
			commentText = $('#comment-text').val(),
			start = $('#star').val(),
			date = new Date().getTime(),
			url = encodeURI(CONF.apiServer + '/?method=setAddrComment&user_id=2&addr_id=' + id + "&comment=" + commentText + "&time=" + date + "&start=" + start),
			ajax = new plus.net.XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				if (plus.os.name == "iOS") {
					alert('添加评论成功');
				} else {
					plus.nativeUI.toast('添加评论成功');
				}
				back();
			}
		}
		ajax.open("GET", url);

		ajax.send();
	}
}

APP.run(function(){ADDRComment.init()});
