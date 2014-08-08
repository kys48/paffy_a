var _aspeed = 200;

// ESC Event
$(document).keydown(function(event){
	if(event.keyCode != 27) return true;
	$('.player').fadeOut(_aspeed);
	e.preventDefault();
	return false;
});

// 팝업레이어 열기(iframe)
function layer_open(url,width,height,scrl,divId,contId){
	var temp = $('#'+divId);
	var bg = temp.prev().hasClass('bg');	//dimmed 레이어를 감지하기 위한 boolean 변수
	
	var tempWidth	= temp.outerWidth();
	var tempHeight	= temp.outerHeight();
	
	if(width>0) tempWidth = width;
	if(height>0) tempHeight = height;

	// 화면의 중앙에 레이어를 띄운다.
	if (tempHeight < $(document).height() ) temp.css('margin-top', '-'+tempHeight/2+'px');
	else temp.css('top', '0px');
	if (tempWidth < $(document).width() ) temp.css('margin-left', '-'+tempWidth/2+'px');
	else temp.css('left', '0px');
	
	$('#'+contId).html(''
	+ '<div id="frameLayerFrm" style="width:'+tempWidth+'px;height:'+tempHeight+'px;">'
	+ '	<iframe id="frameLayerIFrm" src="'+url+'" width="'+tempWidth+'px" height="'+tempHeight+'px" scrolling="'+scrl+'" frameborder="0"></iframe>'
	+ '</div>');
	
	if(bg){
		$('.player').fadeIn(_aspeed);	//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다. 
	}else{
		temp.fadeIn(_aspeed);
	}

	temp.find('.cbtn').click(function(e){
		if(bg){
			$('.player').fadeOut(_aspeed); //'bg' 클래스가 존재하면 레이어를 사라지게 한다. 
		}else{
			temp.fadeOut(_aspeed);
		}
		e.preventDefault();
	});

	$('.player .bg').click(function(e){	//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
		$('.player').fadeOut(_aspeed);
		e.preventDefault();
	});
}

function layer_close(){
	$('.player').fadeOut(_aspeed);
}

// 팝업레이어 열기(내용)
function layer_open_html(str,width,height,scrl,divId,contId){
	var temp = $('#'+divId);
	var bg = temp.prev().hasClass('bg');	//dimmed 레이어를 감지하기 위한 boolean 변수
	
	var tempWidth	= temp.outerWidth();
	var tempHeight	= temp.outerHeight();
	
	if(width>0) tempWidth = width;
	if(height>0) tempHeight = height;

	// 화면의 중앙에 레이어를 띄운다.
	if (tempHeight < $(document).height() ) temp.css('margin-top', '-'+tempHeight/2+'px');
	else temp.css('top', '0px');
	if (tempWidth < $(document).width() ) temp.css('margin-left', '-'+tempWidth/2+'px');
	else temp.css('left', '0px');
	
	$('#'+contId).html(str);
	
	if(bg){
		$('.player').fadeIn(_aspeed);	//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다. 
	}else{
		temp.fadeIn(_aspeed);
	}

	temp.find('.cbtn').click(function(e){
		if(bg){
			$('.player').fadeOut(_aspeed); //'bg' 클래스가 존재하면 레이어를 사라지게 한다. 
		}else{
			temp.fadeOut(_aspeed);
		}
		e.preventDefault();
	});

	$('.player .bg').click(function(e){	//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
		$('.player').fadeOut(_aspeed);
		e.preventDefault();
	});
}

// 로딩중 레이어 열기
function layer_open_loading(divId,style,bgYn){
	var temp = $('#'+divId);
	
	var tempWidth	= temp.outerWidth();
	var tempHeight	= temp.outerHeight();

	// 화면의 중앙에 레이어를 띄운다.
	if (tempHeight < $(document).height() ) temp.css('margin-top', '-'+tempHeight/2+'px');
	else temp.css('top', '0px');
	
	if (tempWidth < $(document).width() ) temp.css('margin-left', '-'+tempWidth/2+'px');
	else temp.css('left', '0px');

	temp.html('loading more... <img src="/images/common/loading5.gif">');
	
	switch (style){
		case 1:
			temp.html('<img src="/images/common/loading1.gif">');
			break;
		case 2:
			temp.html('<img src="/images/common/loading2.gif">');
			break;
		case 3:
			temp.html('loading more... <img src="/images/common/loading3.gif">');
			break;
		case 4:
			temp.html('loading more... <img src="/images/common/loading4.gif">');
			break;
		case 5:
			temp.html('loading more... <img src="/images/common/loading5.gif">');
			break;
		case 6:
			temp.html('<img src="/images/common/loading3.gif">');
			break;
		case 7:
			temp.html('<img src="/images/common/loading4.gif">');
			break;
		case 8:
			temp.html('<img src="/images/common/loading5.gif">');
			break;
	}
	
	
	if(bgYn=="Y"){
		$('.loading-layer .bg').show();
	} else {
		$('.loading-layer .bg').hide();
	}

	$('.loading-layer').show(); 
	temp.show();

}

// 로딩중 레이어 닫기
function layer_close_loading(divId){
	var temp = $('#'+divId);
	$('.loading-layer .bg').hide();
	$('.loading-layer').hide();
	temp.hide();
}