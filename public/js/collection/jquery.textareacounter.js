(function($) {
    
    var elCounter = 0;
    
    $.textAreaCounter = function(el, options) {
        
        var base    = this;
        base.$el    = $(el);
        base.$body  = $('body');
        
        var maxlen  = base.$el.attr('maxlength');
        
        if(!maxlen)
            return;
        
        base.destroy = function(){
            $('#textareacounter_'+base.$el.data('textareacounter')).remove();
            base.$el.unbind('keydown keyup');
        }
        
        if(options == 'destroy'){
            base.destroy();
            return;
        }
        
        base.init = function() {
            
            base.options = $.extend({},$.textAreaCounter.defaultOptions, options);
            
            if(!base.$el.data('textareacounter')){
                elCounter++;
                base.$el.data('textareacounter', elCounter);
            }
            
            var elId = 'textareacounter_'+elCounter;
            
            if($('#'+elId).length > 0)
                return;
            
            base.$counter = $('<div id="'+elId+'" class="ui-textarea-counter">'+(maxlen - base.$el.val().length)+'</div>').hide();
            
            var elpos   = base.$el.offset();
            
            base.$counter.appendTo('body');
            
            var top     = elpos.top - base.$counter.outerHeight();
            var left    = elpos.left;
            
            base.$counter.css({
                top: top + 'px',
                left: left + 'px'
            });

            base.$el.on('keydown keyup', function(){
                base.$counter.html(maxlen-base.$el.val().length);
            });
            
            base.$counter.show();
            
        };
        
        base.init();
        
    };
    
    $.textAreaCounter.defaultOptions = {
        
    };
    
    $.fn.textAreaCounter = function(options) {
        $(this).on('focusin', options.selector, function(e){
            new $.textAreaCounter(this, options);
        });
        $(this).on('focusout', options.selector, function(e){
            new $.textAreaCounter(this, 'destroy');
        });
    };
    
})(jQuery);