(function($) {

    $.fn.infinite = function(options, property) {
        return this.each(function() {
            (new $.infinite(this, options));
        });
    };
    
    $.infinite = function(el, options) {
        
        var base            = this;
        base.$el            = $(el);
        base.lastScrollTop  = 0;
         
        base.options    = $.extend(true, {}, $.infinite.defaultOptions, options);
        base.semaphore  = false;
     
        base.init  = function(){
            
            base.$el.scroll(function(){
                
                var wintop = $(window).scrollTop();
                
                if (wintop >= base.lastScrollTop){
                    var docheight = $(document).height(), winheight = window.innerHeight ? window.innerHeight : $(window).height();
                    if(wintop >= docheight-winheight-base.options.scrollTrigger){
                        base.options.callback();
                        base.lastScrollTop = docheight;
                    }       
                }
                
                if(base.lastScrollTop != docheight)
                    base.lastScrollTop = wintop;
                    
            });
            
        }
        
        base.init();
        
    }
    
    $.infinite.defaultOptions = {
        callback        : null,
        scrollTrigger   : 500
    };
    
              
})(jQuery);
