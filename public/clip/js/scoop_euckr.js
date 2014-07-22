function money_point(A) {
	A = parseInt(A, 10);
	A = A.toString().replace(/[^-0-9]/g, "");
	while (A.match(/^(-?\d+)(\d{3})/)) {
		A = A.replace(/^(-?\d+)(\d{3})/, "$1,$2");
	}
	return A;
}

var ext = ext || {};
if (!ext.paffy) {
	ext.paffy = {};
}(function() {
	ext.paffy.Clip = function() {
		var HOST_URL = "http://www.raffinest.com";
		var CLIP_URL = HOST_URL + "/scoopsave/scooping";
		var b = HOST_URL + "/main/about_qna";
		var M;
		var F;
		var d = false;
		var N;
		var x;
		var t = null;
		var n = 0;
		var o = 23;
		var v = 210;
		var Q = 210;
		var X = 176;
		var y = 176;
		var L;
		var a = [{
			code : "ABC",
			url : "abc.abc.com"
		}];
		
		this.get_doc = function() {
			return L;
		};
		this.init = function() {
			S = window.location.href;
			L = document;
			var AF = document.getElementsByTagName("BODY")[0];

			if (!AF) {
				if (S.match("blog.naver.com") == "blog.naver.com") {
					var AG = document.getElementById("mainFrame");
					if (AG != "undefined" && AG != "" && AG != null) {
						L = frames.mainFrame.document;
					} else {
						alert("Page not HTML structure!");
						return;
					}
				} else {
					alert("Page not HTML structure!");
					return;
				}
			}
			if (!d) {
				PageScrollUp();
				AA();
				r();
				d = true;
				W();
			}
		};
		this.onOverItem = function(AF) {
			AF.style.backgroundPosition = "top left";
		};
		this.onOutItem = function(AF) {
			AF.style.backgroundPosition = "left -190px";
		};
		document.onkeydown = function(){
			if(event.keyCode==27){
				g();
			}
		}
		this.onClickCloseBtn = function() {
			g();
		};
		this.onClickCloseSaveBtn = function() {
			g();
		};
		this.CloseNoImgLayer = function() {
			g();
			location.href = b;
		};
		this.CloseBlockLayer = function() {
			g();
		};
		this.onClickCatList = function(AF) {
			for ( i = 1; L.getElementById("cat" + i) !== null; i++) {
				L.getElementById("cat" + i).className = L.getElementById("cat" + i).textContent == AF ? "on" : "";
			}
		};
		this.onChangeCheList = function(AF) {
			var AG = 0;
			for ( i = 1; L.getElementById("che" + i) !== null; i++) {
				if (L.getElementById("che" + i).checked == true) {
					AG++;
				}
			}
			if (AG > 3) {
				alert("선택은 최대 3개까지 가능합니다.");
				AF.checked = false;
			}
		};
		this.onClickColor = function() {
			L.getElementById("color_menu").style.display = L.getElementById("color_menu").style.display == "block" ? "none" : "block";
		};
		
		// POST 레이어 띄우기
		this.submitData = function(AF) {
			this.init();
			OpenPost(AF);

/*
			g();
			
			var AG = CLIP_URL + "?productDomain=" + V;
			AG += "&productPageUrl=" + encodeURIComponent(S);
			AG += "&documentTitle=" + encodeURIComponent(H);
			AG += "&imgUrl=" + encodeURIComponent(U[AF]);
			AG += "&price=" + encodeURIComponent(p);
			AG += "&ex_price=" + encodeURIComponent(f);
			AG += "&exchange=" + encodeURIComponent(R);
			
			w = 830;
			h = 666;
			LeftPosition = (screen.width - w) / 2;
			TopPosition = (screen.height - h) / 2;
			window.open(AG, "", "status=no,resizeble=yes, scrollbars=no,personalbar=no,directories=no,location=yes,toolbar=no,menubar=no,width=" + w + ",height=" + h + ",left=" + LeftPosition + ",top=+" + TopPosition);
*/

			
		};
		
		// POST 처리
		this.submitDataRequest = function(AF) {
			this.init();
			alert('포스팅~!!!!')
			
			
			
		};
		
		// 페이지 위로 이동
		function PageScrollUp() {
			document.body.scrollTop = 0;
			L.body.scrollTop = 0;
			L.documentElement.scrollTop = 0;
		}

		function m() {
			p = 0;
			f = 0;
			tmp_price = "";
			R = "KRW";
			var AF = jQuery.noConflict();
			AF.ajax({
				url : "http://www.raffinest.com/scoopsave/is_auto_price",
				type : "get",
				async : false,
				data : {
					name : V
				},
				dataType : "jsonp",
				jsonp : "callback",
				success : function(AI) {
					if (AI.domain != "") {
						if (AI.type == 0) {
							var AG = AF(AI.tag).clone();
							AG.children().remove();
							var AJ = AG.text();
							if (AJ != "") {
								if (AJ.search("%") == -1) {
									tmp_price = AJ.replace(/[^0-9.]/g, "");
								}
							}
						} else {
							var AH = AF("[name=" + AI.tag + "]").val();
							if (AH != "" && AH != null && AH != undefined) {
								tmp_price = AH.replace(/[^0-9.]/g, "");
							}
						}
						p = tmp_price;
						f = money_point(Math.round(tmp_price * AI.rate));
						R = AI.exchange;
					}
				}
			});
		}

		function k(AF) {
		}

		function AA() {
			N = navigator.appName.charAt(0);
			x = navigator.userAgent;
			t = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
			if (N == "M") {
				if (t.exec(x) != null) {
					n = parseFloat(RegExp.$1);
				}
			}
			if (N == "M") {
				v = Q = Q - 1;
			}
		}

		function r() {
			var AG = "html,body{width:100%;height:100%;margin:0;padding:0;}";
			AG += "#paffy_wrap_layer{z-index:10000;position:absolute;left:0;top:0;width:100%;height:100%;}";
			AG += "#paffy_wrap{z-index:10000;position:absolute;left:0;top:0;width:100%;height:100%;}";
			AG += "#paffy_wrap p,#paffy_wrap h1,#paffy_wrap ul,#paffy_wrap li,#paffy_wrap dl,#paffy_wrap dt,#paffy_wrap dd,#paffy_wrap form,#paffy_wrap fieldset,#paffy_wrap legend,#paffy_wrap input,#paffy_wrap textarea,#paffy_wrap button,#paffy_wrap select{margin:0;padding:0;}";
			AG += "body,#paffy_wrap button,#paffy_wrap h1{font-size:12px;color:#333;}";
			AG += "#paffy_wrap img,#paffy_wrap fieldset{border:0;}";
			AG += "#paffy_wrap ul{list-style:none;}";
			AG += "#paffy_wrap img,#paffy_wrap li{vertical-align:top;}";
			AG += "#paffy_wrap a{color:#333;text-decoration:none;}";
			AG += "#paffy_wrap a:hover,#paffy_wrap a:active,#paffy_wrap a:focus{text-decoration:underline;}";
			AG += "#paffy_wrap legend{display:none;}";
			AG += "#paffy_wrap button{overflow:visible;margin:0;padding:0;border:0;background:none;vertical-align:top;cursor:pointer;}";
			AG += "#paffy_wrap button::-moz-focus-inner{padding:0;border:0;}";
			AG += "#paffy_wrap .blind{overflow:hidden;position:absolute;top:0;left:0;width:0;height:0;font-size:0;line-height:0;}";
			AG += "#paffy_wrap .dimmed{z-index:1;position:absolute;left:0;top:0;width:100%;height:100%;background:#000;opacity:0.5;filter:alpha(opacity='50');}";
			AG += "#clip{position:relative;z-index:99;height:100%;}";
			AG += "#clip_header{overflow:hidden;position:relative;height:40px;border-bottom:1px solid #000;background-color:#000000;text-align:center;}";
			AG += "#clip_header .clip_logo{width:120px;height:30px;margin:5px auto 0;padding:0;background:url(http://203.228.244.59:3000/images/common/logo.png) no-repeat ;font-size:0;line-height:0;}";
			AG += "#clip_header .b_clipccl{position:absolute;top:8px;right:15px;width:26px;height:25px;background:url(http://203.228.244.59:3000/images/common/clip_close.png) no-repeat;}";
			AG += "#clip_header .b_clipccl:hover{background:url(http://203.228.244.59:3000/images/common/clip_close_on.png) no-repeat;}";
			AG += "#container_clip{position:relative;}";
			AG += "#container_clip .cliplist{overflow:hidden;width:100%;text-align:center;}";
			AG += "#container_clip .cliplist a{display:inline-block;overflow:hidden;position:relative;width:215px;height:215px;margin:23px 12px 0;border:1px solid #dbdbdb;background:#fff;text-align:center;vertical-align:top;}";
			AG += "#container_clip .cliplist a img{position:absolute;border:0;height:auto;width:auto;max-height:200px;max-width:200px;vertical-align:middle;}";
			AG += "#container_clip .cliplist a strong{display:none;position:absolute;left:0px;top:0px;width:215px;height:215px;background:url(http://203.228.244.59:3000/images/common/logo_clip.png) no-repeat;}";
			AG += "#container_clip .cliplist a:hover{border-color:#0a0a0a;}";
			AG += "#container_clip .cliplist a:hover strong{display:block;}";
			AG += ".clip_image{border:0;height:auto;width:auto;max-height:200px;max-width:200px;vertical-align:middle;}";
			AG += "#paffy_wrap .layer{position:absolute;font-size:12px;width:700px;z-index:9999;background-color:#FFFFFF;}";
			AG += "#paffy_wrap .layer .layer_hd{height:35px;}";
			AG += "#paffy_wrap .layer .layer_fn{height:39px;}";
			AG += "#paffy_wrap .layer .close{position:absolute;top:5px;right:5px;}";
			AG += "#paffy_wrap .layer .close a{display:block;width:26px;height:25px;background:url(http://203.228.244.59:3000/images/common/clip_close.png) no-repeat;}";
			AG += "#paffy_wrap .layer_cnt{padding:0 32px 0 30px;}";
			AG += "#paffy_wrap .layer_cnt .clipnd{display:block;width:68px;height:13px;}";
			AG += "#paffy_wrap .layer_cnt .tit{font-size:17px;font-weight:bold;padding:5px 0px 5px 0px;}";
			AG += "#paffy_wrap .layer_cnt .dec{width:100%;border:0;border-spacing:0;border-collapse:collapse;}";
			AG += "#paffy_wrap .layer_cnt .dec td{height:145px;border:0;}";
			AG += "#paffy_wrap .layer_cnt .dec td .tx{font-weight:bold;font-size:12px;padding-left:16px;line-height:16px;}";
			AG += "#paffy_wrap .layer_cnt .dec td .tx span{display:block;margin-top:16px;}";
			AG += "#paffy_wrap .layer_cnt .btn{clear:both;width:100%;padding-top:15px;text-align:center;}";
			AG += "#paffy_wrap .layer_cnt .btn .bn{margin:0 1px;*margin: 0 3px;}";
			//AG += "#paffy_wrap .layer_cnt .b_yes{display:inline-block;width:65px;height:28px;background:url(http://www.raffinest.com/img/sp_clip.png) no-repeat -159px -103px;}";
			//AG += "#paffy_wrap .layer_cnt .b_no{display:inline-block;width:65px;height:28px;background:url(http://www.raffinest.com/img/sp_clip.png) no-repeat -227px -103px;}";
			//AG += "#paffy_wrap .layer_cnt .b_com{display:inline-block;width:65px;height:28px;background:url(http://www.raffinest.com/img/sp_clip.png) no-repeat -295px -103px;}";
			//AG += "#paffy_wrap .layer_cnt .b_clip{display:inline-block;width:109px;height:28px;background:url(http://www.raffinest.com/img/sp_clip.png) no-repeat -363px -103px;}";
			
			var AH = L.createElement("style");
			AH.id = "paffy_style";
			AH.setAttribute("type", "text/css");
			L.getElementsByTagName("head")[0].appendChild(AH);
			if (AH.styleSheet) {
				AH.styleSheet.cssText = AG;
			} else {
				var AF = L.createTextNode(AG);
				AH.appendChild(AF);
			}
		}

		function g() {
			d = false;
			if (M) {
				L.body.removeChild(M);
			}
			M = null;
		}
		
		function GetHeight() {
			var AF = L;
			return Math.max(Math.max(AF.body.scrollHeight, AF.documentElement.scrollHeight), Math.max(AF.body.offsetHeight, AF.documentElement.offsetHeight), Math.max(AF.body.clientHeight, AF.documentElement.clientHeight));
		}

		// 이미지 선택 레이어를 띄운다
		function OpenItemList() {
		
			if (N == "M" && n < 9) {
				M = L.createElement('<div id="paffy_wrap_layer">');
			} else {
				M = L.createElement("div");
				M.setAttribute("id", "paffy_wrap_layer");
			}
			var TTT = '되냐??';
			var AH = '한글한글'+TTT;
			AH += '<div id="paffy_wrap" style="height:' + GetHeight() + 'px;">';
			AH += '<div class="dimmed"></div>';
			AH += '<div id="clip">';
			AH += '<div id="clip_header">';
			AH += '<h1 class="clip_logo"><span class="blind">PAFFY</span></h1>';
			AH += '<a href="#" onclick="parent.ext.paffy.ClipClass.onClickCloseBtn();" class="bn b_clipccl"><span class="blind">취소</span></a>';
			AH += "</div>";
			AH += '<div id="container_clip">';
			AH += '<div class="cliplist">';
			if (J != true) {
				var AG = U.length;	// item갯수
				for (var AF = 0; AF < AG; AF++) {
					AH += '<a href="#" onmouseover="parent.ext.paffy.ClipClass.onOverItem(this);"'
					+ ' onmouseout="parent.ext.paffy.ClipClass.onOutItem(this);"'
					+ ' onclick="parent.ext.paffy.ClipClass.submitData(' + AF + ');">'
					+ '<img onload="parent.ext.paffy.ClipClass.onThumbImgLoadComplete(this)"'
					+ ' onreadystatechange="parent.ext.paffy.ClipClass.onThumbImgStateChange(this)"'
					+ ' src="' + U[AF] + '" />'
					+ '<strong class="p24"><span class="blind">clip</span></strong></a>';
				}
			}
			AH += "</div>";
			AH += "</div>";
			AH += "</div>";
			
			
			if (J == true) {
				AH += '<div id="post" class="layer layersize" style="top:20%;left:50%;margin-left:-350px;">';
				AH += '<div class="layer_hd"></div>';
				AH += '<dl class="layer_cnt">';
				AH += '<dt class="tit"><strong class="tt note"><span class="blind">알림</span></strong></dt>';
				AH += '<dd class="cnt">';
				AH += '<table class="dec">';
				AH += '<tr>';
				AH += '<td>';
				AH += '<p class="tx">';
				AH += '<img src="http://www.raffinest.com/img/alert_scoop1.gif" />';
				AH += '</p>';
				AH += '</td>';
				AH += '</tr>';
				AH += '</table>';
				AH += '</dd>';
				AH += '<dd class="btn">';
				AH += '<button class="bn2 b_com"  onclick="ext.paffy.ClipClass.CloseBlockLayer();"><span class="blind">확인</span></button>';
				AH += '</dd>';
				AH += '</dl>';
				AH += '<div class="layer_fn"></div>';
				AH += '<div class="close"><a href="#" class="bn" onclick="parent.ext.paffy.ClipClass.onClickCloseBtn();"><span class="blind">레이어 닫기</span></a></div>';
				AH += '</div>';
				
			} else {
				AH += '<div id="post" class="layer layersize" style="display:none;top:70px;left:50%;margin-left:-350px;">';
				if (AG == 0) {
					AH += '<div class="layer_hd"></div>';
					AH += '<dl class="layer_cnt">';
					AH += '<dt class="tit"><strong class="tt note"><span class="blind">알림</span></strong></dt>';
					AH += '<dd class="cnt">';
					AH += '<table class="dec">';
					AH += '<tr>';
					AH += '<td>';
					//AH += '<p class="tx">';
					AH += '포스팅할 상품 이미지가 없습니다.';
					//AH += '</p>';
					AH += '</td>';
					AH += '</tr>';
					AH += '</table>';
					AH += '</dd>';
					AH += '<dd class="btn">';
					AH += '<button class="bn2 b_clip" onclick="parent.ext.paffy.ClipClass.CloseNoImgLayer();" ><span class="blind">스쿱 요청하기</span></button>';
					AH += '</dd>';
					AH += '</dl>';
					AH += '<div class="layer_fn"></div>';
					AH += '<div class="close"><a href="#" class="bn" onclick="parent.ext.paffy.ClipClass.onClickCloseBtn();"><span class="blind">레이어 닫기</span></a></div>';
				}
				AH += '</div>';
			}
			
			AH += '</div>';
			M.innerHTML = AH;
			L.body.appendChild(M);
		}
		

		// 포스팅레이어를 띄운다
		function OpenPost(AF) {
			var clipObj = document.getElementById("clip");
			var postObj = document.getElementById("post");
			
			clipObj.style.display="none";
			postObj.style.display="block";
			
			var objStr = ''
			+ '<div class="layer_hd"></div>'
			+ '<dl class="layer_cnt">'
			+ '	<dt class="tit">PAFFY에 포스팅하기</dt>'
			+ '	<dd class="cnt">'
			+ '		<table class="dec">'
			+ '			<tr>'
			+ '				<td width="210px" style="text-align:center">'
			+ '					<img id="item_img" class="clip_image" src="'+U[AF]+'" >'
			+ '				</td>'
			+ '				<td style="text-align:left; padding-left:10px; border-left:1px solid #CCCCCC; vertical-align: top;">'
			+ '					제목<br/>'
			+ '					<input type="text" id="item_subject" name="item_subject" value="" style="width:100%;" />'
			+ '					<br /><br />'
			+ '					가격 <br />'
			+ '					<input type="text" id="item_price" name="item_price" value="" style="width:150px;" />'
			+ '					<select id="item_price_type" name="item_price_type">'
			+ '						<option value="￦">원(￦)</option>'
			+ '						<option value="$">달러(＄)</option>'
			+ '						<option value="￥">엔(￥)</option>'
			+ '						<option value="€">유로(€)</option>'
			+ '						<option value="￡">파운드(￡)</option>'
			+ '						<option value="元">위안(元)</option>'
			+ '					</select>'
			+ '					<br /><br />'
			+ '					URL<br/>'
			+ '					<input type="text" id="item_url" name="item_url" value="'+document.location.href+'" style="width:100%;" />'
			+ '					<br /><br />'
			+ '					페이스북 공유 <input type="checkbox" id="item_share" name="item_share" value="Y" checked />'
			+ '					<br /><br />'
			+ '					<a href="#"><img src="http://203.228.244.59:3000/images/common/clip_post.png"></a>'
			+ '					&nbsp;'
			+ '					<a href="javascript:parent.ext.paffy.ClipClass.onClickCloseBtn();"><img src="http://203.228.244.59:3000/images/common/clip_cancel.png"></a>'
			+ '				</td>'
			+ '			</tr>'
			+ '		</table>'
			+ '	</dd>'
			+ '</dl>'
			+ '<div class="layer_fn"></div>'
			+ '<div class="close">'
			+ '	<a href="#" class="bn" onclick="parent.ext.paffy.ClipClass.onClickCloseBtn();"><span class="blind">레이어 닫기</span></a>'
			+ '</div>';

			postObj.innerHTML = objStr;
			//alert(postObj.innerHTML);
			

			//M.innerHTML = AH;
			//L.body.appendChild(M);
		}

		function W() {
			if (AD() == true) {
				J = true;
			} else {
				J = false;
			}
			var AF = Y();
			if (S.indexOf("paffy.") > -1) {
				g();
				alert("Create Paffy clip");
				return;
			}
			OpenItemList();
			AB("container");
			m();
		}

		function K(AG, AH) {
			var AF = document.createElement("script");
			AF.type = "text/javascript";
			if (AF.readyState) {
				AF.onreadystatechange = function() {
					if (AF.readyState == "loaded" || AF.readyState == "complete") {
						AF.onreadystatechange = null;
						AH();
					}
				};
			} else {
				AF.onload = function() {
					AH();
				};
			}
			AF.src = AG;
			document.getElementsByTagName("head")[0].appendChild(AF);
		}

		function AB(AG) {
			var AF = L.getElementById("paffy_wrap");
			AF.style.display = "block";
		}

		function I(AH, AG, AF) {
			if (AH.attachEvent) {
				AH.attachEvent("on" + AG, AF);
			} else {
				if (AH.addEventListener) {
					AH.addEventListener(AG, AF, false);
				}
			}
		}

		function E(AH, AG, AF) {
			if (AH.detachEvent) {
				AH.detachEvent("on" + AG, AF);
			} else {
				if (AH.removeEventListener) {
					AH.removeEventListener(AG, AF, false);
				}
			}
		}

		var V;
		var S;
		var H;
		var AC;
		var p;
		var f;
		var R;
		var O;
		var l;
		var z;
		var c;
		var U;
		var J;
		var T = 100;
		var q = 500000;
		var C = 70;
		function Y() {
			H = document.title;
			U = [];
			var AG;
			var AF = [];
			V = window.location.hostname;
			AF = e();
			AG = true;
			U = AF.slice(0, C);
			return AG;
		}

		function AD() {
			var AH = window.location.href;
			var AG = a.length;
			for (var AF = 0; AF < AG; AF++) {
				if (AH.indexOf(a[AF].url) > -1) {
					return true;
				}
			}
			return false;
		}

		function e() {
			var AF = L.getElementsByTagName("img");
			return u(AF);
		}

		function u(AK) {
			var AJ = AK.length;
			var AI = [];
			for (var AG = 0; AG < AJ; AG++) {
				var AF = AK[AG].width;
				var AH = AK[AG].height;
				if (AF < T) {
					continue;
				}
				if (AH < T) {
					continue;
				}
				if (AF > q) {
					continue;
				}
				if (AH > q) {
					continue;
				}
				if (AK[AG].src.match(".gif") == ".gif") {
					continue;
				}
				AI.push(AK[AG].src);
			}
			return AI;
		}

		function AE(AF) {
			if (AF.contentDocument) {
				return AF.contentDocument;
			} else {
				if (AF.contentWindow) {
					return AF.contentWindow.document;
				} else {
					return AF.document;
				}
			}
		}

		function s(AJ, AL, AF) {
			var AI = new Array();
			var AH = AJ.getElementsByTagName(AF);
			var AG = AH.length;
			var AK = new RegExp("^" + AL + "$");
			for ( i = 0, j = 0; i < AG; i++) {
				if (AK.test(AH[i].className)) {
					AI[j] = AH[i];
					j++;
				}
			}
			return AI;
		}
		this.onThumbImgLoadComplete = function(AH) {
			var AG = AH.width;
			var AF = AH.height;
			if (AG >= v || AF >= Q) {
				B(AH, v, Q, true);
			} else {
				B(AH, AG, AF, true);
			}
		};
		this.onThumbImgStateChange = function(AH) {
			if (AH.readyState == "complete" || AH.readyState == "loading") {
				if (N == "M" && n < 10) {
					var AG = AH.width;
					var AF = AH.height;
					if (AG >= v || AF >= Q) {
						B(AH, v, Q, true);
					} else {
						B(AH, AG, AF, true);
					}
				}
			}
		};
		function B(AJ, AN, AK, AF) {
			var AO = AJ.width;
			var AM = AJ.height;
			var AI = Math.min(AN / AO, AK / AM);
			var AG = (AI * AO);
			var AP = (AI * AM);
			AJ.setAttribute("width", AG);
			AJ.setAttribute("height", AP);
			if (AF) {
				var AL = Math.floor((v - AG) / 2) + "px";
				var AH = Math.floor((Q - AP) / 2) + "px";
				if (N == "M" && n < 9) {
					AJ.style.cssText = "position:absolute;left:" + AL + ";top:" + AH + ";";
				} else {
					AJ.style.left = AL;
					AJ.style.top = AH;
				}
			}
		}

	};
})();
(function() {
	function D(G, H) {
		var F = document.createElement("script");
		F.type = "text/javascript";
		if (F.readyState) {
			F.onreadystatechange = function() {
				if (F.readyState == "loaded" || F.readyState == "complete") {
					F.onreadystatechange = null;
					H();
				}
			};
		} else {
			F.onload = function() {
				H();
			};
		}
		F.src = G;
		document.getElementsByTagName("head")[0].appendChild(F);
	}

	var A = document.getElementsByTagName("script");
	var E = A.length;
	var C = 0;
	while (E) {
		var B = A[E - 1];
		if (-1 != B.src.indexOf("jquery")) {
			C = 1;
			break;
		}
		E--;
	}
	if (C == 0) {
		var latestVersion = "1.8.2";
		D("http://ajax.googleapis.com/ajax/libs/jquery/"+latestVersion+"/jquery.min.js", function() {
			if (!ext.paffy.ClipClass) {
				ext.paffy.ClipClass = new ext.paffy.Clip();
				ext.paffy.ClipClass.init();
			} else {
				ext.paffy.ClipClass.init();
			}
		});
	} else {
		if (!ext.paffy.ClipClass) {
			ext.paffy.ClipClass = new ext.paffy.Clip();
			ext.paffy.ClipClass.init();
		} else {
			ext.paffy.ClipClass.init();
		}
	}
})();
