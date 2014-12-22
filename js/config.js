﻿var CONF = {
	apiServer : 'http://182.254.209.32:8888/',
	staticServer : 'http://182.254.209.32:8080/',
	sex:['女','男'],
	style:['弧圈','削球','推挡'],
	paixing:['直拍','横拍'],
	ballage : ["零基础","1年以下","1-3年","3-5年","5-10年","10年以上"],
	purpose:["结交朋友","锻炼身体","比赛训练"],
	timePeriod:["随时","工作日","休息日"],
	title:{
		'user': '附近的球友',
		'addr': '附近的场地',
		'meet': '约球',
		'msg': '信息',
		'my': '我'	
	},
	sex_damend:['不限','男','女'],
	age_damend:['不限','20岁以下','20-30岁','30-40岁','40岁以上'],
	type_damend:['不限','自由打','比赛'],
	skills_damend:['不限','初学者','入门级','高手'],
	site_fee:['AA','发起者付','赴约者付','输者付'],
	area:['东城区', '西城区','海淀区','朝阳区','丰台区','石景山区','通州区','顺义区','房山区','大兴区','昌平区','怀柔区',
	'平谷区','门头沟区','密云县','延庆县'],
	subArea:[
	['安定门', '广渠门','北京站' ,'北新桥' ,'朝阳门', '崇文门', '灯市口', '东单', '东四', '东四十条', '东直门', '法华寺',
	'鼓楼', '光明楼','海运仓', '和平里', '花市', '建国门', '交道口', '景山','龙潭湖', '前门', '沙滩', '沙子口', '体育馆路', '天安门',
	'天坛', '王府井', '雍和宫','永定门'],
	['广安门','白广路','白纸坊','百万庄','菜市口','长椿街','车公庄','德胜门','阜成门','复兴门','官园','红莲','和平门','后海','虎坊桥',
	'积水潭','金融街','六铺炕','马连道','木樨地','南菜园','南礼士路','牛街','前门','三里河','什刹海','陶然亭','天宁寺','天桥','西便门',
	'西单','西客站','西四','西直门','小西天','新街口','宣武门','右安门','月坛','展览路'],
	['安宁庄','厂洼','白石桥','北大清华','北太平庄','北洼路','车道沟','大钟寺','定慧寺','二里庄','甘家口','公主坟','航天桥','花园桥',
	'蓟门桥','交通大学','军博','联想桥','马甸','马连洼','牡丹园','万柳','万泉河','万寿路','万寿寺','清河','人民大学','上地','世纪城',
	'双榆树','四季青','苏州街','苏州桥','田村','魏公村','五道口','五棵松','西北旺','西二旗','西三旗','西苑','西直门','香山','小营',
	'学院路','永定路','皂君庙','增光路','知春路','中关村','紫竹桥'],
	['安慧桥','安贞','奥运村','八里庄','百子湾','北工大','北沙滩','北苑','CBD','常营','朝青板块','朝外','朝阳公园','大山子','大屯',
	'大望路','定福庄','东坝','东大桥','豆各庄','石佛营','垡头','甘露园','高碑店','工人体育场','管庄','国贸','国美第一城','国展','红庙',
	'和平街','呼家楼','花家地','华纺易城华','威桥','欢乐谷','惠新里','惠新西街','建外大街','健翔桥','劲松','静安庄','酒仙桥','来广营',
	'柳芳','媒体村','南磨房','潘家园','三里屯','三元桥','芍药居','十八里店','十里堡','十里河','世贸天阶','双井','双桥','水碓子','四惠',
	'孙河','太阳宫','甜水园','团结湖','望京','西坝河','小关','小红门','小营','亚运村','燕莎','姚家园','永安里','左家庄'],
	['北大地','菜户营','草桥','长辛店','成寿寺','大红门','东高地','方庄','丰台路','丰台体育馆','丰益桥','和义','花乡','嘉园','角门',
	'看丹桥','科丰桥','科技园区','丽泽桥','刘家窑','六里桥','卢沟桥','马家堡','马连道','木樨园','南苑','蒲黄榆','七里庄','青塔','世界公园',
	'宋家庄','太平桥','五里店','西客站','西罗园','新发地','新宫','洋桥','怡海花园','右安门','玉泉营','岳各庄','云岗','赵公口','左安门'],
	['广宁','八宝山','八大处','八角','古城','金顶街','老山','鲁谷','模式口','苹果园','五里坨','西山','衙门口','杨庄','玉泉路'],
	['北关环岛','北苑','次渠','果园','九棵树','梨园','梨园城铁','临河里','潞城','潞苑','马驹桥','乔庄','土桥','武夷花园','新华大街','玉桥'],
	['石园','光明','后沙峪','机场','建新','李桥','马坡','南彩','南法信','仁和','胜利','顺义城区','天竺','新国展','杨镇','裕龙'],
	['长阳','窦店','石楼','房山城关','韩村河','良乡','阎村','燕山','迎风','周口店'],
	['滨河','观音寺','海子角','黄村','旧宫','林校路','庞各庄','清源','同兴园','西红门','新宫','兴丰大街','兴华大街','兴业大街','亦庄','郁花园'],
	['百善','北七家','昌平县城','长陵','城北','城南','回龙观','霍营','立水桥','龙泽','马池口','南口','南邵','沙河镇','十三陵',
	'天通苑','小汤山','兴寿','阳坊'],
	['北房','渤海镇','怀北','怀柔','九渡河','庙城','桥梓','泉河','汤河口','雁栖','杨宋'],
	['滨河','东高村','黄松峪','金海湖','刘家店','马昌营','平谷镇','王辛庄','兴谷','熊儿寨','渔阳','峪口','镇罗营'],
	['城子街道','大峪','东辛房','军庄','龙泉','妙峰山','清水','潭柘寺','永定'],
	['北庄','不老屯','古北口','密云','穆家裕','十里堡','太师屯','溪翁庄','新城子'],
	['八达岭','大榆树','康庄','延庆','永宁']
	]
}