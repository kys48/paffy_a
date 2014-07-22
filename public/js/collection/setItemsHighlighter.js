(function($) {

    $.fn.setItemsHighlighter = function(options) {
        
        if(options == 'adjustPositions'){
            return this.each(function(index) {
                var obj = $(this).data('highlighterObj');
                if(obj)
                    obj.adjustPositions(obj);
                
            });
        }  
        
        return this.each(function() {
            var obj = new $.setItemsHighlighter(this, options);
            $(this).data('highlighterObj', obj);
        });
    };

    $.setItemsHighlighter = function(el, options) {
    
        var base            = this;
        base.$el            = $(el);
        
        if(options == 'destroy'){
            document.off('mousemove', base.$el, base.itemHighlighting);
            return;
        }
         
        //Global vars
        base.setItems       = base.$el.find('.setItem.product'),
        base.setItemsInfo   = [],
        base.popupsInfo     = [],
        base.prevHoverDiv;

        base.init = function(){
            
            //Initialization of set items info and popups position
            base.adjustPositions();
            
            //Show/hide popups on item hover events
            base.setItems.on('hoverAdd', function(e, event, setId, productId){
                var popup        = base.$el.find('#productPopup_'+setId+'_'+productId),
                    openedPopups = $('.items .popup.visible');
                
                if(openedPopups.length > 0){
                    return openedPopups.each(function(index, item){
                        var openedPopup = $(item);
                            offset      = openedPopup.offset(),
                            mx          = event.pageX,
                            my          = event.pageY;
                        
                        if(!mouseInRect(mx, my, offset.left, offset.top, (offset.left+openedPopup.outerWidth()), (offset.top+openedPopup.outerHeight())))
                            openedPopup.removeClass('visible').hide();
                        else
                            return false;
                    });
                }
                  
                var popupObj  = base.popupsInfo[($(this).index()-1)],
                    popupInfo = popupObj[popup.prop('id')];
                
                popup.css({top: popupInfo.top, left: popupInfo.left, margin: '0'}).addClass('visible').show();
            }).on('hoverRemove', function(e, event, setId, productId){
                var popup   = base.$el.find('#productPopup_'+setId+'_'+productId),
                offset      = popup.offset(),
                mx          = event.pageX,
                my          = event.pageY;
                if(!mouseInRect(mx, my, offset.left, offset.top, (offset.left+popup.outerWidth()), (offset.top+popup.outerHeight())))
                    popup.removeClass('visible').hide();
                else {
                    $('.items .popup').not(popup).removeClass('visible').hide();
                    popup.addClass('visible');
                }
            });
            
            //Bind mousemove event on set image container div
            base.$el.on('mousemove', base.itemHighlighting).on('mouseleave', function(){
                base.$el.find('.popup.visible').removeClass('visible').hide();
                base.$el.find('.setItem.product.hover').removeClass('hover');
            });
        }

        //Item highlighting(hover) handler. Called on mousemove in set image container
        base.itemHighlighting = function(e){
            var mx = e.pageX,
            my = e.pageY,
            minCenterDistance = -1,
            hoverDiv = null;
            
            $.each(base.setItemsInfo, function(index, setItem){
                var el = base.setItems.eq(index);
                
                if(mouseInRect(mx, my, setItem.x1, setItem.y1, setItem.x2, setItem.y2)){
                    var centerDistance = lineDistance({x: mx, y: my}, setItem.centerPoint);
                    if(base.prevHoverDiv != el && centerDistance < minCenterDistance || minCenterDistance == -1){
                        hoverDiv = el;
                        minCenterDistance = centerDistance; 
                    }
                } else if(el.hasClass('hover')) {
                    var idsInfo     = el.attr('class').split(' ')[1].split('_'),
                        setId       = idsInfo[1],
                        productId   = idsInfo[2];
                    el.removeClass('hover').trigger("hoverRemove", [e, setId, productId]);    
                }
            });

            if(base.prevHoverDiv && hoverDiv && base.prevHoverDiv[0] != hoverDiv[0]){
                var prevIdsInfo     = base.prevHoverDiv.attr('class').split(' ')[1].split('_'),
                    idsInfo         = hoverDiv.attr('class').split(' ')[1].split('_'),
                    prevSetId       = prevIdsInfo[1],
                    prevProductId   = prevIdsInfo[2],
                    setId           = idsInfo[1],
                    productId       = idsInfo[2];
                base.prevHoverDiv.removeClass('hover').trigger("hoverRemove", [e, prevSetId, prevProductId]);
                hoverDiv.addClass('hover').trigger("hoverAdd", [e, setId, productId]); 
                base.prevHoverDiv   = hoverDiv;  
            } else if(!base.prevHoverDiv && hoverDiv){
                
                var idsInfo         = hoverDiv.attr('class').split(' ')[1].split('_'),
                    setId           = idsInfo[1],
                    productId       = idsInfo[2];
                hoverDiv.addClass('hover').trigger("hoverAdd", [e, setId, productId]);
                base.prevHoverDiv   = hoverDiv;
            } else if(!hoverDiv){
                if(base.prevHoverDiv != null){
                    var prevIdsInfo     = base.prevHoverDiv.attr('class').split(' ')[1].split('_'),
                        prevSetId       = prevIdsInfo[1],
                        prevProductId   = prevIdsInfo[2];
                    base.prevHoverDiv.removeClass('hover').trigger("hoverRemove", [e, prevSetId, prevProductId]);
                }
                base.prevHoverDiv = null;
            }

        }
        
        base.adjustPositions = function(instance){
            
            if(instance)
                base = instance;
            
            base.setItemsInfo = [];
            base.popupsInfo   = [];
            
            base.setItems.each(function(){
                var item    = $(this),
                left        = parseInt(item.css('left')) + (item.width()/2),
                ids         = item.attr('class').split(' ')[1].split('_'),
                setId       = ids[1],  
                productId   = ids[2],
                offset      = 20,
                element_top = item.position().top,
                itemOffset  = item.offset(),
                x1          = itemOffset.left,
                y1          = itemOffset.top,
                x2          = itemOffset.left+item.outerWidth(),
                y2          = itemOffset.top+item.outerHeight(),
                centerPoint = {x: (x1 + x2)/2, y: (y1 + y2)/2},
                popup       = base.$el.find('#productPopup_'+setId+'_'+productId),
                popup_height= popup.outerHeight(),
                popupTop;
                
                base.setItemsInfo.push({productId : productId, x1: x1, y1: y1, x2: x2, y2: y2, centerPoint: centerPoint});
                
                /*if(popup_height < element_top)
                    popupTop = element_top - popup_height + offset;
                else*/
                    popupTop = element_top + offset;
                
                var popupObj = {};
                popupObj[popup.prop('id')] = {'top' : parseInt(popupTop, 10), 'left': parseInt(left, 10)+'px'};
                base.popupsInfo.push(popupObj);
                    
                popup.css({top: popupTop, left: left+'px', margin: '0'}).unbind('mouseover').on('mouseover', function(){
                    $('.items .popup').not($(this)).hide();
                }).unbind('mouseleave').on('mouseleave', function(e){
                    $(this).removeClass('visible').hide();
                    var hoveredEl = base.$el.find('.setItem.product.hover'),
                        idsInfo,
                        setId,
                        productId;
                    
                    if(hoveredEl.length > 0){
                        idsInfo   = hoveredEl.attr('class').split(' ')[1].split('_'),
                        setId     = idsInfo[1],
                        productId = idsInfo[2];
                        
                        hoveredEl.trigger("hoverAdd", [e, setId, productId]);
                    }      
                });    
            });    
            
        }
        
        base.init();
         
    }
    
    $.setItemsHighlighter.defaultOptions = { zoomCoef: null };
              
})(jQuery);