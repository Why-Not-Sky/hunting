
//------------------------------------------------------------
// 滙入憑證
//------------------------------------------------------------
function CertificateImport(sIsLogout)
{
    try
    {
        var sURL = "CertImportFromFile.aspx";
        
        // 如果有參數, 則加上去
        if(sIsLogout != null)
            sURL = sURL + "?IsLogout=" + sIsLogout;

        window.location = sURL;
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 滙出憑證
// 注意 : "EncodeCertificateContent此參數不需傳 , 可能因skisw11的 iis版本關係 , 會導致無法下載憑證檔
//------------------------------------------------------------
function CertificateExport(sKey)
{
    try
    {
        // 分析憑證內容
        var oStorage = window.localStorage;
        
        var sValue = oStorage.getItem(sKey);
        var aValue = sValue.split(";");
        var sEncodeCertificateContent = aValue[0];                                      // 憑證內容
        var sPassword = aValue[1];                                                      // 憑證密碼
        var sCertFilename = sKey;

        // 檢視憑證內容
		/*
        var sURL = "CertExportToFile.aspx?";
        sURL += "CertFilename=" + sCertFilename + "&";
        sURL += "CertPassword=" + sPassword + "&";
        sURL += "EncodeCertificateContent=" + sEncodeCertificateContent + "&";
		window.location = sURL;
		*/
		
        var sURL = "CertExportToFile.aspx?";
        sURL += "CertFilename=" + sCertFilename + "&";
        sURL += "CertPassword=" + sPassword;
        window.location = sURL;
        
        // window.open(sURL);
        // window.parent.parent.CrossDomain.location = sURL;
        
        // window.open(sURL, ' ', 'toolbar=yes,menubar=yes,resizable=yes,location=yes,status=yes,scrollbars=yes')
        // setTimeout("focus(); ",5);
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 移除憑證
//------------------------------------------------------------
function CertificateRemove(sKey)
{
    try
    {
        var oStorage = window.localStorage;
        oStorage.removeItem(sKey);
        DelCookie(sKey);
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 檢視憑證
//------------------------------------------------------------
function CertificateView(sCertificateContent, sPassword)
{
    try
    {
        // 呼叫 RemoteCapicom 來完成
        // 呼叫 Server 端註冊查詢客戶憑證
        PageMethods.CertificateView(sCertificateContent, sPassword, PageMethodResult_ViewCert);
        
        // window.location="CertInfo.aspx?CertificateContent=" + sCertificateContent + "&Password=" + sPassword;
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 檢視憑證(後續處理)
//------------------------------------------------------------
function PageMethodResult_ViewCert(sXML)
{
    try
    {
        /*
        var x = $($.parseXML("<xml><products><product id=\"P1\">AA</product>" +
                "<product id=\"P2\">BB</product>" +        
                "<product id=\"P3\">CC<part>X</part></product></products></xml>"));
        */
                
        var x = $($.parseXML(sXML));
                
        if(x.find("Status").attr("code") == "0")
        {
            // 檢視憑證內容
            var sURL = "CertInfo.aspx?";
            sURL += "FriendlyName=" + x.find("Certificate").attr("FriendlyName") + "&";
            sURL += "EffectiveDate=" + x.find("Certificate").attr("EffectiveDate") + "&";
            sURL += "ExpirationDate=" + x.find("Certificate").attr("ExpirationDate") + "&";
            sURL += "KeyAlgorithm=" + x.find("Certificate").attr("KeyAlgorithm") + "&";
            sURL += "PublicKey=" + x.find("Certificate").attr("PublicKey") + "&";
            sURL += "SerialNumber=" + x.find("Certificate").attr("SerialNumber") + "&";
            sURL += "Issuer=" + x.find("Certificate").attr("Issuer") + "&";
            //sURL += "IssuerName=" + x.find("Certificate").attr("IssuerName") + "&";
            sURL += "Subject=" + x.find("Certificate").attr("Subject") + "&";
            sURL += "Thumbprint=" + x.find("Certificate").attr("Thumbprint") + "&";
            sURL += "Version=" + x.find("Certificate").attr("Version") + "&";
            window.location = sURL;
        }
        else
        {
            $.prompt("憑證解析錯誤", { buttons: { "確　 認": true }, prefix: 'jqismooth' });
        }
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 列出 Storage 全部內容
//------------------------------------------------------------
function QueryAllStorage()
{
    try
    {
        var oStorage = window.localStorage;
        // alert("storage.length=" + oStorage.length);

        for (var i=0; i<oStorage.length; i++)
        {
            var sKey = oStorage.key(i);
            var sValue = oStorage.getItem(sKey);
      	    //alert(sKey + "=" + sValue);
        }
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 刪除 Storage 全部內容
//------------------------------------------------------------
function DeleteAllStorage()
{
    try
    {
        var oStorage = window.localStorage;
        //alert("storage.length=" + oStorage.length);
        
        for (var i=oStorage.length-1; i>=0; i--)
        {
            var sKey = oStorage.key(i);
            var sValue = oStorage.getItem(sKey);
            
			//alert(sKey + "=" + sValue);
            CertificateRemove(sKey);
        }
    }
    catch(ex)
    {
    }
    $.prompt("全部刪除完畢!", {buttons: { "確　 認": true }, prefix: 'jqismooth'});
    location.reload(true);
}

//------------------------------------------------------------
// 檢查本機是否存在憑證? (依 Key 值)
//------------------------------------------------------------
function CertificateIsExist(sKey, sSeri)
{
    var bRet = false;
    
    try
    {
//        if($.browser.safari)
//        {
            bRet = CertificateIsExistByKey(sKey);
//        }
//        else
//        {
//            bRet = CertificateIsExistBySeri(sSeri);
//        }
    }
    catch(ex)
    {
    }
    return(bRet);
}


//------------------------------------------------------------
// 檢查本機是否存在憑證? (依 Key 值)
//------------------------------------------------------------
function CertificateIsExistByKey(sKey)
{
    try
    {
        var oStorage = window.localStorage;
        var sValue = oStorage.getItem(sKey);
        
        if((sValue == "") || (sValue == null))
            return(false);
        else
            return(true);
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 檢查本機是否存在憑證? (依憑證序號)
//------------------------------------------------------------
function CertificateIsExistBySeri(sSeri)
{
    try
    {
        var oCertificates = FindCertificate(sSeri);
        
        if(oCertificates == null)
            return(false);
        else
            return(true);
    }
    catch(ex)
    {
    }
}

//------------------------------------------------------------
// 檢查客戶端是否存在憑證? 如果不存在則提出警告!
//------------------------------------------------------------
function ValidCertificateIsExist()
{
    var sKey = "";
    var bIsExist = false;
    
    try
    {
        var sKey = $("#LblCertificateKey").text();  // 憑證 Key 值
        var sSeri = $("#LblSeri").text();
        
        if(CertificateIsExist(sKey, sSeri))
        {
            $('#TxtClientCertIsExist').val('1');    // 1-存在
            
            // 取得憑證內容
            var oStorage = window.localStorage;
            var sValue = oStorage.getItem(sKey);
            $("#TxtClientCert").val(sValue);
            bIsExist = true;
        }
        else
        {
    	    $.prompt("本機無有效憑證，可執行看盤，但無法網路下單。", { buttons: { "確　 認": true }, prefix: 'jqismooth' });
            $('#TxtClientCertIsExist').val('0');    // 0-不存在
        }
    }
    catch(ex)
    {
    }
    
    return(bIsExist);
}


//------------------------------------------------------------
// 檢查客戶端是否存在憑證? 如果不存在則提出警告!
//------------------------------------------------------------
function ValidCertificateIsExistMsg(sPromptmsg, sCss) {
    var sKey = "";
    var bIsExist = false;
    var sCssDefault = "";

    if (sCss == "") {
        sCssDefault = "jqismooth";
    }
    

    try {
        var sKey = $("#LblCertificateKey").text();  // 憑證 Key 值
        var sSeri = $("#LblSeri").text();

        if (CertificateIsExist(sKey, sSeri)) {
            $('#TxtClientCertIsExist').val('1');    // 1-存在

            // 取得憑證內容
            var oStorage = window.localStorage;
            var sValue = oStorage.getItem(sKey);
            $("#TxtClientCert").val(sValue);
            bIsExist = true;
        }
        else {
            $.prompt(sPromptmsg, { buttons: { "確　 認": true }, prefix: sCssDefault });
            $('#TxtClientCertIsExist').val('0');    // 0-不存在
        }
    }
    catch (ex) {
    }

    return (bIsExist);
}

//------------------------------------------------------------
// 檢查客戶端是否存在憑證? 如果不存在 不須提出警告!
//------------------------------------------------------------
function ValidCertificateIsExistNoMsg() {
    var sKey = "";
    var bIsExist = false;

    try {
        var sKey = $("#LblCertificateKey").text();  // 憑證 Key 值
        var sSeri = $("#LblSeri").text();

        if (CertificateIsExist(sKey, sSeri)) {
            $('#TxtClientCertIsExist').val('1');    // 1-存在

            // 取得憑證內容
            var oStorage = window.localStorage;
            var sValue = oStorage.getItem(sKey);
            $("#TxtClientCert").val(sValue);
            bIsExist = true;
        }
        else {
            $('#TxtClientCertIsExist').val('0');    // 0-不存在
        }
    }
    catch (ex) {
    }

    return (bIsExist);
}

//------------------------------------------------------------
// 下載 Server 上的憑證檔至 Client 端
//------------------------------------------------------------
function PageMethodResultBAK(sEncodeCertificateContent) {
    try {
        if (sEncodeCertificateContent == "") {
            $.prompt("憑證匯入失敗! 建議: 請連絡客服人員協助您處理!", { buttons: { "確　 認": true }, prefix: 'jqismooth' });
            return (false);
        }

        var aValue = sEncodeCertificateContent.split(";");
        var sCertContent = aValue[0];                       // 憑證內容
        var sPass = aValue[1];                              // 憑證密碼
        var sCN = aValue[2];                                // 發給
        var sPublisher = aValue[3];                         // 發行者
        var sEndDate = aValue[4];                           // 憑證到期日
        var sFriendlyName = aValue[5];                      // 好記的名稱
        var sCertFilename = aValue[11];                     // 憑證檔名

        // 將 憑證內容字串 寫入 localStorage 中
        var sKey = sCertFilename.replace(".pfx", "");
        localStorage[sKey] = sEncodeCertificateContent;

        // 刪除 Server 上暫存憑證檔, 並異動憑證狀態為 40
        PageMethods.DeleteTmpCert("");

        $.prompt('憑證匯入成功!', { buttons: { "確　 認": true }, prefix: 'jqismooth', callback: confirmSubmitResultBAK });

        //$.prompt('憑證匯入成功!', { buttons: { "確　 認": true } });

        // 刪除 Server 上暫存憑證檔, 並異動憑證狀態為 40
        //PageMethods.DeleteTmpCert("", PageMethodResult_Delete);

    }
    catch (ex) {
        $.prompt("PageMethodResult() Error!", { buttons: { "確　 認": true }, prefix: 'jqismooth' });
    }
}

function confirmSubmitResultBAK(v, m, f) {
    if (v) {
		//alert("confirmSubmitResultBAK");
        window.location = "CertSetupFinish.aspx";

        //PageMethods.DeleteTmpCert("", PageMethodResult_Delete);
        //PageMethodResult_Delete;
    }
}

//------------------------------------------------------------
// 下載 Server 上的憑證檔至 Client 端
//------------------------------------------------------------
function PageMethodResult(sEncodeCertificateContent)
{
    try
    {
        if(sEncodeCertificateContent == "")
        {
	        $.prompt("憑證匯入失敗! 建議: 請連絡客服人員協助您處理!", {buttons: { "確　 認": true }, prefix: 'jqismooth'});
            return(false);
        }

        var aValue = sEncodeCertificateContent.split(";");       
        var sCertContent = aValue[0];                       // 憑證內容
        var sPass = aValue[1];                              // 憑證密碼
        var sCN = aValue[2];                                // 發給
        var sPublisher = aValue[3];                         // 發行者
        var sEndDate = aValue[4];                           // 憑證到期日
        var sFriendlyName = aValue[5];                      // 好記的名稱
        var sCertFilename = aValue[11];                     // 憑證檔名
        
        // 將 憑證內容字串 寫入 localStorage 中
        var sKey = sCertFilename.replace(".pfx", "");
        localStorage[sKey] = sEncodeCertificateContent;

        // 刪除 Server 上暫存憑證檔, 並異動憑證狀態為 40
        PageMethods.DeleteTmpCert("");

        $.prompt('憑證匯入成功!', { buttons: { "確　 認": true }, prefix: 'jqismooth', callback: confirmSubmitResult });

        //$.prompt('憑證匯入成功!', { buttons: { "確　 認": true } });

        // 刪除 Server 上暫存憑證檔, 並異動憑證狀態為 40
        //PageMethods.DeleteTmpCert("", PageMethodResult_Delete);

    }
    catch(ex)
    {
	    $.prompt("PageMethodResult() Error!", {buttons: { "確　 認": true }, prefix: 'jqismooth'});
    }
}

function confirmSubmitResult(v, m, f) {
    if (v) {
		//alert("confirmSubmitResult");
		window.location = "CertSetupFinish.aspx";
        //window.location = "Logout.aspx";

        //PageMethods.DeleteTmpCert("", PageMethodResult_Delete);
        //PageMethodResult_Delete;
    }
}

//------------------------------------------------------------
// 刪除暫存憑證檔
//------------------------------------------------------------
function PageMethodResult_Delete(ResultString)
{
	// alert("PageMethodResult_Delete");
	window.location = "Logout.aspx";
}

//------------------------------------------------------------
// 依表單上之 Key 值備份憑證
//------------------------------------------------------------
function BackupCert()
{
    var sKey = $("#LblCertificateKey").text();                                              // 憑證 Key 值
    CertificateExport(sKey)
}