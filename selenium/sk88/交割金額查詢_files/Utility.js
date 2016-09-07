function CheckEngNumber(sStr)
{
    var regExp = /^[\d|a-zA-Z]+$/;
    if (regExp.test(sStr))
        return(true);
    else
        return(false);
}

function GetDomainName()
{
	var sDomain=window.location.href.match(/:\/\/(.[^/]+)/)[1];
	return("http://" + sDomain);
}

function Sleep(nInterval)
{
    try
    {
	    var sXML = "";
	    // var sURL = "http://sl-web01.sk88.com.tw/SkisWebServiceAgent/WebServiceAgent.asmx/Sleep?Interval=5000";
	    var sURL = "http://sl-web01.sk88.com.tw/SkisWebServiceAgent/WebServiceAgent.asmx/Sleep?";
	    sURL += "Interval=" + nInterval;
    	
	    var oXMLHttpRequest = new ActiveXObject('Msxml2.XMLHTTP');
	    if(oXMLHttpRequest)
	    {
		    oXMLHttpRequest.open('GET', sURL, false);
		    oXMLHttpRequest.send();
		    sXML = oXMLHttpRequest.responseText;
        }
        return;
    }
    catch(e)
    {
        alert("遠端主機連線失敗! (Sleep)");
    }
}

// var queryString = window.top.location.search.substring(1);
function getParameter (parameterName ) 
{
    var queryString = location.href;
    // Add "=" to the parameter name (i.e. parameterName=value)
    var parameterName = parameterName + "=";

    if ( queryString.length > 0 ) 
    {
        // Find the beginning of the string
        begin = queryString.indexOf ( parameterName );
        // If the parameter name is not found, skip it, otherwise return the value
        if ( begin != -1 ) {
        // Add the length (integer) to the beginning
            begin += parameterName.length;
            // Multiple parameters are separated by the "&" sign
            end = queryString.indexOf ( "&" , begin );
            if ( end == -1 ) {
                end = queryString.length
            }
            // Return the string
            return unescape ( queryString.substring ( begin, end ) );
        }
        // Return "null" if no parameter has been found
        return "null";
    }
}

// 判斷平台, 以自動載入對應之 CSS
function AutoAdjust()
{    
    var oSysInfo = new SysInfo();
    oSysInfo.Init();

    document.getElementById('css').href = "../css/" + oSysInfo.CSS;

    try
    {
        if(typeof $.mobile !== 'undefined')
        {
            $.mobile.ajaxEnabled=false;
            $.mobile.pushStateEnabled=false;
        }
    }
    catch(e)
    {
    }
}

// 判斷平台, 以自動載入對應之 CSS
function AutoAdjust_withAjax()
{    
    var oSysInfo = new SysInfo();
    oSysInfo.Init();

    document.getElementById('css').href = "../css/" + oSysInfo.CSS;

    try
    {
        if(typeof $.mobile !== 'undefined')
        {
            $.mobile.ajaxEnabled=true;
            $.mobile.pushStateEnabled=true;
        }
    }
    catch(e)
    {
    }
}

// 判斷平台, 以自動開啟相對應平台的登入頁面
function AutoAdjustDevice()
{
    var oSysInfo = new SysInfo();
    oSysInfo.Init();

    var sQueryString="";
    sQueryString = getQueryString();
    
    if(oSysInfo.DevicePlatform == "Phone")
    {
        if (sQueryString == "")
        {
            window.location = "https://w.sk88.com.tw/Cross/Phone/Login.aspx";
            return;
        }
        else
        {
            window.location = "https://w.sk88.com.tw/Cross/Phone/Login.aspx?" + sQueryString;
            return;
        }
    }

    if(oSysInfo.DevicePlatform == "Pad")
    {
        if (sQueryString == "")
        {
            window.location = "https://w.sk88.com.tw/Cross/Pad/Login.aspx";
            return;
        }
        else
        {
            window.location = "https://w.sk88.com.tw/Cross/Pad/Login.aspx?" + sQueryString;
            return;
        }        
    }

    if(oSysInfo.DevicePlatform == "PC")
    {
        //window.location = "http://ww2.sk88.com.tw/Cross/PC/Login.aspx";
        //return;
            window.location = "https://w.sk88.com.tw/Cross/Pc/Login.aspx";
            return;
    }


    if (sQueryString == "")
    {
        window.location = "https://w.sk88.com.tw/Cross/Phone/Login.aspx";
        return;
    }
    else
    {
        window.location = "https://w.sk88.com.tw/Cross/Phone/Login.aspx?" + sQueryString;
        return;
    }
}

function getRadioValue(RadioName)
{
	var allNodes=document.getElementsByName(RadioName);
	for(var i=0; i<allNodes.length; i++)
	if(allNodes[i].checked)
		return(allNodes[i].value);
		
	return(null);
}


//取得QueryString 整串值
function getQueryString() 
{
    var sQueryString = "";
	var AllVars = window.location.search.substring(1);
	
	if (AllVars !="")
	{
	    var Vars = AllVars.split("?");
    	
	    sQueryString = Vars[0];
	}
	return sQueryString;
	
}





    //------------------------------------------------------------
    // QueryString 獲取值單一參數值
    //------------------------------------------------------------
    function getQueryStringSingle(name) {
        var AllVars = window.location.search.substring(1);
        var Vars = AllVars.split("&");
        for (i = 0; i < Vars.length; i++) {
            var Var = Vars[i].split("=");
            if (Var[0] == name) return Var[1];
        }
        return "";
    }







// ------------------------------------------------------------
// 去字串前後空白
// ------------------------------------------------------------
function trim(str) 
{
    while (str.indexOf(" ")==0) {
        str = str.substring(1, str.length);
    }
    while ((str.length>0) && (str.indexOf(" ")==(str.length-1))) {
        str = str.substring(0, str.length-1);
    }
    while (str.indexOf("　") == 0) {
        str = str.substring(1, str.length);
    }
    while ((str.length > 0) && (str.indexOf("　") == (str.length - 1))) {
        str = str.substring(0, str.length - 1);
    }
    
    return str;
}


//---------------------------------------------------
// 檢查是否為數字?
//---------------------------------------------------
function IsNumber(name)
{
	if(name.length == 0)
		return   false;
		
	for(i=0;i<name.length;i++)   
	{
		if(name.charAt(i) < "0" || name.charAt(i) > "9")
			return false;
	}
	return true;
}

//---------------------------------------------------
// 重新登入
//---------------------------------------------------
function Logout()
{
    window.location='Logout.aspx';
}

//---------------------------------------------------
// 瀏覽器版本
//---------------------------------------------------
function BrowserVersion()
{
    var userAgent = window.navigator.userAgent.toLowerCase();

	// 修正 jQuery.browser.version 比對問題
	$.browser.version = (userAgent.match( /.(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0, '0'])[1];
	var version = $.browser.version;
}

//---------------------------------------------------
// 手機 是否為手機
//---------------------------------------------------
function isPhone()
{
    var ua = window.navigator.userAgent.toLowerCase();

    if(ua.match(/mobile/i))
    {
       return "true";
    }
    
    return "flase";
}


//---------------------------------------------------
// 手機 系統
//---------------------------------------------------
function PhoneOS()
{
    var ua = window.navigator.userAgent.toLowerCase();
    
    if(ua.match(/iphone/i))
    {
       return "iphone";
    }
    
    if(ua.match(/android/i))
    {
       return "android";
    }

	if(ua.match(/win/i))
    {
       return "win";
    }

    return "unknown";
}

//---------------------------------------------------
// PAD 系統
//---------------------------------------------------
function PadOS()
{
    var ua = window.navigator.userAgent.toLowerCase();
    
    if(ua.match(/htc_flyer/i))
    {
       return "htc_flyer";
    }

	 if(ua.match(/ipad/i))
    {
       return "ipad";
    }
    return "unknown";
}

//--------------------------------------------------------------------
// 判斷是否為正確日期 (yyyy/mm/dd : 非此日期型態會回傳false)
//--------------------------------------------------------------------
function isDate(s) {
    ymd1 = s.split("/");
    month1 = ymd1[1] - 1
    var Date1 = new Date(ymd1[0], month1, ymd1[2]);
    if (Date1.getMonth() + 1 != ymd1[1] || Date1.getDate() != ymd1[2] || Date1.getFullYear() != ymd1[0] || ymd1[0].length != 4) {
        return false;
    }
}

//----------------------------------------------------------------------------------------------------------------
// 判斷傳入的區間日期 
// 注意  : 此函式 有呼叫 jqyprompt() , 請參考 jqyprompt()內的注意事項 必需引用其它js及css才可呼叫此函式
//----------------------------------------------------------------------------------------------------------------
function checkDateStartEnd(sStardDate, sEndDate,sStartFieldName, sEndFieldName)
{
    var sMsg;
    if (isDate(sStardDate) == false) {
        jqyprompt(sStartFieldName +'日期輸入錯誤 非正確日期! 西元日期格式【YYYY/MM/DD】,如 2008/01/01', '');
        return false;
    }
    if (isDate(sEndDate) == false) {
        jqyprompt(sEndFieldName + '日期輸入錯誤 非正確日期! 西元日期格式【YYYY/MM/DD】,如 2008/01/01', '');
        return false;
    }
            
    var sDateD = new Date(sStardDate);
    var eDateD = new Date(sEndDate);

    var Compare = Date.parse(eDateD.toString()) - Date.parse(sDateD.toString()) //相差毫秒數
    var ComDay = Compare / (1000 * 60 * 60 * 24) //相差天數
    if (ComDay < 0) {
        sMsg = '請重新輸入' + sStartFieldName + '(起始日須 小於 終止日)';
        jqyprompt(sMsg ,'');
        return false;
    }
}


//---------------------------------------------------
// jQuery-impromptu 函式 取代 javascript的alert
// 注意 : 呼叫此函式, 須引用2支js : jquery 及 jquery-impromptu及注意css內是否有設定jqismooth
//---------------------------------------------------
    function jqyprompt(sResultMsg,sCssFace) {
        var sMsg;
        sMsg = "<p> " + sResultMsg + "</p><br/>";
        if (sCssFace=='') {sCssFace='jqismooth'}
        $.prompt(sMsg, {
            buttons: { "確　認": true },
            prefix: sCssFace
        });
    }