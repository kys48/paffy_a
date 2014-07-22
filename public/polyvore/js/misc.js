var semafors = new Array();
var translations = new Array();

//static variables for the whole page
$.staticVars = {
    counterIFile:10
};

// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
//     ie === undefined
// If you're in IE (>5) then you can determine which version:
//     ie === 7; // IE7
// Thus, to detect IE:
//     if (ie) {}
// And to detect the version:
//     ie === 6 // IE6
//     ie> 7 // IE8, IE9 ...
//     ie <9 // Anything less than IE9
// ----------------------------------------------------------
var ie = (function(){
    var undef, v = 3, div = document.createElement('div');

    while (
        div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
        div.getElementsByTagName('i')[0]
    );

    return v> 4 ? v : undef;
}());

function SendAjax(target, submitForm, dataType){
    
    if(semafors['ajax'] === true)
        return;

    semafors['ajax'] = true;

    var data = null;            
    if(submitForm) {
    
        var submitButton = $('#'+submitForm+' .submitButton');
        var submitButtonText = submitButton.html();
        
        submitButton.addClass('inactive');
        submitButton.html(TranslationLabels['submitButton']);
            
        $('#'+submitForm+' input').each(function(){
            if($(this).hasClass('error'))
                $(this).removeClass('error');
        });
                
        var form = $('#'+submitForm);
        data = form.serialize();                          
                                                              
        var errorBox = $('#'+submitForm+' .errorBox');
        errorBox.hide();
        errorBox.html('');
    }
    
    var ajax = 1;
    if(!dataType)
        dataType = 'json';                         
                                
    return $.ajax({
          url: target,
          cache: false,
          type: 'post',
          data: data,
          dataType: dataType,
          success: function(data){
              // error
              if(data.code == 0 || !data.status) {
                  if(data.field && submitForm) {     
                      if(typeof data.field == 'object') {
                          jQuery.each(data.field, function(){
                              var input = form.find('input[name='+this+']');
                              if(!input.hasClass('error'))
                                  input.addClass('error');      
                          });    
                      } else {
                          var input = form.find('input[name='+data.field+']');
                          if(!input.hasClass('error'))
                              input.addClass('error');
                      }
                      
                      if(data.msg && data.msg != ''){
                        errorBox.html(data.msg);
                        errorBox.show();
                      }
                      submitButton.removeClass('inactive');
                      submitButton.html(submitButtonText);
                                                 
                  } else if(!submitForm){
                      notify('error', data.msg);
                  } else {
                      if(data.msg && data.msg != ''){
                        errorBox.html(data.msg);
                        errorBox.show();
                      }
                      submitButton.removeClass('inactive');
                      submitButton.html(submitButtonText);      
                  }
                      
                  if(data.redirect)
                    document.location.href = data.redirect;
                    
                  semafors['ajax'] = false;
                  
              } else {
                  
                  semafors['ajax'] = false;
                  
                  var note = notify('success', data.msg, function(){
                      if(data.redirect)
                        document.location.href = data.redirect;
                  });
                  
              }
                       
          },
          statusCode: {
            400: function() {                     
                if(submitForm) {                                             
                    submitButton.removeClass('inactive');
                    submitButton.html(submitButtonText);
                }
            }
          },
          error: function(e, xhr){
            if(e.status === 400){
                window.location.href="errors.php?badRequest";
            }else if(e.status === 404){
                window.location.href="errors.php?notFound";
            }else if(e.status === 200){          
                notify('error', TranslationLabels['could_not_complete_request']);
                if(submitForm){
                    submitButton.removeClass('inactive');
                    submitButton.html(submitButtonText);
                }
                semafors['ajax'] = false;
            }                                
          }
        });
        
}

function loadAjaxBox(url, data, async, popupSelector, show, popupClass) {
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    if(typeof(async) == "undefined")
        async = true;
        
    if(!popupSelector)
        popupSelector = 'popupContainer';
        
    if(typeof(show) == "undefined")
        show = true;
        
    $.ajax({
        url: url,
        cache: false,
        type: 'post',
        data: data,
        dataType: 'html',
        async: async,
        success: function(data, status, request) {
            
            semafors['ajax'] = false;
            
            var json;
            try {
    //            var json = eval('('+ data +')');
                json =  jQuery.parseJSON(data);
            } catch (exception) {
                //It's advisable to always catch an exception since eval() is a javascript executor...
                json = null;
            }
            if(json){
                if(typeof(json) === "object" && json.status == false){
                    notify('error', json.msg);
                
                    if(json.login_required)
                        loadAjaxBox('/register');
                
                    return;    
                }
            } else
                showPopup(popupSelector, data, show, popupClass);
        }    
    });      
}

function toJObj(selector) {
    var $obj;
    try {
        if (selector.indexOf('#') !== 0)
            selector = '#' + selector;
        $obj = $(selector);
    }
    catch (e) {
        $obj = selector;
    }
    return $obj;
}


function showPopup(popup, data, show, popupClass) {
    
    var $popup = toJObj(popup);
    
    if (!$popup || $popup.length < 1)
        return;
    
    if(data)
        $popup.html(data);
        
    if(typeof(show) == "undefined")
        show = true;
    
    var pos = getCenterPopupPosition($popup);
             
    $popup.addClass('active').css({
        'margin'    : 0,
        'position'  : 'absolute',
        'display'   : 'block'
    });
    
    if(popupClass != '')
        $popup.addClass(popupClass);
   
    $popup.offset({ top: pos.top, left: pos.left }).css({'display' : 'none'});
        
    if(!show)
        return false;
        
    popupDisplay($popup);
    
}

function getCenterPopupPosition($popup){
    var winProps = {
        'w'     : parseInt($(window).width()),
        'h'     : parseInt($(window).height())
    };
    
    var popupProps = {
        'w'     : parseInt($popup.outerWidth()),
        'h'     : parseInt($popup.outerHeight())
    };
    
    var scrollProps = {
        'top'   : parseInt($(document).scrollTop()),
        'left'  : parseInt($(document).scrollLeft())
    };
            
    var pos = {
        'left' : Math.ceil(scrollProps.left + (winProps.w - popupProps.w)/2) ,
        'top' : (popupProps.h <= winProps.h) ? Math.ceil(scrollProps.top + (winProps.h - popupProps.h)/2) : scrollProps.top + 20
    };
    
    return pos;    
}

function popupDisplay(popup) {
    
    var $popup = toJObj(popup);
    
    if($('#mask').length == 0)
        $('body').append('<div id="mask"></div>');
        
    var $mask = $('#mask');
        
    $mask.off('click').fadeIn('fast');
    
    $popup.show();
       
}

function simplePopup(divId) {
    
    if($('#mask').length == 0)
        $('body').append('<div id="mask"></div>');   
    $('#mask').fadeIn(300,function(){
        $('#'+divId).show();
    }).off('click').on('click', function(){
        $('#mask , #'+divId+'').fadeOut(300 , function() {
            $('#popupContainer').hide();
            $('#mask').hide();
        }); 
        return false;
    });
    $('a.close').on('click', function(e){
        $('#mask , #'+divId+'').fadeOut(300 , function() {
            $('#popupContainer').hide();
            $('#mask').hide();
        }); 
        return false;
    })
    
}

function loadGroupSets(groupId) {
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;    

    var url = '/groups/'+groupId+'/group?loadSets';
    
    return $.ajax({
        url: url,
        cache: false,
        type: 'get',
        dataType: 'html',
        success: function(data) {                       
            
            $('#groupSets').html(data);
            if($('#mask').length == 0)
                $('body').append('<div id="mask"></div>');   
            $('#mask').off('click').fadeIn(300,function(){
                $('#groupSets').show();
            });     
            semafors['ajax'] = false;
        }
    });
    
}

function loadItem(id, origin, img_name, object, target, small){
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    if(origin == 'template_create' || origin == 'template_create_draft')
        origin = 'template';
    
    //var url = '/'+origin+'/'+id;
    var url = '/products/'+id;
    
    if(small)
        //url += '?small'


    return $.ajax({
        url: url,
        cache: false,
        type: 'get',
        dataType: 'html',
        success: function(data) {
    
            target.find('.items .popupWhite.product').remove();
            
            target.find('.items').prepend(data);
            
            var $popup = target.find('.items .popupWhite');
            var $window = $(window);
            
            var popupTop = $window.scrollTop() + ( $(window).height() - $popup.outerHeight() ) / 2;
            
            target.find('.items .popupWhite').css({top: popupTop}).fadeIn(300);       
            
            semafors['ajax'] = false;
        }
    });
}

function dialogError(msg){
    var msg = $('<div>').html(msg);
    msg.appendTo('body').dialog({
        modal: true,
        title: 'Error',
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    }

function like(itemId, type){
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url: '/like/'+type+'/'+itemId,
        cache: false,
        type: 'get',
        dataType: 'json',
        success: function(json){
            
            semafors['ajax'] = false;
            
            if(json.status == false){
                notify('error', json.msg);
                
                if(json.login_required)
                    loadAjaxBox('/register');
                
                return;
            }
            
            var $el = $('.like .'+type+'_'+itemId);
            
            $el.html(json.msg);
            
            if(json.active)
                $el.parent().addClass('active');
            else
                $el.parent().removeClass('active');
                                    
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
}

function deleteComment(url, callback){
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url: url,
        cache: false,
        type: 'get',
        dataType: 'json',
        success: function(json){
            
            semafors['ajax'] = false;
            
            if(json.status == false)
                notify('error', json.msg);
            else{
                notify('success', json.msg);
                if(callback)
                    callback();
            }
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
    
}

function deleteItem(url, callback){
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url: url,
        cache: false,
        type: 'get',
        dataType: 'json',
        success: function(json){
            
            semafors['ajax'] = false;
            
            if(json.status == false)
                notify('error', json.msg);
            else{
                notify('success', json.msg);
                if(callback)
                    callback();
            }               
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
    
}

function loadAbout(){
    
    if($('#footer').length == 1){
        
        if(semafors['loadAbout'] != true){
            semafors['loadAbout'] = true;
            $('#footer').stop().animate({bottom: '0px'}, 300);
        }else{
            semafors['loadAbout'] = false;
            $('#footer').stop().animate({bottom:-$('#footer').outerHeight() - 20 + 'px'}, 300);
        }
        return;
    }
    
    if(semafors['ajax'])
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url     : '/footer',
        success : function(html){
            $('#main_wrapper').append(html);
            $('#footer').css({
                bottom: -$('#footer').outerHeight() - 20 + 'px'
            }).show();
            semafors['ajax'] = false;
            semafors['loadAbout'] = true;
            $('#footer').show().stop().animate({bottom: '0px'}, 300);
        }
    })
        
}

function follow(followId){
    
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url: '/follow/'+followId,
        cache: false,
        type: 'get',
        dataType: 'json',
        success: function(json){

            semafors['ajax'] = false;
            
            if(json.status == false){
                notify('error', json.msg);
                
                if(json.login_required)
                    loadAjaxBox('/register');
                
            }else{
                
                var $el = $('.follow .follow_'+followId);
                
                $el.html(json.button);
                
                notify('success', json.msg);
                
                if(json.active)
                    $el.parent().addClass('active');
                else
                    $el.parent().removeClass('active');
            
            }
            
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
}

function toggleCommentBox(itemId, type, element){
    
    var commentId = '#comment_'+itemId+'_'+type;
    var $Comment = $(commentId);
    
    if($Comment.length > 0){
        if($Comment.css('display') == 'block'){
            $Comment.hide();
            
            if($('.collectionImage.items').length > 0){
                //Reinitialization of set items info and popups position
                $('.collectionImage.items').setItemsHighlighter('adjustPositions');
            }
        } else {
            $Comment.show();
            
            if($('.collectionImage.items').length > 0){
                //Reinitialization of set items info and popups position
                $('.collectionImage.items').setItemsHighlighter('adjustPositions');
            }
        }
        return;
    }
        
    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;
    
    $.ajax({
        url: '/comment/load/'+type+'/'+itemId,
        cache: false,
        type: 'get',
        dataType: 'json',
        success: function(json){
            
            semafors['ajax'] = false;
            
            if(json.status == false)
                notify('error', json.msg);
            else{
                
                $Conmment = $('<div id="'+commentId+'"></div>').html(json.msg);
                
                element.closest('ul').after($Conmment);
                
            }                   
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
    
}

function postComment(itemId, type, comment, commentBox, skipHide){

    if(semafors['ajax'] === true)
        return;
    
    semafors['ajax'] = true;

    $.ajax({
        url: '/comment/send/'+type+'/'+itemId,
        cache: false,
        type: 'post',
        data: {comment: comment},
        dataType: 'json',
        success: function(json){
            
            semafors['ajax'] = false;
            
            if(json.status == false)
                notify('error', json.msg);
            else{
                notify('success', json.msg);
                $('.comment .'+type+'_'+itemId).html(json.comments);
                
                if(!skipHide){
                    commentBox.hide();
                    
                    if($('.collectionImage.items').length > 0){
                        //Reinitialization of set items info and popups position
                        $('.collectionImage.items').setItemsHighlighter('adjustPositions');
                    }
                }
                  
                commentBox.find('textarea').val('');
                
                $(document).trigger('commentComplete', {commentItemId: itemId, commentOrigin: type});
                
            }
    
        },
        error: function(){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }        
    });
    
}

//Custom file upload input generation function code start
var ifl = function(element, options){
    var ifElement = element;
    var $this = this; //parent this
    var options = $.extend({
        onInit:''
    }, options);
    var elementid = $(ifElement).prop("id");
    if(typeof(elementid)=="undefined" || elementid.length<=0) {
        //assign an id;
        elementid = "msifl"+$.staticVars.counterIFile++;//it makes the id unique for the page if element has no id.
        $(ifElement).attr("id", elementid);
    };
    var config = {postID:'_ifl'};
    this.iflProp = new Object(); //storing propeties;
    
    var createInput = function () {
        
        //apply events and styles for file input element
        var fileInput = $(ifElement)
            .addClass('customfile-input') //add class for CSS
            .mouseover(function(){ upload.addClass('customfile-hover'); })
            .mouseout(function(){ upload.removeClass('customfile-hover'); })
            .focus(function(){
                upload.addClass('customfile-focus'); 
                fileInput.data('val', fileInput.val());
            })
            .blur(function(){ 
                upload.removeClass('customfile-focus');
                $(this).trigger('checkChange');
             })
             .bind('disable',function(){
                fileInput.attr('disabled',true);
                upload.addClass('customfile-disabled');
                $this.iflProp["disabled"] = true;
            })
            .bind('enable',function(){
                fileInput.removeAttr('disabled');
                upload.removeClass('customfile-disabled');
                $this.iflProp["disabled"] = false;
            })
            .bind('checkChange', function(){
                if(fileInput.val() && fileInput.val() != fileInput.data('val')){
                    fileInput.trigger('change');
                }
            })
            .bind('change',function(){
                //get file name
                var fileName = $(this).val().split(/\\/).pop();
                //get file extension
                var fileExt = 'customfile-ext-' + fileName.split('.').pop().toLowerCase();
                //update the feedback
                uploadFeedback
                    .text(fileName) //set feedback text to filename
                    .removeClass(uploadFeedback.data('fileExt') || '') //remove any existing file extension class
                    .addClass(fileExt) //add file extension class
                    .data('fileExt', fileExt) //store file extension for class removal on next change
                    .addClass('customfile-feedback-populated'); //add class to show populated state
                //change text of button    
                uploadButton.text('Change');    
            })
            .click(function(){ //for IE and Opera, make sure change fires after choosing a file, using an async callback
                fileInput.data('val', fileInput.val());
                setTimeout(function(){
                    fileInput.trigger('checkChange');
                },100);
            });
            
        //create custom control container
        var upload = $('<div class="customfile"></div>');
        //create custom control button
//        var uploadButton = $('<span class="customfile-button bRed" aria-hidden="true">Browse</span>').appendTo(upload);
//        //create custom control feedback
//        var uploadFeedback = $('<span class="customfile-feedback" aria-hidden="true">No file selected...</span>').appendTo(upload);
        
        //match disabled state
        if(fileInput.is('[disabled]')){
            fileInput.trigger('disable');
        }
            
        
        //on mousemove, keep file input under the cursor to steal click
        upload
            .mousemove(function(e){
                /*  POINTLESS
                fileInput.css({
                    'left': e.pageX - upload.offset().left - fileInput.outerWidth() + 20, //position right side 20px right of cursor X)
                    'top': e.pageY - upload.offset().top - $(window).scrollTop() - 3
                });
                */    
            })
            .insertAfter(fileInput); //insert after the input
        
        fileInput.appendTo(upload);
         
    }
    
    var init = function() {
        //create wrapper
        createInput();
        if(options.onInit!='') {
            eval(options.onInit)($this);
        };        
    };
    init();
    
}

$.fn.extend({
    customFileInput: function(options, methods){
        return this.each(function(){
            if ($(this).data('ifl')) return;
            if($(this).is("input:file")) {
                
                if($(this).parent().hasClass('file-upload')){
                    return;
                }
                var myfile = new ifl(this, options);
                $(this).data('ifl', myfile);
                 
            }else{
                return true;
            }
        });
    }
});
//Custom file upload input generation function code end

function showRequest(formData, jqForm, options) {
    var fileToUploadValue = $('input[name=buddy_icon]').fieldValue();
    if (!fileToUploadValue[0]) {
        document.getElementById('message').innerHTML = TranslationLabels['please_select_a_file'];
        return false;
    }
    
    $('#message').hide();
    $('#result').hide();
    $("#loader").show();
    $('#buddyIcon').hide();
    
    return true;
} 

function showResponse(data, statusText) {
    var buddyIcon = $('#buddyIcon');
    if (statusText == 'success') {
        if (data.img != '') {
            buddyIcon.find('img').attr('src', imgURL+'images/avatars/thumb_small/'+data.img+'?'+new Date().getTime());
            $('#avatarSmall').attr('src', imgURL+'images/avatars/thumb_small/'+data.img+'?'+new Date().getTime());
            document.getElementById('result').innerHTML = TranslationLabels['image_uploaded_successfully'];
            $("#loader").hide({ duration: 10, done: function(){ $('#result').show(); buddyIcon.show();}});
        } else {
            document.getElementById('message').innerHTML = data.error;
            $("#loader").hide({ duration: 10, done: function(){ $('#message').show(); buddyIcon.show();}});
        }
    } else {
        document.getElementById('message').innerHTML = TranslationLabels['unknown_error'];
        $("#loader").hide({ duration: 10, done: function(){ $('#message').show(); buddyIcon.show();}});
    }
        
    semafors['upload'] = false;
    
}

function showError(e) { 
    document.getElementById('message').innerHTML = e; 
    semafors['upload'] = false; 
}

function refreshPage() {
    window.location.href = location.href + "?" + Date.parse(new Date());
}

//doOnce plugin
jQuery.fn.doOnce = function( func ){
 
  this.length && func.apply( this );
  return this;
 
}

function Redirect(url) {
    window.focus();
    document.location.href = url;
}

//ajax load function with callback and arguments,
//which works with html and json data types and can submit serilized form data with request
function Load(url, divId, dataType, callback, args, form, async){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    var formData = false, dis = this, div;
    
    if(divId)
        div = $('#'+divId);
    
    if(form){
        var formId = $('#'+form);
        formData = formId.serialize();
    }
    
    if(!dataType)
        dataType = "json";
        
    if(async == undefined)
        async = true;
                                                                                                                                        
    if(div && divId != 'noLoader')
        div.html('<div class="loading"><img src="'+imgURL+'/images/flat/loader.gif" width="20" height="20" /><span>'+TranslationLabels['loading']+'...</span></div>');
                                
    $.ajax({
        url     : url,
        type    : 'get',
        data    : formData,
        dataType: dataType,
        async   : async,  
        success : function(data){
            if(dataType == 'html' && div)
                div.html(data);
            else {
                
                if(!callback && data.redirect){
                    semafors['ajax'] = false;
                    Redirect(data.redirect);
                    return;
                }
                
                if(!callback && data.status != 1){
                    //error    
                }
                
                if(callback){
                    if(args && jQuery.type(args) === "array")
                        args.push(data);
                    else
                        args = [data];
                    callback.apply(dis, args); //call callback
                } else {
                    if(div){
                        $('#'+div).html('');           
                        $('#'+div).html(data.msg);
                    }    
                }
                
            }
            if(div && div.css('display') == 'none'){
                div.show();
            }
            semafors['ajax'] = false; 
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
    return false;

}

//Load friends in social networks (ajax callback for Load function)
function loadFriends(){
    
    var data = arguments[2], page = arguments[1], type = arguments[0], div = $('#socialContainer');
    
    if(data.redirect){
        $.oauthpopup({
            path: data.redirect,
            callback: function(){
                //ajax poll to check if user logged
                $.ajax({
                    url     : '/activity/social?check_'+type+'=1',
                    type    : 'get',
                    dataType: 'json',  
                    success : function(data){
                        if(data.status == 1){
                            Load('/activity/social?find_friends_in='+type+'&page='+page, 'socialContainer', 'json', loadFriends, [type, page]);        
                        } else {
                            return;    
                        }
                    },
                    error   : function(e){
                        semafors['ajax'] = false;
                        notify('error', TranslationLabels['could_not_complete_request']);
                    }
                });
            }
        });
        semafors['ajax'] = false;
        return;
    } else {
        
        var html = '';
        
        if(data.status != 1)
            html += '<h3>'+TranslationLabels['sorry_no_friends_using_app_found_we_recommend_the_following_users:']+'</h3>';    
        else
            html += '<h3>'+ TranslationLabels['found'] + ' ' + ((data.friends) ? data.friends.length*data.total : 0)+' '+type.capitalize()+' '+(data.friends && ((data.friends.length*data.total) == 1) ? TranslationLabels['friend'] : TranslationLabels['friends'] )+' '+TranslationLabels['on_site']+'</h3>';
        
        if(data.friends.length > 0){
            
            html += '<div class="find_friends">'+
                    '<span class="bBlue btn_action" id="followAllBtn">'+TranslationLabels['follow_all']+'</span>'+
                    '<div class="friendTable">'+
                    '<table>';
            
            var len = data.friends.length;
                    
            $.each(data.friends, function(index, v){
                
                var avatarUrl = imgURL+'images/avatars/thumb_small/'+v.user_id+'.png?'+new Date().getTime(); 
        
                $.loadImage(avatarUrl)
                .fail(function(image) {
                    avatarUrl = imgURL+'images/StyleExplorer.png';    
                }).always(function(){
                    
                    if(index%3 == 0)
                        html += '<tr>';
                    
                    html += '<td>'+
                                '<div class="rec_follow">'+
                                    '<a href="'+siteURL+'profile/'+v.user_id+'" target="_blank" class="userIcon tooltip">'+
                                        '<i>'+((v.full_name) ? v.full_name : v.screen_name)+'<br/>'+v.screen_name+'</i>'+
                                        '<img src="'+avatarUrl+'" alt="'+((v.full_name) ? v.full_name : v.screen_name)+'">'+
                                    '</a>'+
                                    '<div class="info">'+
                                        '<span class="bBlue follow_action follow" _uid="'+v.user_id+'"><input type="hidden" name="data" value="'+v.user_id+'" />'+
                                        '<span class="follow_'+v.user_id+'">'+v.followers+'</span></span>'+
                                    '</div>'+
                                '</div>'+
                            '</td>';
                           
                    if(index%3 != 0)
                        html += '</tr>';
                        
                    if(index == len - 1){
                        
                        html += '</table></div>';
                        
                        if(social_searchable == 'no')
                            html += '<div id="friends_overlay"></div><center class="bBlue btn_action" id="friends_allow_btn">'+TranslationLabels['let_friends_find_me_too']+'</center>';
                        
                        
                        if(data.status == 1){
                            //Pagging
                            html += '<ul class="pagging basic" id="pagination-clean">';
                            
                            if(data.page > 1)
                                html += '<li><a href="/activity/social?find_friends_in='+type+'&page='+(data.page-1)+'&link=1">&laquo; '+TranslationLabels['previous']+'</a></li>';
                            
                            for(var i = 1; i <= data.total; i++){            
                                html += '<li '+((i == data.page) ? 'class="active"' : '' )+'><a href="/activity/social?find_friends_in='+type+'&page='+i+'&link=1">'+i+'</a></li>';
                            }
                            
                            if(data.page < data.total)    
                                html += '<li><a class="singleForward" href="/activity/social?find_friends_in='+type+'&page='+(data.page+1)+'&link=1"></a></li>';
                            
                            html += '<div class="clear"></div></ul>';
                        }
                        
                        html += '</div>';
                        
                        //must bind click events for navigation
                            
                        div.html(html);
                        
                        if(social_searchable == 'no'){
                            $('#friends_allow_btn').on('click', function(e){
                                e.preventDefault();
                                letFriendsFindMe();
                            });
                        }
                        
                        $('#followAllBtn').on('click', function(e){
                            e.preventDefault();
                            followAll(data.all_friend_ids);       
                        });
                        
                        $('#pagination-clean li').on('click', function(e){
                            e.preventDefault();
                            
                            var elem = $(this);
                            if(elem.hasClass('active'))
                                return false;
                            
                            var link = elem.find('a'); 
                            Load(link.attr('href'), 'socialContainer', 'json', loadFriends, [type, parseInt(link.text())]);
                               
                        });    
                        
                    }    
                           
                });
                
            });
            
        } else {
            div.html('<div class="infoMessage centered"><div class="innerMsgContainer">'+sprintf(TranslationLabels['no_%s_users_currently_available'], type.capitalize())+'</div></div>');
        }
        
    }
       
}

//Checks if mouse in rect(div)
function mouseInRect(mouse_x, mouse_y, x1, y1, x2, y2){

    return (mouse_x > x1)*(mouse_y > y1)*(mouse_x < x2)*(mouse_y < y2);

}

//Not used for now. Checks if two rects(divs) intersect
function intersectRect(r1, r2) {
    return !(r2.left > r1.right || 
            r2.right < r1.left || 
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
}

//Calculates distance between two poins given with their x,y coords
function lineDistance( point1, point2 ){
    var xs = 0;
    var ys = 0;
     
    xs = point2.x - point1.x;
    xs = xs * xs;
     
    ys = point2.y - point1.y;
    ys = ys * ys;
     
    return Math.sqrt( xs + ys );
}

//oauth request (social networks login) in popup jquery plugin
(function($){
    
    $.oauthpopup = function(options)
    {
        if (!options || !options.path) {
            throw new Error("options.path must not be empty");
        }
        options = $.extend({
            windowName: 'ConnectWithOAuth' // should not include space for IE
          , windowOptions: 'location=0,status=0,width=800,height=400'
          , callback: function(){ window.location.reload(); }
        }, options);

        var oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
        
        oauthWindow.focus();
        
        var oauthInterval = window.setInterval(function(){
            if (oauthWindow.closed) {
                window.clearInterval(oauthInterval);
                options.callback();
            }
        }, 1000);
    };
})(jQuery);

//Sting addon - capitalize
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
//Sting addon - trim
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
};

//This function is depricated. Adds borders to set item divs in set images on hover of items in right section 
function highlightItem(itemId, set){
    var popup = $('#productPopup_'+itemId);
    if(set){
        $('.item_'+itemId).addClass('hover');
        popup.show();
    } else {
        $('.item_'+itemId).removeClass('hover');
        popup.hide();
    }
}

function notify(type, text, afterClose) {
    var n = noty({
        text: text,
        type: type,
        dismissQueue: true,
        layout: 'topCenter',
        theme: 'defaultTheme',
        timeout: 3000, // delay for closing event. Set false for sticky notifications
        callback: {
            afterClose: afterClose 
        }        
    });
    
    return n;
}

function changeView(elem, url){
    var innerElem = $(elem).find('span');
        
    if(innerElem.hasClass('grid')){
        Redirect(url);    
    } else {
        Redirect(url+'?view=slideshow');   
    }
}

/* Functions for autocomplete in send message popup start */
/*$.ui.autocomplete.prototype._renderMenu = function( ul, items ) {
   var self = this;
   $.each( items, function( index, item ) {
      if (index < 10) // here we define how many results to show
         {self._renderItem( ul, item );}
      });
} */
function split( val ) {
    return val.split( /,\s*/ );
}
function extractLast( term ) {
    return split( term ).pop();
}
Object.values = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}
/* Functions for autocomplete in send message popup end */

function beforeLeave(set){
    if(set == true) {
        $(window).bind('beforeunload', function(){
            return TranslationLabels['are_you_sure_you_want_to_leave'];
        });
    } else {
        $(window).unbind('beforeunload');    
    }
}

function socialConnect(target, type){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    $.ajax({
        url     : target,
        type    : 'get',
        dataType: 'json',
        async   : false,  
        success : function(data){
            if(data.redirect){
                
                if(data.status == 1){
                    semafors['ajax'] = false;
                    notify('success', data.msg, function(){
                        window.focus(); window.location.href = window.location.pathname; 
                    });
                } else {
                
                    $.oauthpopup({
                        path: data.redirect,
                        callback: function(){
                            //ajax poll to check if user logged
                            $.ajax({
                                url     : '/activity/social?check_'+type+'=1',
                                type    : 'get',
                                dataType: 'json',  
                                success : function(data){
                                    if(data.status == 1){
                                        notify('success', TranslationLabels['account_connection_success'], function(){
                                            window.focus(); window.location.href = window.location.pathname;
                                        });    
                                    } else {
                                        notify('error', TranslationLabels['account_connection_failure']);
                                        return;    
                                    }
                                },
                                error   : function(e){
                                    semafors['ajax'] = false;
                                    notify('error', TranslationLabels['could_not_complete_request']);
                                }
                            });
                        }
                    });
                    semafors['ajax'] = false;
                    return;
                
                }
            } else {
                semafors['ajax'] = false;
                notify('success', data.msg);
            }                
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
}

//Load new social provider lists in sharing popup after stop or connect actions (ajax callback for Load function)
function refreshSharingLists(){
    
    var data = arguments[1], provider = arguments[0], liElem = $('#socialNetworks').find('.'+provider).parent();
    
    if(data.redirect){
                       
        $.oauthpopup({
            path: data.redirect,
            callback: function(){
                //ajax poll to check if user logged
                $.ajax({
                    url     : '/profile-settings/sharing?action=connect&oauth_provider='+provider+'&for_refresh=1',
                    type    : 'get',
                    dataType: 'json',  
                    success : function(data){
                        if(data.status == 1){
                            var info = data.msg;
                            addToSharingList(liElem, provider, info);
                            notify('success', TranslationLabels['account_connection_success']);    
                        } else {
                            notify('error', TranslationLabels['account_connection_failure']);
                            return;    
                        }
                    },
                    error   : function(e){
                        semafors['ajax'] = false;
                        notify('error', TranslationLabels['could_not_complete_request']);
                    }
                });
            }
        });
        semafors['ajax'] = false;
        return;
        
    } else {
        if(data.status){
            var info = data.msg;
            addToSharingList(liElem, provider, info);
            notify('success', TranslationLabels['account_added_for_sharing']);
        } else {
            semafors['ajax'] = false;
            notify('error', data.msg);
        }
    }
       
}

function addToSharingList(li, provider, info){
    
    li.fadeOut(200, function() {
        var list = $('#sharingList');
        if(list.length == 0){
            var html = '<h6>'+TranslationLabels['currently_sharing_to']+'</h6><ul id="sharingList" class="lineList cf"></ul>';
            $('#sharingContent').append(html);
            list = $('#sharingList');
        }
        liHtml = '<li id="'+provider+'"><a href="#" onclick="return false;"><img class="avatar" src="'+imgURL+'images/icons/'+provider+'.png" /></a>'+
                 '<div class="info"><span>'+provider.capitalize()+'</span>&nbsp;<a class="blue" '+((provider == 'twitter') ? 'href="http://twitter.com/'+info.screen_name+'"' : 'href="http://www.facebook.com/'+info.oauth_uid)+'">'+((info.username) ? info.username : TranslationLabels['not_available'])+'</a></div>'+
                 '<div class="action"><a href="#" class="blue">'+TranslationLabels['stop']+'</a></div></li>';
        $(liHtml).prependTo(list).fadeIn();
        li.remove();
        var networksList = $('#socialNetworks');
        if(networksList.find('li').length == 0)
            networksList.prev('h6').remove();
            
        $('#share_to_'+provider).removeAttr("disabled");
        
    });
               
}

function removeFromSharingList(elem){
    
    var li = $(elem).parent().parent();
    
    li.fadeOut(200, function() {
        var list = $('#socialNetworks');
        if(list.length == 0){
            var html = '<h6>'+TranslationLabels['start_quick_sharing_to']+'</h6><ul id="socialNetworks" class="actionGrid cf"></ul>';
            $('#sharingContent').prepend(html);
            list = $('#socialNetworks'); 
        }
        var provider = li.attr('id'); 
        $('<li><span class="largeIcon '+provider+'">'+provider.capitalize()+'</span></li>').prependTo(list).fadeIn();
        li.remove();
        var sharingList = $('#sharingList');
        if(sharingList.find('li').length == 0)
            sharingList.prev('h6').remove();
        
        $('#share_to_'+provider).attr("disabled",true);    
            
    });
    
}

//Add to collection functions start
function hideAddForm(){
    $('#CollectionAdd').hide(); 
    return false;    
}

function showAddForm(){
    $('#CollectionAdd').show();    
}

function hideCreateNew(obj){
    obj.addClass('hidden');    
}
//Add to collection functions end

function letFriendsFindMe(){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    return $.ajax({
        url     : '/activity/social?find_friends_allow=1',
        type    : 'get',
        dataType: 'json',  
        success : function(data){
            if(data.status == 1){
                social_searchable = 'yes';
                $('#friends_overlay').remove();    
                $('#friends_allow_btn').remove();    
            } else
                notify('error', TranslationLabels['could_not_complete_request']);
             
            semafors['ajax'] = false;
            return;
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
}

function followAll(friendIds, reloadPage){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    var postData = $.param({
        follow_ids : friendIds
    });
    
    return $.ajax({
        url     : '/activity/social?follow_all=1',
        type    : 'post',
        data    : postData,
        cache   : false,
        dataType: 'json',  
        success : function(data){
            if(data.status == 1){
                notify('success', data.msg, function(){
                    semafors['ajax'] = false;
                    if(reloadPage)
                        window.location.reload();
                });
                //Must reload friends list in popup here!!!        
            } else {
                semafors['ajax'] = false;
                notify('error', data.msg);
                return;
            }
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
}

function postForm(url, form, divId) {
    
    if(semafors['post'] == true)
        return;
        
    semafors['post'] = true;
    
    var submitBtn = $('#sendSubmit');
    
    submitBtn.children('span').html(submitBtn.find('input[name="inactive"]').val());
    
    $.when( SendAjax(url, form) ).done(
        function(x) {
            if(!x.status){
                submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                semafors['post'] = false;
                return false;
            } 
            $('#mask , #'+divId).fadeOut(300 , function() {
                $('#popupContainer').hide();
                $('#mask').hide();
                submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                semafors['post'] = false;
                if(divId == 'AddTags')
                    window.location.reload();    
            });
        }
    );
    
}

function removeFromRecommended(removeId, url){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    var params  = $.param({ skip_ids : [removeId] });
    
    return $.ajax({
        url     : url,
        type    : 'get',
        data    : params,
        cache   : false,
        dataType: 'json',  
        success : function(data){
            if(data.status == 1){
                notify('success', data.msg, function(){
                    semafors['ajax'] = false;
                    window.location.reload();
                });     
            } else {
                semafors['ajax'] = false;
                notify('error', data.msg);
                return;
            }
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
}

function searchAutocomplete(form, searchField, productSearch){
    
    searchField.keypress(function(e){
        if(e.keyCode == 13) {
            form.trigger('submit');
        }
    });
    
    form.on('submit', function(e){
            
        e.preventDefault();
        var target  = this.action;
        var query   = searchField.val();
            
        if(!query || query == '')
            return;
        
        target = target + query; 
            
        document.location.href = target;
        
    });
    
    if(productSearch){
        
        $.widget( "custom.catcomplete", $.ui.autocomplete, {
            _renderMenu: function( ul, items ) {
              var that = this,
                currentCategory = "";
              
              $.each( items, function( index, item ) {
                if ( item.category != currentCategory ) {
                  ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
                  currentCategory = item.category;
                }
                that._renderItemData( ul, item );
              });
            },
            _renderItem: function( ul, item ) {
                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( "<a>"+ item.formatted + "</a>" ) 
                    .appendTo( ul );
            }
        });
        
        searchField
          .bind( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {
              event.preventDefault();
            }
            $('#searchSectionSelect').parent().hide();
          })
          .catcomplete({
            source: function( request, response ) {
              $.getJSON( "/autocomplete", {
                query       : request.term,
                itemOrigin  : 'product'
              }, response );
            },
            focus: function() {
              return false;
            },
            select: function (a, b) {
                $(this).val(b.item.value);
                form.submit();
            },
            position: { my: "left top", at: "left bottom", of: "#searchBar", collision: "none"},
            appendTo: "#Navigation"
          });
      
    }
    
}

function productSearchAutocompleteUnbind(searchField){
    searchField.unbind("keydown").catcomplete( "destroy" );        
}

function setSearchType(selectedOption){
    
    var form        = $('#mainSearchForm'),
        searchField = form.find(':input'),
        label       = form.find('label'),
        link        = selectedOption.find('a'),
        searchType  = selectedOption.prop('title');
    
    form.prop('action', link.prop('href'));
    label.text(link.text()+':');
        
    if(searchType == 'product')
        searchAutocomplete(form, searchField, true);
    else {
        if(searchField.hasClass('ui-autocomplete-input'))
            productSearchAutocompleteUnbind(searchField);
        searchAutocomplete(form, searchField, false);
    }
    
    selectedOption.parent().parent().hide();
    searchField.focus();
    
}

function readURL(input) {

    if (input.files && input.files[0]){
        var reader = new FileReader();
        $("#loader").show();
        reader.onload = function (e){
            $("#loader").hide();
            var Icon = $('#Icon');
            Icon.find('img').attr('src', e.target.result);
            Icon.show();
        }

        reader.readAsDataURL(input.files[0]);
        
    }
}

function uploadResult(data, statusText)  {
    
    if (statusText == 'success') {
        if(data.status == 1) {
            notify('success', data.msg, function(){
                if(data.redirect)
                    Redirect(data.redirect);
            });    
        } else {
            notify('error', data.msg);    
        }
    } else {
        notify('error', TranslationLabels['unknown_error']);
    }
    
}

function postAddToCollectionForm(url, form, type, btn) {
    
    if(semafors['post'] == true)
        return;
        
    semafors['post'] = true;
    
    var submitBtn = $(btn);
    
    submitBtn.children('span').html(submitBtn.find('input[name="inactive"]').val());
    
    $.when( SendAjax(url, form) ).done(
        function(x) {
            if(type == 'add'){
                if(!x.status){
                    notify('error', x.msg);
                    semafors['post'] = false;
                    submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                } else {
                    $('#mask , #CollectionAdd').fadeOut(300 , function() {
                        $('#popupContainer').hide();
                        $('#mask').hide();
                        semafors['post'] = false;
                        submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                    });
                }
            } else if(type == 'create'){
                if(!x.status){
                    notify('error', x.msg);
                    semafors['post'] = false;
                    submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                } else {
                    $('#mask , #NewCollectionAdd').fadeOut(300 , function() {
                        $('#popupContainer').hide();
                        $('#mask').hide();
                        semafors['post'] = false;
                        submitBtn.children('span').html(submitBtn.find('input[name="active"]').val());
                    });
                }    
            }
        }
    );

}

function getElem(el, what) {
    var res = null;
    var $el    = jQuery(el);
    what    = what || 'all';
    
    if (el == undefined || !el)
        return res;
        
    switch (what) {
        case 'x':
        case 'y':
            try {
                res = $el.position();
            }
            catch (err) {
                res = null;
            };
            
            if (!res)
                return null;
            else if (what == 'x' && res.left != undefined)
                res = parseInt(res.left, 10);
            else if (what == 'y' && res.top != undefined)
                res = parseInt(res.top, 10);
            else
                res = 0;
            return res;
        break;
        
        case 'margin':
        case 'padding':
            res = {'top' : 0, 'right' : 0, 'bottom' : 0, 'left' : 0};
            jQuery.each(res, function(key, value) {
                if ($el.css(what + '-' + key) !== undefined)
                    res[key] = parseInt($el.css(what + '-' + key));
            });
            
            return res;
        break;
        
        case 'px':
        case 'py':
            try {
                res = $el.offset();
            }
            catch (err) {
                res = null;
            };
            if (!res)
                return null;
            else if (what == 'px' && res.left != undefined)
                res = parseInt(res.left, 10);
            else if (what == 'py' && res.top != undefined)
                res = parseInt(res.top, 10);
            else
                res = 0;
            return res;
        break;
                
        case 'w':
            try {
                res = ($el.innerWidth() || $el.width() || $el.css('width') || 0);
                res = parseInt(res);
            }
            catch (err) {
                res = null;
            };
            return res;
        break;
                
        case 'h':
            try {
                res = ($el.innerHeight() || $el.height() || $el.css('height') || 0);
                res = parseInt(res);
            }
            catch (err) {
                res = null;
            };
            return res;
        break;
            
        case 'all':
            res          = {};
            var props    = ['x', 'y', 'px', 'py', 'w', 'h', 'margin', 'padding'];
            jQuery.each(props, function(key, value) {
                res[value] = getElem(el, value);
            });
            return res;
        break;
    }
    return res;
}

function colorPickerSubmit() {
    
    var form = $('#createSearchForm');
    var url = form.attr('action');
    
    var input = arguments[0];
    var addon = input.val();    
    
    var contentDiv  = $(this).closest('.tab_content');
    var postData    = contentDiv.find('form').serialize();

    $('#Create').myTabs({'load' : url+'?color='+addon, post: postData});
    
}

function removeTag(url, $elem){
    
    $.when( SendAjax(url) ).done(
        function(x) {
             $elem.remove();
        }
    );
    
}

function showAddTags(){
    
    if($('#mask').length == 0)
        $('body').append('<div id="mask"></div>');   
    $('#mask').fadeIn(300,function(){
        $('#AddTags').show();
    }).off('click').on('click', function(){
        $('#mask , #AddTags').fadeOut(300 , function() {
            $('#popupContainer').hide();
            $('#mask').hide();
        }); 
        return false;
    });
     
}

function socialShare(target, type){
    
    if(semafors['ajax'] == true)
        return;
        
    semafors['ajax'] = true;
    
    $.ajax({
        url     : target,
        type    : 'get',
        dataType: 'json',
        async   : false,  
        success : function(data){
            
            if(data.redirect){
                
                $.oauthpopup({
                    path: data.redirect,
                    callback: function(){
                        //ajax poll to check if user logged
                        $.ajax({
                            url     : '/activity/social?check_'+type+'=1',
                            type    : 'get',
                            dataType: 'json',  
                            success : function(data){
                                if(data.status == 1){
                                    socialShare(target, type);        
                                } else {
                                    notify('error', TranslationLabels['share_failure']);
                                    
                                    if(data.login_required)
                                        loadAjaxBox('/register');
                                    
                                    return;    
                                }
                            },
                            error   : function(e){
                                semafors['ajax'] = false;
                                notify('error', TranslationLabels['could_not_complete_request']);
                            }
                        });
                    }
                });
                semafors['ajax'] = false;
                return;
                
                
            } else {
                
                semafors['ajax'] = false;
                
                if(data.status == 1)
                    notify('success', data.msg);
                else {
                    notify('error', TranslationLabels['could_not_complete_request']);
                
                    if(data.login_required)
                        loadAjaxBox('/register');
                
                    return;
            
                }
            }                
        },
        error   : function(e){
            semafors['ajax'] = false;
            notify('error', TranslationLabels['could_not_complete_request']);
        }
    });
    
}

function getElem(el, what) {
    var res = null;
    
    if (el[0] != undefined)
        el = el[0];
    
    var $el = $(el);
    
    if (what == undefined)
        var what = 'all';
    
    if (el == undefined || !el)
        return res;
        
    switch (what) {
        case 'x':
        case 'y':
            try {
                res = $el.position();
            }
            catch (err) {
                res = null;
            };
            
            if (!res)
                return null;
            else if (what == 'x' && res.left != undefined)
                res = parseInt(res.left, 10);
            else if (what == 'y' && res.top != undefined)
                res = parseInt(res.top, 10);
            else
                res = 0;
            return res;
        break;
        
        case 'margin':
        case 'padding':
            res = {'top' : 0, 'right' : 0, 'bottom' : 0, 'left' : 0};
            $.each(res, function(key, value) {
                if ($el.css(what + '-' + key) !== undefined)
                    res[key] = parseInt($el.css(what + '-' + key));
            });
            
            return res;
        break;
        
        case 'px':
        case 'py':
            try {
                res = $el.offset();
            }
            catch (err) {
                res = null;
            };
            if (!res)
                return null;
            else if (what == 'px' && res.left != undefined)
                res = parseInt(res.left, 10);
            else if (what == 'py' && res.top != undefined)
                res = parseInt(res.top, 10);
            else
                res = 0;
            return res;
        break;
                
        case 'w':
            try {
                res = (parseInt($el.innerWidth()) || parseInt($el.width()) || parseInt($el.css('width')) || parseInt(el.clientWidth) || 0);
            }
            catch (err) {
                res = null;
            };
            return res;
        break;
                
        case 'h':
            try {
                res = (parseInt($el.innerHeight()) || parseInt($el.height()) || parseInt($el.css('height')) || parseInt(el.clientHeight) || 0);                
            }
            catch (err) {
                res = null;
            };
            return res;
        break;
            
        case 'all':
            res            = {};
            var props    = ['x', 'y', 'px', 'py', 'w', 'h', 'margin', 'padding'];
            $.each(props, function(key, value) {
                res[value] = getElem(el, value);
            });
            
            return res;
        break;
    }
    return res;
}

function simpleTabs(tabId, tabContainerClass) {
    
    var tab = $('#'+tabId);
    var tabContent = $('#'+tabId+'Tab');
    
    if(tabContent.css('display') != 'none')
        return;
    else {
        $('.'+tabContainerClass+' a.active').removeClass('active');
        $('.tabs').hide(); 
        tab.addClass('active');
        tabContent.show();
    }    
    
}

function fixHeights() {
    var $aboutWrapper = $('#aboutWrapper');
    if ($aboutWrapper.length > 0) {
        var winH = $(window).height();
        
        var aboutWrapperH = $aboutWrapper.outerHeight();
        if (aboutWrapperH < winH)
            aboutWrapperH = winH;
            
        $aboutWrapper.css('height', aboutWrapperH + 'px');
        
        $aboutWrapper.children().each(function(k) {
            $(this).css('min-height', aboutWrapperH + 'px');
        });
    }
};

function showConfirmBox(){
    showPopup($('#confirmBlock'), false, true);
}
function hideConfirmBox(){
    $('#mask').click();
}

$.loadImage = function(url) {
  // Define a "worker" function that should eventually resolve or reject the deferred object.
  var loadImage = function(deferred) {
    var image = new Image();
     
    // Set up event handlers to know when the image has loaded
    // or fails to load due to an error or abort.
    image.onload = loaded;
    image.onerror = errored; // URL returns 404, etc
    image.onabort = errored; // IE may call this if user clicks "Stop"
     
    // Setting the src property begins loading the image.
    image.src = url;
     
    function loaded() {
      unbindEvents();
      // Calling resolve means the image loaded sucessfully and is ready to use.
      deferred.resolve(image);
    }
    function errored() {
      unbindEvents();
      // Calling reject means we failed to load the image (e.g. 404, server offline, etc).
      deferred.reject(image);
    }
    function unbindEvents() {
      // Ensures the event callbacks only get called once.
      image.onload = null;
      image.onerror = null;
      image.onabort = null;
    }
  };
   
  // Create the deferred object that will contain the loaded image.
  // We don't want callers to have access to the resolve() and reject() methods, 
  // so convert to "read-only" by calling `promise()`.
  return $.Deferred(loadImage).promise();
};

function createTagsAutocomplete(tags, searchTagsUrl, appendTo, width, height){
    
    width   = (width) ? width+'px' : '334px'; 
    height  = (height) ? height+'px' : '100px';
    
    tags
        .tagsInput({
            'autocomplete_url': searchTagsUrl,
            'autocomplete': {
                appendTo: appendTo,
                source: function( request, response ) {
                    var term = extractLast( request.term ).trim();
                    if ( term in $.staticVars.cache ) {
                        response( $.staticVars.cache[ term ] );
                        return;
                    }
                    $.getJSON( searchTagsUrl, {'term': term}, function( data, status, xhr ) {
                        $.staticVars.cache[ term ]  = data;
                        response( data );
                    });
                },
                search: function() {
                    // custom minLength
                    var term = extractLast( this.value ).trim();
                    
                    if ( term.length < 2 ) {
                        return false;
                    }
                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function( event, ui ) {
                    ui.item.value = ui.item.value.trim();
                    return false;
                 }
            },
            'onAddTag': function(){
                if($.staticVars.ignoreFurtherTags){
                    var term = extractLast( tags.val() ).trim();
                    $(this).removeTag(term);
                }
                
                var terms = split( tags.val() );
                    
                if(terms.length >= $.staticVars.tagsLimit){
                    terms = terms.slice(0, terms.length);
                    tags.val(terms.join(","));
                    $.staticVars.ignoreFurtherTags = true;
                    notify('error', sprintf(TranslationLabels['you_cannot_add_more_than_%d_tags_to_one_creation'], ($.staticVars.tagsLimit)));
                    return false;
                }
                        
            },
            'height'                : height,
            'width'                 : width,
            'interactive'           : true,
            'defaultText'           : TranslationLabels['add_a_tag'],
            'removeWithBackspace'   : true,
            'minChars'              : 0,
            'maxChars'              : 0,
            'placeholderColor'      : '#666666'
        });
        
}