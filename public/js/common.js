// 제휴링크 변환
function goProductUrl(url,merchant,type){
	if(merchant == 'shopstyle'){
		if(CHKMOBILE=='Y'){
			document.location.href = url;
		} else {
			window.open(url);
		}
	} else if(merchant == 'linkprice'){
		if(CHKMOBILE=='Y'){
			document.location.href = url;
		} else {
			window.open(url);
		}
	} else {
		// 오가게일경우 linkeprice 변환 api가 안먹어서 직접 링크 걸어줌
		if (merchant=="ogage"){
			if (type=="store"){
				if(CHKMOBILE=='Y'){
					document.location.href = 'http://click.linkprice.com/click.php?m=ogage&a=A100513351&l=0000';
				} else {
					window.open('http://click.linkprice.com/click.php?m=ogage&a=A100513351&l=0000');
				}
			} else {
				if(CHKMOBILE=='Y'){
					document.location.href = url;
				} else {
					window.open(url);
				}
			}
			
		} else {
			var openurl = url;
			$.ajax({
			    url     : '/getLinkpriceUrl?url='+encodeURIComponent(url),
			    type    : 'get',
			    dataType: 'json',
			    success : function(json){
					if (json.status){
						var result = json.result;
						var lp_url = json.url;
						if (result=='S') openurl = lp_url;
					}
					if(CHKMOBILE=='Y'){
						document.location.href = openurl;
					} else {
						window.open(openurl);
						//window.open(openurl,"product_window", "width=1280,height=768,left=0,top=0,scrollbars=yes,titlebar=yes,status=yes,resizable=yes,fullscreen=yes");
					}
			    },
			    error   : function(e){
			    	if(CHKMOBILE=='Y'){
						document.location.href = openurl;
					} else {
						window.open(openurl);
					}
			    }
			});	
		}
		
	}
}

// 좋아요
function likeItem(collection_id){
    var likeId		= "id_"+collection_id;
    var likeCntId	= "cnt_"+collection_id;
    
	var postData = new Object();
	postData.collection_id	= collection_id;
	postData.get_type		= 'L';
	
	postData.msg_type		= $('#msg_type').val();
	postData.msg_user_id	= $('#msg_user_id').val();
	postData.msg_ref_url	= $('#msg_ref_url').val();
	postData.msg_contents	= $('#msg_contents').val();

	// ajax post 에서 세션 유지 시키기 위함
	$.ajaxSetup({
		beforeSend: function(xhr) {
			xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
		}
	});
    
    $.ajax({
		url     : '/gets/put',
		type    : 'post',
		dataType: 'json',
		data	: $.param(postData),
        async   : false,  
        success : function(json){
    		$('#'+likeCntId).html(json.cnt_item);
    		$('#'+likeId).removeClass();

    		if(json.like_status=='Y'){
    			$('#'+likeId).addClass('like_icon_on');
    		}else{
    			$('#'+likeId).addClass('like_icon');
    		}
        },
        error   : function(e){
            //notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
}

// 로그인 팝업
function login_pop(url){
	var backurl = encodeURIComponent(document.location.href);
	if(url!="") backurl = encodeURIComponent(url);
	
	if(CHKMOBILE=='Y'){
		document.location.href = "/login_pop?backurl="+backurl,"Paffy 로그인","width=450,height=400,scrollbars=no,resizeable=no,left=400,top=200";
	} else {
		layer_open("/login_pop?backurl="+backurl,400,350,"no","pop_layer","pop_content");
	}
}

// 로그인 팝업(로그인 후 페이지 이동안함. 스크립트로 처리위함)
function login_pop_stay(){
	if(CHKMOBILE=='Y'){
		document.location.href = "/login_pop?stay=Y","Paffy 로그인","width=450,height=400,scrollbars=no,resizeable=no,left=400,top=200";
	} else {
		layer_open("/login_pop?stay=Y",400,330,"no","pop_layer","pop_content");
	}
}

//	문자열 지정한 길이만큼 자르기
function chr_byte(chr){
	if(escape(chr).length > 4)      return 2;
	else                            return 1;
}

//	문자열 지정한 길이만큼 자르기
function cropByte(str, limit){
	var tmpStr = str;
	var byte_count = 0;
	var len = str.length;
	var dot = "";

	for(crop_i=0; crop_i<len; crop_i++){
		byte_count += chr_byte(str.charAt(crop_i)); 
		if(byte_count == limit-1){
			if(chr_byte(str.charAt(crop_i+1)) == 2){
				tmpStr = str.substring(0,crop_i+1);
				dot = "..";
			}
			else {
				if(crop_i+2 != len) dot = "..";
				tmpStr = str.substring(0,crop_i+2);
			}
			break;
		}
		else if(byte_count == limit){
			if(crop_i+1 != len) dot = "..";
			tmpStr = str.substring(0,crop_i+1);
			break;
		}
	}
	return (tmpStr+dot);
}

// 숫자세팅
function setMoney(obj){
	deleteComma(obj);
	obj.value = addCommaStr(obj.value);
}


/**
 * 숫자에 comma를 붙인다.
 *
 * @param   obj
 */
function addComma(obj) {
	obj.value = trimStr(obj.value);
	var value = obj.value;

	if (value == "") {
		return;
	}

	value = deleteCommaStr(value);

	if (!isFloat(value)) {
		dispName = obj.getAttribute("dispName");

		if (dispName == null) {
			dispName = "";
		}

		alert(dispName + " 형식이 올바르지 않습니다.");
		obj.value = "0";
		obj.focus();
		if (window.event) {
			window.event.returnValue = false;
		}
		return;
	}

	obj.value = addCommaStr(value);
}


/**
 * 숫자에 comma를 붙인다.
 *
 * @param   str
 */
function addCommaStr(str) {
	var tmpStr = str.toString();
	var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
	var arrNumber = tmpStr.split('.');
	arrNumber[0] += '.';
	do {
		arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
	} while (rxSplit.test(arrNumber[0]));

	if (arrNumber.length > 1) {
		replaceStr = arrNumber.join("");
	} else {
		replaceStr = arrNumber[0].split(".")[0];
	}
	return replaceStr;
}

/**
 * 숫자에서 comma를 없앤다.
 *
 * @param   obj
 */
function deleteComma(obj) {
	obj.value = deleteCommaStr(obj.value);
}


/**
 * 숫자에서 comma를 없앤다.
 *
 * @param   str
 */
function deleteCommaStr(str) {
	var temp = '';

	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == ',') {
			continue;
		} else {
			temp += str.charAt(i);
		}
	}

	return  temp;
}

function getMoneyType(price,priceType){
	price = parseInt(price);
	var priceStr = addCommaStr(price);
	if(priceType=='KRW'){
		priceStr = "￦"+priceStr;
	}else if(priceType=='USD'){
		priceStr = "$"+priceStr;
	}else if(priceType=='JPY'){
		priceStr = "￥"+priceStr;
	}else if(priceType=='EUR'){
		priceStr = "€"+priceStr;
	}else if(priceType=='GBP'){
		priceStr = "￡"+priceStr;
	}else if(priceType=='CNY'){
		priceStr = "元"+priceStr;
	}
	return priceStr;
}

// 공백 제거
function trimStr(str){
	//정규 표현식을 사용하여 화이트스페이스를 빈문자로 전환
	str = str.replace(/^\s*/,'').replace(/\s*$/, ''); 
	return str; //변환한 스트링을 리턴.
}

function rctobr(str) {
	return str.replace( /\r/g, "<br>");
}

// Object 요소 출력
function printObject(obj){
	var str = "";
	for(key in obj) {
		str += key+"===========>"+this[key]+"\n";
	}
	return str;
}


/**
 * 정수 체크
 *
 * 1. +, - 부호를 생략하거나 넣을 수 있다 : ^[\+-]?
 * 2. 0에서 9까지 숫자가 0번 이상 올 수 있다 : [0-9]*
 * 3. 마지막은 숫자로 끝나야 한다 : [0-9]$
 *
 * @param   num
 * @return  boolean
 */
function isInteger(num) {
	re = /^[\+-]?[0-9]*[0-9]$/;

	if (re.test(num)) {
		return  true;
	}

	return  false;
}

/**
 * 숫자가 포함되어 있는지 체크 한다.
 *
 * @param   num
 * @return  boolean
 */
function isNumber(num) {
	re = /[0-9]*[0-9]$/;
	if (re.test(num)) {
		return  true;
	}
	return  false;
}


/**
 * 이메일 체크
 *
 * @param   email
 * @return  boolean
 */
function isEmail(email) {
	re = /[^@]+@[A-Za-z0-9_-]+[.]+[A-Za-z]+/;

	if (re.test(email)) {
		return  true;
	}
	return  false;
}

// URL 주소 체크
function isURL(s) {
	var regexp = /http:\/\/[A-Za-z0-9\.-]{1,}\.[A-Za-z]{1}/;
	return regexp.test(s);
}

function urlCheck(urlObj) {
	if (isURL(urlObj.value)){
		return true;
	} else {
		alert("잘못된 URL 주소를 입력 하셨습니다.");
		return false;
	}
}


// 숫자체크
function onlynum(objtext1){
	var inText = objtext1.value;
	var ret;
 	for (var i = 0; i < inText.length; i++) {
		ret = inText.charCodeAt(i);
		if (!((ret > 47) && (ret < 58)))  {
		   alert("숫자만을 입력하세요");
		   objtext1.value = "";
		   objtext1.focus();
		   return false;
		}
	}
	return true;
}

/**
 * 이메일 주소 체크 - 정밀하게
 */
function emailCheck(emailStr) {
	var checkTLD=1;
	var knownDomsPat=/^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;
	var emailPat=/^(.+)@(.+)$/;
	var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]";
	var validChars="\[^\\s" + specialChars + "\]";
	var quotedUser="(\"[^\"]*\")";
	var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
	var atom=validChars + '+';
	var word="(" + atom + "|" + quotedUser + ")";
	var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
	var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");
	var matchArray=emailStr.match(emailPat);

	if (matchArray==null) {
		alert("이메일 주소가 정확하지 않습니다 (체크 @ and .'s)");
		return false;
	}
	var user=matchArray[1];
	var domain=matchArray[2];
	for (i=0; i<user.length; i++) {
		if (user.charCodeAt(i)>127) {
			alert("잘못된 이메일 주소를 입력 하셨습니다.");
			return false;
		}
	}
	for (i=0; i<domain.length; i++) {
		if (domain.charCodeAt(i)>127) {
			alert("도메인 이름이 잘못 기제 되었습니다.");
			return false;
		}
	}
	if (user.match(userPat)==null) {
		alert("이메일 주소가 아닙니다.");
		return false;
	}
	var IPArray=domain.match(ipDomainPat);
	if (IPArray!=null) {
		for (var i=1;i<=4;i++) {
			if (IPArray[i]>255) {
				alert("IP주소가 틀립니다!");
				return false;
			}
		}
		return true;
	}
	var atomPat=new RegExp("^" + atom + "$");
	var domArr=domain.split(".");
	var len=domArr.length;
	for (i=0;i<len;i++) {
		if (domArr[i].search(atomPat)==-1) {
			alert("도메인 이 존재 하지 않습니다.");
			return false;
		}
	}
	if (checkTLD && domArr[domArr.length-1].length!=2 && 
		domArr[domArr.length-1].search(knownDomsPat)==-1) {
		alert("알려진 형식으로 끝이 나야합니다. (XXX@XXX.XX)");
		return false;
	}
	if (len<2) {
		alert("Hostname이 틀립니다. !");
		return false;
	}

	return true;
}

/**
 * 비밀번호 체크
 */
function passChk(p_id, p_pass, obj) {

	var cnt = 0;
	var cnt2 = 1;
	var cnt3 = 1;
	var temp = "";
	
	/* 비밀번호에에 숫자만 입력되는것을 체크 */
	regNum = /^[0-9]+$/gi;
	bNum = regNum.test(p_pass);
	if(bNum) {
		alert('비밀번호는 숫자만으로 구성하실수는 없습니다.');
		   obj.focus();
		return false;
	}
	/* 비밀번호에에 문자만 입력되는것을 체크  */
	regNum = /^[a-zA-Z]+$/gi;
	bNum = regNum.test(p_pass);
	if(bNum) {
		alert('비밀번호는 문자만으로 구성하실수는 없습니다.');
		   obj.focus();
		return false;
	}

	for(var i = 0; i < p_id.length; i++) {
		temp_id = p_id.charAt(i);

		for(var j = 0; j < p_pass.length; j++) {
			if (cnt > 0) {
				j = tmp_pass_no + 1;
			}

			if (temp == "r") {
				j=0;
				temp="";
			}

			temp_pass = p_pass.charAt(j);

			if (temp_id == temp_pass){
				cnt = cnt + 1;
				tmp_pass_no = j;
				break;
			} else if (cnt > 0 && j > 0){
				temp="r";
				cnt = 0;
			} else {
				cnt = 0;
			}
		}

		if (cnt > 3) {
			break;
		}
	}

	if (cnt > 3){
		alert("비밀번호가 ID와 4자 이상 중복되거나, \n연속된 글자나 순차적인 숫자를 4개이상 사용해서는 안됩니다.");
		obj.focus();
		return  false;
	}

	for(var i = 0; i < p_pass.length; i++) {
		temp_pass1 = p_pass.charAt(i);
		next_pass = (parseInt(temp_pass1.charCodeAt(0)))+1;
		temp_p = p_pass.charAt(i+1);
		temp_pass2 = (parseInt(temp_p.charCodeAt(0)));

		if (temp_pass2 == next_pass) {
			cnt2 = cnt2 + 1;
		} else {
			cnt2 = 1;
		}

		if (temp_pass1 == temp_p) {
			cnt3 = cnt3 + 1;
		} else {
			cnt3 = 1;
		}

		if (cnt2 > 3) {
			break;
		}

		if (cnt3 > 3) {
			break;
		}
	}

	if (cnt2 > 3){
		alert("비밀번호에 연속된 글이나 순차적인 숫자를 4개이상 사용해서는 안됩니다.");
		obj.focus();
		return  false;
	}

	if (cnt3 > 3){
		alert("비밀번호에 반복된 문자/숫자를 4개이상 사용해서는 안됩니다.");
		obj.focus();
		return  false;
	}

	return true;
}


//	문자열 지정한 길이만큼 자르기
function cropByte(str, limit){
	var tmpStr = str;
	var byte_count = 0;
	var len = str.length;
	var dot = "";

	for(crop_i=0; crop_i<len; crop_i++){
		byte_count += chr_byte(str.charAt(crop_i)); 
		if(byte_count == limit-1){
			if(chr_byte(str.charAt(crop_i+1)) == 2){
				tmpStr = str.substring(0,crop_i+1);
				dot = "...";
			}
			else {
				if(crop_i+2 != len) dot = "...";
				tmpStr = str.substring(0,crop_i+2);
			}
			break;
		}
		else if(byte_count == limit){
			if(crop_i+1 != len) dot = "...";
			tmpStr = str.substring(0,crop_i+1);
			break;
		}
	}
	return (tmpStr+dot);
}

// 특수문자등을 사용했는지를 체크한다.
function dataCheck(data) {
	var num_cnt		=	0;
	var chk_str		=	'!#$%()*,-./:;<=>@[\]^_`{|}~';
	for (var i = 0; i < data.length; i++) {
		if ((((data.charAt(i) >= '0') && (data.charAt(i) <= '9'))) || (((data.charAt(i) >= 'a') && (data.charAt(i) <= 'z'))) || (((data.charAt(i) >= 'A') && (data.charAt(i) <= 'Z'))))
			num_cnt += 1;
		for (var j = 0; j < chk_str.length; j++)
			if (chk_str.charAt(j) == data.charAt(i))
				num_cnt -= 1;
	}
	if (num_cnt == data.length) {
		return true;
	}
	return false;
}
