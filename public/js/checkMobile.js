var Host = location.host;
var CHKMOBILE = "N";
var _uAgent = navigator.userAgent.toLowerCase();
var _mobilePhones = new Array('iphone','ipod','ipad','android','blackberry','windows ce',
'nokia','webos','opera mini','sonyericsson','opera mobi','iemobile');
var _mobileType = "";

//if (Host.indexOf("www")>-1) {
	for(var i=0;i<_mobilePhones.length;i++) {
		if(_uAgent.indexOf(_mobilePhones[i]) != -1) {
			CHKMOBILE = "Y";
			_mobileType = _mobilePhones[i];
//			document.location.href = "http://m." + Host.substr((Host.indexOf(".")+1),Host.length) + location.pathname + location.search;
		}
	}
//}
//if (chkMobile=="Y") document.location.href = "http://m." + Host.substr((Host.indexOf(".")+1),Host.length) + location.pathname + location.search;