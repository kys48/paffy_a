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
