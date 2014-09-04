
// 제휴링크 변환
function goProductUrl(url,merchant){
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

// 좋아요
function likeItem(item_type,ref_id){
    var likeId = "";
    var likeCntId = "";
    if(item_type=="P"){
    	likeId		= "pid_"+ref_id;
    	likeCntId	= "pcnt_"+ref_id;
    }else if(item_type=="C"){
    	likeId		= "cid_"+ref_id;
    	likeCntId	= "ccnt_"+ref_id;
    }
    
    $.ajax({
        url     : '/gets/put?ref_id='+ref_id+'&get_type=L&item_type='+item_type,
        type    : 'get',
        dataType: 'json',
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
		layer_open("/login_pop?backurl="+backurl,400,330,"no","pop_layer","pop_content");
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
	obj.value = trim(obj.value);
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
