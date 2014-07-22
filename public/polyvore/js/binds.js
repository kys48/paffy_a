
var $document = $(document);
    
$(window).load(function(){     
    
    $('.fixedTop').each(function(){
        
        var $el         = $(this);
        var elTop       = $el.position().top + parseInt($el.css('marginTop'));
        var elBottom    = false;
        
        $('.fixedTop').not($el).each(function(){
            
            var $subel = $(this);
            var subelTop = $subel.position().top + parseInt($subel.css('marginTop'));
            
            if(subelTop > elTop){
                if(elBottom == false)
                    elBottom = subelTop - $el.outerHeight();
                else
                    elBottom = Math.min(elBottom, subelTop - $el.outerHeight());
            }

        });
        
        var $wrap = $('<div class="fixedTopWrapper"></div>').append('<span>');
        
        $wrap.css({
            'display': 'block',
            'width': '100%',
            'height': $el.outerHeight(true) + 'px',
            'padding-top': $el.css('marginTop'),
            'box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            '-webkit-box-sizing': 'border-box'
        });
        
        $el.css({'position' : 'absolute', 'top' : elTop, 'margin-top' : 0});
        
        $el.wrap($wrap);
        
        $document.on('scroll', function() { 
         
            var offset = $document.scrollTop();

            if (offset >= elTop){
                if(elBottom != false && offset > elBottom){
                    if($el.css('position') != 'absolute')
                        $el.css({'position' : 'absolute', 'top' : elBottom});
                }else{
                    if($el.css('position') != 'fixed')
                        $el.css({'position' : 'fixed', 'top' : 0 - parseInt($el.css("marginTop"))});
                }
            }else{
                if($el.css('position') != 'absolute')
                    $el.css({'position' : 'absolute', 'top' : elTop});
            } 

        });
        
    });
    
});

$(function(){
    
    var timeouts = new Array();
    
    $('textarea').autosize();
    
    $('.responsive').responsive();
    
    $('select.medium').selectbox({
        speed: 200,
        effect: 'slide'
    });
    
    $('select.big').selectbox({
        speed: 200,
        effect: 'slide',
        classHolder: 'sbHolderBig'
    });
    
    $('select.full').selectbox({
        speed: 200,
        effect: 'slide',
        classHolder: 'sbHolderFull'
    });
    
    $('select.s200').selectbox({
        speed: 200,
        effect: 'slide',
        classHolder: 'sbHolder200'
    });
    
    $('.menuIcon').on('click', function(e){
        e.preventDefault();
        
        var $leftMenu = $('#LeftMenu');
        var $leftMenuTop = $leftMenu.find('.top');
        
        var menuWidth = $leftMenu.outerWidth(true);
        
        if($('.menuIcon.active').length > 0) {
            $leftMenuTop.hide();
            $leftMenu.stop().animate({
                left: '-'+menuWidth+5
            }, 150, 'swing');
            
            $('.menuIcon').removeClass('active');
            
        } else {
            $leftMenu.stop().animate({
                left: 0
            }, 150, 'swing', function(){
                $leftMenuTop.show();
            });
            
            $('.menuIcon').addClass('active');
            
        }
    });
    
    $document.on('click', '.like', function(e){
        e.preventDefault();
        
        var data = $(this).find('input[name="data"]').val();
        var arrayData = data.split(',');
        
        var itemId  = arrayData[0];
        var type    = arrayData[1];
        
        like(itemId, type);
                                
    });
    
    
    var searchSectionSelect = $('#searchSectionSelect'),  
        searchDropdown      = searchSectionSelect.parent();  
    
    if(searchSectionSelect.length > 0){
    
        var selectedOption = searchSectionSelect.find('li.selected');
        
        searchSectionSelect.find('li > a').on('click', function(e){
            e.preventDefault();
        });
        
        $("#searchBar > form > :not(input)").on('click', function() {
            searchDropdown.toggle();
        });
        
        searchDropdown.on('mouseleave', function(){
            $(this).hide();    
        });
        
        setSearchType(selectedOption);
        
        searchSectionSelect.on('click', 'li', function(e){
            
            var prevSelOption    = searchSectionSelect.find('li.selected');
            var currentSelOption = $(this);
            
            prevSelOption.removeClass('selected');
            currentSelOption.addClass('selected');
            
            setSearchType(currentSelOption);
              
        });
    
    }
    
    $("input[type='radio'].styled").each(function(k) {
        var $input      = $(this);
        
        var $label      = $input.next();
        
        var $wrapper    = $("<div class='wrapper-styledRadio'></div>");
         
        $input.wrap($wrapper);
        
        $wrapper        = $input.parent();
        
        if ($input.prop('checked'))
            $wrapper.addClass('active');    
        
        $wrapper.on('click', function(e) {
            var $self   = $(this);
            var $input  = $(this).find('input');
            var inputGroupName = $input.prop('name');
            
            if (!$self.hasClass('active')) {
                var $inputGroup = $("input[name='" + inputGroupName + "']");
                $inputGroup.each(function(k) {
                    $(this).prop('checked', false);
                    $(this).closest('.wrapper-styledRadio').removeClass('active');
                });
                
                $self.addClass('active');
                $input.prop('checked', true);
            }
        });
        
        if ($label.is('label')) {
            $label.hover(
                function() {$wrapper.addClass('hovered');},
                function() {$wrapper.removeClass('hovered');}
            );
        }
    });
    
    $("input[type='checkbox'].styled").each(function(k) {
        var $input      = $(this);
        var $label      = $input.next();
        
        var $wrapper    = $("<div class='wrapper-styledCheckbox'></div>");
        var $checkMark  = $("<div class='checkMark'></div>");
        
        $input.wrap($wrapper);
        
        $wrapper        = $input.parent();
        
        $wrapper.append($checkMark);
        
        if ($input.prop('checked'))
            $wrapper.addClass('active');    
        
        $wrapper.on('click', function(e) {
            var $self   = $(this);
            var $input  = $(this).find('input');
            
            if (!$self.hasClass('active')) {
                $self.addClass('active');
                $input.prop('checked', true);
            }
            else {
                $self.removeClass('active');
                $input.prop('checked', false);
            }
        });
        
        if ($label.is('label')) {
            $label.hover(
                function() {$wrapper.addClass('hovered');},
                function() {$wrapper.removeClass('hovered');}
            );
        }
    });
    
    $('input[type=checkbox].onoff').each(function(k) {
        
        var $input      = $(this);
        var $label      = $input.next();
            
        var $wrapper    = $("<div class='wrapper-styledOnoff'></div>");
        var $thumb      = $("<div class='thumb'></div>");
        var $status     = $("<div class='status'></div>");
        
        var stateOn = {
            'textStatus'    : 'on',
            'posStatus'     : 17,
            'posThumb'      : 54
        };
        
        var stateOff = {
            'textStatus'    : 'off',
            'posStatus'     : 35,
            'posThumb'      : 6
        };
        
        if ($input.prop('checked')) {
             $wrapper.addClass('active');
             $status.html(stateOn.textStatus).css('left', stateOn.posStatus);
             $thumb.css('left', stateOn.posThumb);
        }
        else {
            $wrapper.removeClass('active');
            $status.html(stateOff.textStatus).css('left', stateOff.posStatus);
            $thumb.css('left', stateOff.posThumb);
        }
        
        $input.wrap($wrapper);
        
        $wrapper            = $input.parent();
        
        $wrapper.append($thumb);
        $wrapper.append($status);
        
        $wrapper.on('click', function(e) {
            $(this).find('input').click();
        });
        
        $wrapper.on('toggle', function(e) {
            var $self       = $(this);
            var $thumb      = $self.find('.thumb');
            var $status     = $self.find('.status');
            var state;
            
            if ($self.find('input').prop('checked')) {
                $self.addClass('active');
                state       = stateOn;
            }
            else {
                $self.removeClass('active');
                state       = stateOff;
            };
            
            $thumb.stop().animate({
                'left': state.posThumb + 'px'
            }, 300, 'easeOutCubic');
           
            $status.html(state.textStatus).css({
                'left': state.posStatus + 'px'
            });
            
        });
        
        $input.on('change', function(){
            $(this).closest('.wrapper-styledOnoff').trigger('toggle');
        });
        
        if ($label.is('label')) {
            $label.hover(
                function() {$wrapper.addClass('hovered');},
                function() {$wrapper.removeClass('hovered');}
            );
        }
    });
    
    
    $('input[name=icon]').on('change', function(){
        if(ie) return;
        readURL(this);
    });
    
    $(".trunc").trunc(25);
    
    $('#about-link').click(function(e){
        e.preventDefault();
        loadAbout();
    });
    
    $('a.find-friends-window').on('click', function(e) {
        e.preventDefault();
        loadAjaxBox('/activity/social?show_friends=1', false, false, '', true);    
    });
    
    $document.on('click', '.comment', function(e){
        e.preventDefault();
        
        var data = $(this).find('input[name="data"]').val();
        var arrayData = data.split(',');
        var itemId  = arrayData[0];
        var type    = arrayData[1];

        toggleCommentBox(itemId, type, $(this));                  
    });
    
    $document.on('click', '.commentBox .cancel', function(e){
        e.preventDefault();
        $(this).closest('.commentBox').hide();
        if($('.collectionImage.items').length > 0){
            //Reinitialization of set items info and popups position
            $('.collectionImage.items').setItemsHighlighter('adjustPositions');
        }
    });
    
    $document.on('click', '.commentBox .post', function(e){
        e.preventDefault();
        
        var $Comment = $(this).closest('.commentBox');
        
        var data = $Comment.attr('id');
        var arrayData = data.split('_');
        var itemId  = arrayData[1];
        var type    = arrayData[2];
        
        var comment = $Comment.find('textarea[name="comment"]').val();
        
        postComment(itemId, type, comment, $Comment);
    });
    
    $document.on('click', '.commentForm .post', function(e){

        e.preventDefault();
        
        var $Comment = $(this).closest('.commentForm');
        
        var data = $Comment.attr('id');
        var arrayData = data.split('_');
        var itemId  = arrayData[1];
        var type    = arrayData[2];
        
        var comment = $Comment.find('textarea[name="comment"]').val();
        
        postComment(itemId, type, comment, $Comment, true);
    });
    
    $document.on('click', '.follow', function(e){
        e.preventDefault();
        if($(this).hasClass('disabled'))
            return;
        follow($(this).find('input[name="data"]').val());                  
    });
    
    $document.ajaxSend(function(event, xhr, settings) {
        if($('#loading').length == 0)
            $('body').append('<div id="loading">'+TranslationLabels['loading']+'...</div>');
    });
    
    $document.ajaxComplete(function(event, xhr, settings){
        if($.active <= 1)
            $('#loading').remove();
    });
    
    $('input').on('focus', function(){
        var input = $(this);
        if(input.hasClass("unvalidated"))
            input.removeClass("unvalidated");    
    });
    
    // When clicking on the button close or the mask layer the popup closed
    $document.on("click", "a.close, a.cancel, #mask", function(){
        $('.login-popup.active').hide().removeClass('active');
        var composeEmail = $('#ComposeEmail'),
            addTags      = $('#AddTags');
        if(composeEmail.length > 0)
            composeEmail.hide();
        if(addTags.length > 0)
            addTags.hide();
        $('#mask').unbind('click').fadeOut(300);
        return false;
    });
    
    $('#top-link').topLink({
        min: 400,
        fadeSpeed: 500
    });
    //smoothscroll
    $('#top-link').click(function(e) {
        e.preventDefault();
        $.scrollTo(0,300);
    });
    
    $('.colorPicker').colourPicker({
        ico     : imgURL+'images/selectArrow.png', 
        title   : false
    });
    
    $document.on('mouseover', '.tickToggle', function(e) {
        
        var $toggle         = $(this);
        
        clearTimeout(timeouts['tickToggle']);
        
        if ($toggle.hasClass('active'))
            return;
        
        if ($toggle.hasClass('showing')){
            $toggle.addClass('active');
            return;
        }
        
        $toggle.addClass('active');
        $toggle.addClass('showing');
        
        $('.tickToggle.showing').not($toggle).each(function(){
            $(this).removeClass('showing').children('.tickWrapper').hide();
        });
            
        var $wrapper        = $toggle.children('.tickWrapper');
        
        var $ticker     = $wrapper.children('i');
        
        if($ticker.length == 0)
            $ticker= $('<i>').appendTo($wrapper);

        var width   = $toggle.outerWidth();
        var height  = $toggle.outerHeight();
        
        var wrapperWidth    = $wrapper.outerWidth();
        var wrapperHeight   = $wrapper.outerHeight();
        
        var tickerWidth = $ticker.outerWidth();
        var tickerHeight = $ticker.outerHeight();
        
        if($wrapper.hasClass('LT') || $wrapper.hasClass('RT')){
            $ticker.css('top', (height - tickerHeight)/2);
            $wrapper.css('top', 0);
        }else if($wrapper.hasClass('LB') || $wrapper.hasClass('RB')){
            $ticker.css('bottom', (height - tickerHeight)/2);
            $wrapper.css('bottom', 0);
        }else if($wrapper.hasClass('BL') || $wrapper.hasClass('TL')){
            $ticker.css('left', (width - tickerWidth)/2);
            $wrapper.css('left', 0);
        }else if($wrapper.hasClass('BR') || $wrapper.hasClass('TR')){
            $ticker.css('right', (width - tickerWidth)/2);
            $wrapper.css('right', 0);
        }
        
        if($wrapper.hasClass('TL') || $wrapper.hasClass('TR')){
            $wrapper.css('top', height);
        }else if($wrapper.hasClass('BL') || $wrapper.hasClass('BR')){
            $wrapper.css('top', 0 - wrapperHeight);
        }else if($wrapper.hasClass('LT') || $wrapper.hasClass('LB')){
            $wrapper.css('left', width);
        }else if($wrapper.hasClass('RT') || $wrapper.hasClass('RB')){
            $wrapper.css('right', 0);
        }
        
        $wrapper.show();
        
    });
    
    $document.on('mouseleave', '.tickToggle', function(e) {
        
        var $toggle     = $(this);
        var $wrapper    = $toggle.find('.tickWrapper');

        $toggle.removeClass('active');
        
        timeouts['tickToggle'] = setTimeout( function(){
            $toggle.removeClass('showing');
            $wrapper.hide();
        }, 300);
        
    });
    
    $document.on('resize', function(e) {
         fixHeights();
         $('.login-popup.active').each(function(){
             var $popup = $(this);
             if($popup.prop('id') == 'Crop')
                return false; 
             var pos    = getCenterPopupPosition($popup);
             if(pos.left > 0 && pos.top > 0)
                $popup.offset({ top: pos.top, left: pos.left });
         });
    });
    
    $document.textAreaCounter({selector: 'textarea'});
    
    $(window).load(function(e) {
         fixHeights();
         var searchInput = $('input[name="search"]');
         if(searchInput.length > 0)
            searchInput.blur();
    });
    
    $('a.smoothScroll').on('click', function(e){
        e.preventDefault();
        $.scrollTo($(this).attr('href'), 300);
    });
    
    $( '.scrollable' ).bind( 'mousewheel DOMMouseScroll', function (e) {
        var el      = $(this);
        var delta   = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        
        el.scrollTo( ( delta < 0 ? '+' : '-' )+'=30px' );
        
        e.preventDefault();
    });
    
});