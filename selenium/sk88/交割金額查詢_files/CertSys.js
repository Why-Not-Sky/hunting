
var _sDomain ="http://" + location.host + "/TASP/";
var _sLoginPage = "http://www.sk88.com.tw/StaticHTML/SMP_Login.html";
var _sKBPage = "https://sl-web01.sk88.com.tw/TASP/CertLogin.aspx?finishtype=0";
var _sQuitPage = "https://sl-web01.sk88.com.tw/TASP/CertQuit.aspx";

function GetFinishPage()
{
    var sFinishType = getParameter("FinishType");
    
    // 客服中心
    if(sFinishType == "0")
        return(_sKBPage);

    // 富貴角 8 號
    if(sFinishType == "8")
        return(_sQuitPage);
                    
    // 富貴角 1 號 or Other
    if((sFinishType == "") || (sFinishType == "1"))
        return(_sLoginPage);
    else
        return(_sLoginPage);
}

// 設定 Client 端有效憑證
function SetClientCert(sEmcu, sClientCert)
{
    try
    {
        var sKey = "CertInfo_" + sEmcu;
        localStorage[sKey] = sClientCert;

        $('#TxtClientCertIsExist').val('1');    // 1-存在
        $('#TxtClientCert').val(sClientCert);
    }
    catch(ex)
    {
    }
}


// 取得 Client 端有效憑證
function GetClientCert(sEmcu)
{
    try {
        var sKey = "CertInfo_" + sEmcu;
        var sClientCert = localStorage[sKey];

        if(sClientCert == "")
            $('#TxtClientCertIsExist').val('0');    // 0-不存在
        else
            $('#TxtClientCertIsExist').val('1');    // 1-存在

        $('#TxtClientCert').val(sClientCert);
    }
    catch(ex)
    {
    }
}

// 清除 Client 端有效憑證
function ResetClientCert(sEmcu)
{
    try {
        var sKey = "CertInfo_" + sEmcu;
        localStorage[sKey] = "";
        var sClientCert = localStorage[sKey];

        $('#TxtClientCertIsExist').val('0');    // 0-不存在
        $('#TxtClientCert').val(sClientCert);
    }
    catch(ex)
    {
    }
}
