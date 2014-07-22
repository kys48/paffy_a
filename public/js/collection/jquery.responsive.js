(function($) {

    $.responsive = function(el, options) {
        
        var base        = this; 
        base.$el        = $(el);
        base.central    = base.$el.hasClass('responsiveCenter');
        
        base.init = function() {
        
            base.options = $.extend({},$.myTabs.defaultOptions, options);
            
            base.$el.css({
                'margin-left': 'auto',
                'margin-right': 'auto'
            });
            
            base.calc();
            
            $(window).on('resize', base.calc);
            
        };
        
        base.calc = function() {
            
            var elWidth         = base.$el.children().first().outerWidth(true);
            var bodyWidth       = $('body').width();       
                       
            var elementFitting  = parseInt(bodyWidth / elWidth);
            
            if(base.central){
                var elements    = base.$el.children().length;
                elementFitting  = Math.min(elementFitting, elements);
            }

            base.$el.width(elWidth * elementFitting);
        
        }        
        
        base.init();
    };
    
    $.responsive.defaultOptions = {};
    
    $.fn.responsive = function(options) {
        return this.each(function() {
            (new $.responsive(this, options));
        });
    };
    
})(jQuery);