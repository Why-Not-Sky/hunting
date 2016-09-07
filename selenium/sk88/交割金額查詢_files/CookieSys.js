// SetCookie
function SetCookie(name, value) 
{
	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	// var expires = (argc > 2) ? argv[2] : null;
	var expires;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : null;

	expires = new Date( );
	expires.setTime( expires.getTime( ) + 1000*60*60*24*365 );  // Cookie: ¤@¦~
	document.cookie = escape(name) + "=" + escape(value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == null) ? "" : ("; secure=" + secure));
}

// Delete cookie entry
function DelCookie(name) 
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	document.cookie = escape(name) + "=" + cval + "; expires=" + exp.toGMTString();
}

// Get cookie by name
function GetCookie(name) 
{
	var arg = escape(name) + "=";
	var nameLen = arg.length;
	var cookieLen = document.cookie.length;
	var i = 0;

	while (i < cookieLen) 
	{
	  var j = i + nameLen;
	  if (document.cookie.substring(i, j) == arg)
	   return GetCookieValueByIndex(j);
	  i = document.cookie.indexOf(" ", i) + 1;
	  if (i == 0) break;
	}
	return null;
}

function GetCookieValueByIndex(startIndex) 
{
	var endIndex = document.cookie.indexOf(";", startIndex);
	if (endIndex == -1) 
	  endIndex = document.cookie.length;
	return unescape(document.cookie.substring(startIndex, endIndex));
}
