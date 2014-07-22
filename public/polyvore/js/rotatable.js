(function($) {

    $.fn.rotatable = function(options, property) {
        return this.each(function() {
            (new $.rotatable(this, options));
        });
    };
    
    $.rotatable = function(el, options) {
        
        var base            = this;
        base.$el            = $(el);
        
        if(options == 'destroy'){
            base.$el.find('.ui-rotatable-handle').unbind('mousedown').remove();
            return;
        }
        
        base.setRotate = function(degree){
            
            base.$el.css('-moz-transform', 'rotate(' + degree + 'deg)');
            base.$el.css('-moz-transform-origin', '50% 50%');
            base.$el.css('-webkit-transform', 'rotate(' + degree + 'deg)');
            base.$el.css('-webkit-transform-origin', '50% 50%');
            base.$el.css('-o-transform', 'rotate(' + degree + 'deg)');
            base.$el.css('-o-transform-origin', '50% 50%');
            base.$el.css('-ms-transform', 'rotate(' + degree + 'deg)');
            base.$el.css('-ms-transform-origin', '50% 50%');
            
            base.$el.data('rotate', degree);
            
        }
        
        if(typeof(options) == 'number'){
            base.setRotate(options);
            return;
        }
        
        base.options        = $.extend(true, {}, $.rotatable.defaultOptions, options);
        base.$parent        = base.$el.parent();
        base.parentPos      = base.$parent.offset();
        base.rotatePoint;
        base.start  = {};
        base.rotate = {};
        base.center = {};
        base.degree = 0;
        base.degreeStart = 0;
        
        base.init  = function(){
            
            base.rotatePoint = $('<div>').addClass('ui-rotatable-handle');
            
            base.rotatePoint.appendTo(base.$el);
            
            base.$el.addClass('ui-rotatable');
            
            base.rotatePoint.on('mousedown', base.setBasePoints); 
            
            
        }
        
        base.setBasePoints = function(e){
            base.dragging = true;
            base.$el.draggable('disable');
            base.degreeStart = base.$el.data('rotate');
            
            if(!base.degreeStart)
                base.degreeStart = 0;
            $(document).on('mousemove.drag', base.calculate);
            $(document).on('mouseup.drag', base.release);
        }
        
        base.release = function(){
            
            base.dragging = false;
            base.$el.draggable('enable');
            $(document).unbind('mousemove.drag');
            $(document).unbind('mouseup.drag');
            
            if(base.options.end)
                base.options.end(base.degreeStart, base.degree);
            
        }
        
        base.calculate = function(e){
            
            base.rotate.x   = e.pageX;
            base.rotate.y   = e.pageY;
            
            base.center.x   = base.parentPos.left + parseInt(base.$el.css('left')) + base.$el.width() / 2;
            base.center.y   = base.parentPos.top + parseInt(base.$el.css('top'))  + base.$el.height()/ 2;
            
            base.start.x    = base.center.x;  
            base.start.y    = base.center.y - (base.$el.height() / 2);
            
            base.degree = base.findAngle(base.start, base.rotate, base.center); 
            
            if(base.start.x > base.rotate.x)
                base.degree = -base.degree;
            
            base.setRotate(base.degree);
             
        }
        
        base.findAngle = function(p0,p1,c) {
            var p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+
                                Math.pow(c.y-p0.y,2)); // p0->c (b)   
            var p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+
                                Math.pow(c.y-p1.y,2)); // p1->c (a)
            var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+
                                 Math.pow(p1.y-p0.y,2)); // p0->p1 (c)
            return parseInt(Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c)) * 180 / Math.PI);
        }
        
        base.init();
        
    }
    
    $.rotatable.defaultOptions = { end: null };
    
              
})(jQuery);
