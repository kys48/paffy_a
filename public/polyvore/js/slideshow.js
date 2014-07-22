(function($) {

    $.fn.slideshow = function(options, property) {
        return this.each(function() {
            (new $.slideshow(this, options));
        });
    };
    
    $.slideshow = function(el, options) {
        
        var base            = this;
        base.$el            = $(el);

        base.options    = $.extend(true, {}, $.slideshow.defaultOptions, options);
        base.semaphore  = false;
        
        base.$slides    = base.$el.find(base.options.slides);
        base.$pages     = base.$el.find(base.options.pages);
        
        base.init  = function(){
            
            base.$slides.find('li:eq('+base.options.active+')').addClass('active');
            base.$pages.find('li:eq('+base.options.active+')').addClass('active');
            
            base.startInterval();
            base.binds();
            
        }
        
        base.binds = function(){
            
            base.$pages.on('click','a',function(e){
                
                e.preventDefault();
                
                if(base.semaphore)
                    return;

                base.semaphore = true;  

                var element     = $(this).parent();

                if(element.hasClass('active'))
                    return;
                
                base.options.active = element.index();

                base.$pages.find('li.active').removeClass('active');
                
                element.addClass('active');

                base.$slides.find('li.active').fadeOut('normal', function(){
                    $(this).removeClass('active');
                    base.$slides.find('li:eq('+element.index()+')').fadeIn('normal', function(){
                        $(this).addClass('active');
                        base.semaphore = false;
                    });
                });
                
            });
            
            base.$el.on('mouseenter', function(){
                clearInterval(base.interval);
            });
            
            base.$el.on('mouseleave', function(){
                base.startInterval();
            })
            
        }
        
        base.startInterval = function(){
            
            base.interval = setInterval(function(){
                
                base.$pages.find('li.active').removeClass('active');
                
                base.options.active = base.options.active + 1;
                
                if(base.options.active + 1 > base.$slides.find('li').length)
                    base.options.active = 0;
                
                base.$pages.find('li:eq('+base.options.active+')').addClass('active');
                
                base.$slides.find('li.active').fadeOut('normal', function(){
                    $(this).removeClass('active');
                    base.$slides.find('li:eq('+base.options.active+')').fadeIn('normal', function(){
                        $(this).addClass('active');
                        base.semaphore = false;
                    });
                });
                
                
                
            }, base.options.time * 1000);
        }
        
        base.init();
        
    }
    
    $.slideshow.defaultOptions = { 
        slides  : '.slideshowImages',
        pages   : '.pages',
        active  : 0,
        time    : 5
    };
    
              
})(jQuery);
