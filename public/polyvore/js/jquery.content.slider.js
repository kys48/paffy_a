(function($) {

$.myContentSlider = function(el, options) {    

    var base    = this;
    
    base.playing    = false;
    base.current    = 1;
    base.timer      = null;
    
    base.init   = function() {
        
        base.$el            = $(el);
        base.$nav           = base.$el.find('.sliderNav');
        base.$holder        = base.$el.find('.slideHolder');
        base.$holderParent  = base.$holder.parent();
        base.$play          = base.$nav.find('.play');
        base.$next          = base.$nav.find('.next');
        base.$prev          = base.$nav.find('.prev');
        
        base.elements       = base.$holder.children().length;
        base.elementWidth   = base.$holder.children().first().outerWidth(true);
        
        base.$play.find('.stop').hide();
        
        base.calcHeight();
        
        base.$holder.css({
            width: base.elements * base.elementWidth + 'px',
            position: 'absolute',
            display: 'block'
        });
                
        base.options = $.extend({}, $.myContentSlider.defaultOptions, options);

        base.height = base.options.height;
        base.width  = base.options.width;
        base.tabs   = base.options.tabs;
    
        base.binds();
    
    };
    
    base.calcHeight = function(){
        base.$holderParent.height(base.$holder.children().eq(base.current-1).outerHeight());
    }
    
    base.binds = function() {
        base.$play.on('click', function(e){e.preventDefault(); base.play()});
        base.$next.on('click', function(e){e.preventDefault(); base.next()});
        base.$prev.on('click', function(e){e.preventDefault(); base.prev()});
    }
    
    base.play = function(e) {
        if(base.playing == false){
            base.$play.find('.stop').show();
            base.$play.find('.start').hide();
            base.playing    = true;
            base.timer      = setInterval(base.next, base.options.delay);
        }else{
            base.$play.find('.stop').hide();
            base.$play.find('.start').show();
            base.playing    = false;
            clearInterval(base.timer);
        }
    }
    
    base.next = function() {
        base.animate('right');
    }
    
    base.prev = function() {
        base.animate('left');
    }
    
    base.animate = function(direction){
        
        if(base.playing){
            clearInterval(base.timer);
            base.timer = setInterval(base.next, base.options.delay)
        }
        
        if(direction == 'right'){
            base.current++;
            if(base.current > base.elements)
                base.current = 1;
        }else{
            base.current--;
            if(base.current < 1)
                base.current = base.elements;
        }
        
        base.calcHeight();
        
        base.$holder.finish().animate({left : - ((base.current-1) * base.elementWidth) + 'px'}, base.options.speed);
        
    }
    
    base.init();
};

$.myContentSlider.defaultOptions = {
    "delay": 3000,
    "speed": 350
};

$.fn.myContentSlider = function(options) {
    return this.each(function() {
        (new $.myContentSlider(this, options));
    });
};

})(jQuery);