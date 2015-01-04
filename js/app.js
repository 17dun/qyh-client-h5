var APP = {
	run : function(callback){
		$(function() {
			if (window.plus) {
				callback.call(this);
			}else{
				$(document).on('plusready', function() {
					callback.call(this);
				});
			}
		})
	},
	init : function(){
		this.run(function(){
			//快速点击
			FastClick.attach(document.body);
			//绑定退出键
			plus.key.addEventListener("backbutton", function() {
				if (confirm("确认退出？")) {
					plus.runtime.quit();
				}
			}, false);
			//去除默认菜单
			document.oncontextmenu = function() {
				return false;
			};
		})
	},
	formatAge : function(date){
		var newDate = new Date();
	    var ageDate = new Date(date-0);
	    if(date!=0){
			return newDate.getFullYear()-ageDate.getFullYear();
		}else{
			return "未完善";
		}
	}
}
APP.init();
