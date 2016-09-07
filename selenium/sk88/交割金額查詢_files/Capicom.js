
var CAPICOM_CURRENT_USER_STORE = 2;
var CAPICOM_MY_STORE = "My";
var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
var CAPICOM_STORE_OPEN_READ_WRITE = 1;
var CAPICOM_CERTIFICATE_SAVE_AS_PFX = 0;

// 匯出憑證至檔案
function ExportCertToFile(sSerialNumber, sPass, sFilename)
{
	try
	{
        var oCertificate = FindCertificate(sSerialNumber);  // 尋找憑證
        //alert("sSerialNumber=" + sSerialNumber);
        //alert("oCertificate.SerialNumber=" + oCertificate.SerialNumber);
        
		if(oCertificate)
		{
		    oCertificate.Save(sFilename, sPass, CAPICOM_CERTIFICATE_SAVE_AS_PFX);
		    return(true);
		}
	}
	catch(ex)
	{
    }
    return(false);
}

// 從檔案匯入憑證
function ImportCertFromFile(sFilename, sPass)
{
	try
	{
		var oCertificate = new ActiveXObject("CAPICOM.Certificate");
		var sKeyStorageFlag = 1;

		// 載入憑證
		oCertificate.load(sFilename, sPass, sKeyStorageFlag);	//1:key is EXPORTABLE

		// 憑證儲存區
		var oStore = new ActiveXObject("CAPICOM.Store");
		oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_READ_WRITE);      

		// 匯入憑證
		oStore.Add(oCertificate);
		return(true);
	}
	catch(ex)
	{
    }
    return(false);
}

// 刪除憑證
function DeleteCert(sSerialNumber)
{
    var myStore = new ActiveXObject("CAPICOM.Store");
    var oCertificate = FindCertificate(sSerialNumber);  // 尋找憑證
    
    try
	{
		if (!(oCertificate))
			return(false);
		
		// 憑證儲存區
		var oStore = new ActiveXObject("CAPICOM.Store");
		oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_READ_WRITE);
		oStore.Remove(oCertificate);
		return(true);
    }
	catch(ex)
	{
        return(false);
    }
}

// 尋找憑證
function FindCertificate(sSerialNumber)
{
	try
	{	
		// 憑證儲存區
		var oStore = new ActiveXObject("CAPICOM.Store");
		oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_READ_WRITE);
		
		var oCertificates = oStore.Certificates;
		var nLength = oCertificates.count;
        //alert("nLength="+ nLength);
        			
		// 逐一搜尋比對
		for (var i = 0; i < nLength; i++)
		{
			var oCertificate = oStore.Certificates(i+1);
            var sCertSerial = oCertificate.SerialNumber;
            
			if (sSerialNumber == sCertSerial)
			{
				return(oCertificate);
		    }
		    
		    var sSerial = sCertSerial.replace(" ", "");
		    if (sSerialNumber.toUpperCase() == sSerial.toUpperCase())
			{
			    //alert("sSerialNumber=" + sSerialNumber.toUpperCase());
			    //alert("sSerial=" + sSerial.toUpperCase());
				return(oCertificate);
		    }
		}
		return(null);
    }
    catch (ex)
    {
        return(null);
    }
}

// 驗簽編碼
function SignData(sSerialNumber, sData)
{
	try
	{
    	var oCertificate = FindCertificate(sSerialNumber)
	    var oSigner = new ActiveXObject("CAPICOM.Signer");
        var oAttribute = new ActiveXObject("CAPICOM.Attribute");
        
        var Today = new Date();
        oAttribute.Name = 0;
        oAttribute.Value = Today.getVarDate();

        oSigner.AuthenticatedAttributes.Add(oAttribute);
        oSignedData.Content = sContent;
        oSigner.Certificate = oCertificate;

        var sSingDataString = oSignedData.Sign(oSigner, true, 0);

        return (sSingDataString);
	}
	catch(ex)
	{
    }
}