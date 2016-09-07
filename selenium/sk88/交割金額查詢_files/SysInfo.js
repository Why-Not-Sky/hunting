
// 系統資訊
function SysInfo() {
    this.OS = "";                                   // 作業系統
    this.Browser = "";                              // 瀏覽器
    this.Width = "";                                // 視窗寬度
    this.Height = "";                               // 視窗高度
    this.UserAgent = "";

    this.DeviceCompany = "";                        // 裝置公司 (HTC/Apple/Samsung...)
    this.DeviceName = "";                           // 裝置產品名稱 (iPad, iPhone, Desire)
    this.DeviceOS = "";                             // 裝置作業系統 (Windows/Mac OS X/Android/WinPhone)
    this.DevicePlatform = "";                       // 裝置平台 (PC/Pad/Mobile)
    this.CSS = "";

    this.Init = _fnInit
    this.IsiPhone = _fnIsiPhone
    this.IsiPad = _fnIsiPad
    this.IsFlyer = _fnIsFlyer
    this.IsMobile = _fnIsMobile
    this.IsAndroid = _fnIsAndroid
    this.IsWin = _fnIsWin                           // Win Phone / Win Pad
    this.IsWindows = _fnIsWindows
    this.IsMacintosh = _fnIsMacintosh
    this.IsIE = _fnIsIE
    this.IsChrome = _fnIsChrome
    this.IsSafari = _fnIsSafari
    this.IsFirefox = _fnIsFirefox

    this.ParseiPhone = _fnParseiPhone
    this.ParseiPad = _fnParseiPad
    this.ParseFlyer = _fnParseFlyer
    this.ParseAndroidMobile = _fnParseAndroidMobile
    this.ParseAndroidPad = _fnParseAndroidPad
    this.ParseWinMobile = _fnParseWinMobile
    this.ParseWinPad = _fnParseWinPad
    this.ParseWindows = _fnParseWindows
    this.ParseMacintosh = _fnParseMacintosh
}

function _fnInit() {

    try {
        this.OS = $.client.os;
        this.Browser = $.client.browser;
        this.Width = $(document).width();
        this.Height = $(document).height();
        this.UserAgent = window.navigator.userAgent;

        // iPhone
        if (this.IsiPhone()) {
            this.ParseiPhone();
            return;
        }

        // iPad
        if (this.IsiPad()) {
            this.ParseiPad();
            return;
        }

        // HTC-Flyer
        if (this.IsFlyer()) {
            this.ParseFlyer();
            return;
        }

        // Android
        if (this.IsAndroid()) {

            // Phone
            if (this.IsMobile()) {
                this.ParseAndroidMobile();
                return;
            }
            else {
                this.ParseAndroidPad();
                return;
            }
        }

        // Windows Phone
        if (this.IsWin()) {
            // Phone
            if (this.IsMobile()) {
                this.ParseWinMobile();
                return;
            }
            else {
                this.ParseWinPad();
                return;
            }
        }

        // PC
        if (this.IsWindows()) {
            this.ParseWindows();
            return;
        }

        if (this.IsMacintosh()) {
            this.ParseMacintosh();
            return;
        }
    }
    catch (ex) {
    }

    return (false);
}

function _fnIsiPhone() {
    var bRet = false;
    if (this.UserAgent.match(/iphone/i) && this.IsMobile())
        bRet = true;
    return (bRet);
}

function _fnIsiPad() {
    var bRet = false;
    if (this.UserAgent.match(/ipad/i) && this.IsMobile())
        bRet = true;
    return (bRet);
}

function _fnIsFlyer() {
    var bRet = false;
    if (this.UserAgent.match(/HTC_Flyer/i) || this.UserAgent.match(/HTC Flyer/i))
        bRet = true;
    return (bRet);
}

function _fnIsMobile() {
    var bRet = false;
    if (this.UserAgent.match(/mobile/i))
        bRet = true;
    return (bRet);
}

function _fnIsAndroid() {
    var bRet = false;
    if (this.UserAgent.match(/android/i))
        bRet = true;
    return (bRet);
}

function _fnIsWin() {
    var bRet = false;
    if (this.UserAgent.match(/Windows Phone/i))
        bRet = true;
    return (bRet);
}

function _fnIsWindows() {
    var bRet = false;
    if (this.UserAgent.match(/Windows NT/i))
        bRet = true;
    return (bRet);
}

function _fnIsMacintosh() {
    var bRet = false;
    if (this.UserAgent.match(/Macintosh/i))
        bRet = true;
    return (bRet);
}


function _fnIsIE() {
    var bRet = false;
    if (this.UserAgent.match(/MSIE/i))
        bRet = true;
    return (bRet);
}

function _fnIsChrome() {
    var bRet = false;
    if (this.UserAgent.match(/Chrome/i))
        bRet = true;
    return (bRet);
}

function _fnIsSafari() {
    var bRet = false;
    if (this.UserAgent.match(/Safari/i))
        bRet = true;
    return (bRet);
}

function _fnIsFirefox() {
    var bRet = false;
    if (this.UserAgent.match(/Firefox/i))
        bRet = true;
    return (bRet);
}

function _fnParseiPhone() {
    this.DeviceCompany = "Apple";
    this.DeviceName = "iPhone";
    this.DeviceOS = "Mac OS X";
    this.DevicePlatform = "Mobile";
    this.CSS = "phone_iphone.css";
}

function _fnParseiPad() {
    this.DeviceCompany = "Apple";
    this.DeviceName = "iPad";
    this.DeviceOS = "Mac OS X";
    this.DevicePlatform = "Pad";
    this.CSS = "pad_ipadmini.css";
}

function _fnParseFlyer() {
    this.DeviceCompany = "HTC";
    this.DeviceName = "Flyer";
    this.DeviceOS = "Android";
    this.DevicePlatform = "Pad";
    this.CSS = "pad_flyer.css";
}

function _fnParseAndroidMobile() {
    this.DeviceOS = "Android";
    this.DevicePlatform = "Mobile";
    this.CSS = "phone_android.css";

    // 廠商
    if (this.UserAgent.match(/HTC/i))
        this.DeviceCompany = "HTC";

    // 廠商
    if (this.UserAgent.match(/HTC_Desire/i)) {
        this.DeviceCompany = "HTC";
        this.DeviceName = "Desire";
        return;
    }

    // 廠商
    if (this.UserAgent.match(/HTC Desire HD/i)) {
        this.DeviceCompany = "HTC";
        this.DeviceName = "Desire HD";
        return;
    }

    // 廠商
    if (this.UserAgent.match(/HTC_One_X/i)) {
        this.DeviceCompany = "HTC";
        this.DeviceName = "One_X";
        return;
    }

    // 廠商
    if (this.UserAgent.match(/Moii/i)) {
        this.DeviceCompany = "Moii";

        if (this.UserAgent.match(/E801/i)) {
            this.DeviceName = "E801";
        }
    }

    // 廠商
    if (this.UserAgent.match(/Sony/i)) {
        this.DeviceCompany = "Sony";

        if (this.UserAgent.match(/LT29i/i)) {
            this.DeviceName = "LT29i";
        }
    }

    // 廠商
    if (this.UserAgent.match(/GT-N7100/i)) {
        this.DeviceCompany = "Samsung";

        if (this.UserAgent.match(/JRO03C/i)) {
            this.DeviceName = "Note 2";
        }
    }

    // 廠商
    if (this.UserAgent.match(/GT-N7000/i)) {
        this.DeviceCompany = "Samsung";

        if (this.UserAgent.match(/IMM76D/i)) {
            this.DeviceName = "Note";
        }
    }

}

function _fnParseAndroidPad() {
    // 廠商
    if (this.UserAgent.match(/HTC/i))
        this.DeviceCompany = "HTC";

    // 廠商
    if (this.UserAgent.match(/Asus/i))
        this.DeviceCompany = "Asus";

    // 廠商
    if (this.UserAgent.match(/Acer/i))
        this.DeviceCompany = "Acer";

    // Asus Nexus 7
    if (this.UserAgent.match(/Nexus 7/i)) {
        this.DeviceCompany = "Asus";
        this.DeviceName = "Nexus 7";
        this.DevicePlatform = "Pad";
        this.CSS = "pad_nexus7.css";
        return;
    }

    // Asus Transformer
    if (this.UserAgent.match(/Transformer/i)) {
        this.DeviceCompany = "Asus";
        this.DeviceName = "Transformer";
        this.DevicePlatform = "Pad";
        this.CSS = "pad_transformer.css";
        return;
    }

    // Galaxy Note
    if (this.UserAgent.match(/GT-P1000/i)) {
        //if (((this.Width == 600) && (this.Height == 845)) || ((this.Width == 1066) && (this.Height == 800)))
        //{
        this.DeviceCompany = "Samsung";
        this.DeviceName = "Galaxy Note";
        this.DevicePlatform = "Pad";

        this.CSS = "pad_galaxynote.css";
        return;
        //}
    }

    this.DeviceOS = "Android";
    this.DevicePlatform = "Pad";
    this.CSS = "pad.css";
}

function _fnParseWinMobile() {
    // 廠商
    if (this.UserAgent.match(/HTC/i))
        this.DeviceCompany = "HTC";

    // 廠商
    if (this.UserAgent.match(/Asus/i))
        this.DeviceCompany = "Asus";

    // 廠商
    if (this.UserAgent.match(/Acer/i))
        this.DeviceCompany = "Acer";

    this.DeviceName = "Windows Phone";
    this.DeviceOS = "Windows Phone";
    this.DevicePlatform = "Mobile";
    this.CSS = "phone_win.css";
}

function _fnParseWinPad() {
    this.DeviceOS = "Windows Pad";
    this.DeviceName = "Windows Pad";
    this.DevicePlatform = "Pad";
    this.CSS = "pad.css";
}

function _fnParseWindows() {
    this.DeviceCompany = "";
    this.DeviceName = "PC";
    this.DeviceOS = "Windows";
    this.DevicePlatform = "PC";

    if (this.IsIE()) {
        this.CSS = "pc_win_ie.css";
        return;
    }

    if (this.IsChrome()) {
        this.CSS = "pc_win_chrome.css";
        return;
    }

    if (this.IsSafari()) {
        this.CSS = "pc_win_safari.css";
        return;
    }

    if (this.IsFirefox()) {
        this.CSS = "pc_win_firefox.css";
        return;
    }
}

function _fnParseMacintosh() {
    this.DeviceCompany = "Apple";
    this.DeviceName = "Mac Book Air";
    this.DeviceOS = "Mac OS X";
    this.DevicePlatform = "PC";

    if (this.UserAgent.match(/Safari/i)) {
        this.CSS = "pc_mac_safari.css";
    }
}