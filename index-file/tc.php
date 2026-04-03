<?php
header('Content-Type: application/javascript; charset=utf-8');

// ===================================================
// --- 代码级控制开关 (由PHP代码独立控制) ---
// ===================================================
$is_js_encrypt = true; // true: 开启加密输出 | false: 明文输出
// ===================================================

$security_key = 'df_321lecloud_safe_key'; 
define('DF_ADMIN_IN', true);

/**
 * AES-256-CBC 解密函数
 */
function df_decrypt($data, $key) {
    $data = base64_decode($data);
    $iv_len = openssl_cipher_iv_length('aes-256-cbc');
    if (strlen($data) < $iv_len) return false;
    $iv = substr($data, 0, $iv_len);
    $encrypted = substr($data, $iv_len);
    $decrypted = openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);
    return unserialize($decrypted);
}

/**
 * JS 混淆加密函数
 */
function unicodeRelplace($txt){
    $txt = iconv('UTF-8', 'UCS-2BE', $txt);
    $str = '';
    for($i = 0; $i < strlen($txt) - 1; $i = $i + 2){
        $p = $i%4?8:9;
        $str .= $p.decoct(ord($txt[$i])*256+ord($txt[$i + 1])+$p);	
    }	
    return "eval('".$str."'.replace(/([98])([76543210]+)/g,function(a,b,c){return String.fromCharCode(parseInt(c,8)-b)}))";
}

// 1. 读取配置
$paths = ['../mp/config.php', './mp/config.php', '../../mp/config.php'];
$cf = '';
foreach($paths as $p){ if(is_file($p)){ $cf = $p; break; } }

$conf = array();
if ($cf) {
    $content = include($cf);
    if (is_string($content)) {
        $dec = df_decrypt($content, $security_key);
        $conf = is_array($dec) ? $dec : array();
    } elseif (is_array($content)) {
        $conf = $content;
    }
}

// 2. 逻辑验证
if (($conf['pop_status'] ?? '0') != 1) exit('// 延时下载已关闭');

$pop_delay    = (int)($conf['pop_timeout'] ?? 5000); 
$pop_rule     = (string)($conf['pop_rule'] ?? '0');  
$pop_appname  = ($conf['pop_appname'] ?? '云视频');   
$pop_url      = ($conf['pop_url']     ?? '/');       
$pop_logo     = ($conf['pop_logo']    ?? '');        
$pop_line1    = ($conf['pop_line1']   ?? '');        
$pop_line2    = ($conf['pop_line2']   ?? ''); 

// 3. 构造 JS 字符串
ob_start();
?>
(function() {
    var urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('type')) return;
    var today = new Date().toLocaleDateString(); 
    if ("<?php echo $pop_rule; ?>" === '1') {
        if (localStorage.getItem('app_pop_last_date') === today) {
            if (!sessionStorage.getItem('app_notice_active')) return;
        }
    }
    var style = document.createElement('style');
    style.innerHTML = `@keyframes b_s {0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)}}.app-pop-mini{padding:20px 15px;text-align:center;font-family:sans-serif}.btn-dl-mini{display:block;background:linear-gradient(90deg,#FF512F 0%,#DD2476 100%);color:#fff!important;padding:12px;border-radius:10px;text-decoration:none!important;font-weight:bold;font-size:15px;animation:b_s 2s infinite ease-in-out;margin-bottom:10px}.btn-lt-mini{display:block;background:#f8f8f8;color:#777!important;padding:10px;border-radius:10px;text-decoration:none!important;font-size:13px;border:1px solid #eee}.layui-layer-content{border-radius:15px!important}`;
    document.head.appendChild(style);
    function showNotice() {
        if (typeof layer === 'undefined') return;
        if (document.getElementById('app-notice-box')) return;
        var html = `<div id="app-notice-box" class="app-pop-mini"><div style="margin-bottom:15px;"><img src="<?php echo $pop_logo; ?>" style="width:55px;height:55px;border-radius:12px;box-shadow:0 3px 8px rgba(0,0,0,0.1)"></div><h2 style="margin:0 0 5px 0;color:#111;font-size:18px;font-weight:bold"><?php echo htmlspecialchars($pop_appname); ?></h2><p style="font-size:13px;color:#888;line-height:1.4;margin-bottom:18px"><?php echo htmlspecialchars($pop_line1); ?><br><strong><?php echo htmlspecialchars($pop_line2); ?></strong></p><div><a href="<?php echo $pop_url; ?>" target="_blank" class="btn-dl-mini" onclick="handleAction('download')">立即下载</a><a href="javascript:void(0)" class="btn-lt-mini" onclick="handleAction('close')">暂不需要</a></div></div>`;
        layer.open({type:1,title:false,closeBtn:0,shadeClose:true,shade:[0.6,'#000'],area:['280px','auto'],content:html,anim:5,success:function(layero){layero.css({'border-radius':'15px','overflow':'visible'});sessionStorage.setItem('app_notice_active','1')},end:function(){sessionStorage.removeItem('app_notice_active')}});
    }
    window.handleAction = function(a){if(a==='close')localStorage.setItem('app_pop_last_date',today);layer.closeAll()};
    var active = sessionStorage.getItem('app_notice_active');
    if(active){showNotice()}else{setTimeout(showNotice,<?php echo $pop_delay; ?>)}
})();
<?php
$js_code = ob_get_clean();

// 4. 输出
if ($is_js_encrypt) {
    echo unicodeRelplace($js_code);
} else {
    echo $js_code;
}
?>