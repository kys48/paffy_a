/*var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP.lineTo) {
    CP.dashedLine = function(x, y, x2, y2, da) {
        if (!da) da = [10,5];
        this.save();
        var dx = (x2-x), dy = (y2-y);
        var len = Math.sqrt(dx*dx + dy*dy);
        var rot = Math.atan2(dy, dx);
        this.translate(x, y);
        this.moveTo(0, 0);
        this.rotate(rot);       
        var dc = da.length;
        var di = 0, draw = true;
        x = 0;
        while (len > x) {
            x += da[di++ % dc];
            if (x > len) x = len;
            draw ? this.lineTo(x, 0): this.moveTo(x, 0);
            draw = !draw;
        }       
        this.restore();
    }
}*/

(function($) {

    $.crop = function(el, options) {
        
        var base            = this;
        base.$el            = $(el);
        base.image          = null;
        base.$canvas        = null;
        base.ctx            = null;
        base.$select        = null;
        base.semafores      = new Array();
        var clickTarget     = null,
            cropBtn         = $('#cropImgBtn'),
            saveBtn         = $('#saveImgBtn');
        
        var mx, my; // mouse coordinates
        // Padding and border style widths for mouse offsets
        var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

        // when set to true, the canvas will redraw everything
        // invalidate() just sets this to false right now
        // we want to call invalidate() whenever we make a change
        var canvasValid     = false;
        //canvas dimensions
        var HEIGHT          = 0;
        var WIDTH           = 0;
        var lineDash        = false;
        var imgOffset       = {x: 0, y: 0};
        var imgHeight       = 0;
        
        var jcrop_api;
        
        base.options = $.extend(true, {},$.crop.defaultOptions, options);
        
        base.image = new Image;
        base.image.onload = function(e){
            var img             = $(this),
                position;
            if(base.options.cropType == 'polygonal'){
                
                img.appendTo(base.$el).addClass('lasoImage');
                position        = img.position();
                imgOffset.x     = parseInt(position.left, 10);
                imgOffset.y     = parseInt(position.top, 10);
                imgHeight       = img.height();
                base.init();
                
            } else if(base.options.cropType == 'rectangular'){
                var cropHolder  = $('<div id="cropHolder" />'); 
                base.$el.append(cropHolder);
                img.appendTo(cropHolder).addClass('lasoImage');
                position        = img.position();
                imgOffset.x     = parseInt(position.left, 10);
                imgOffset.y     = parseInt(position.top, 10);
                imgHeight       = img.height();
                cropHolder.Jcrop({}, function(){
                    jcrop_api   = this;
                });
                if(base.options.cropPoints && base.options.cropPoints.length == 4){
                    var coordinates = base.options.cropPoints;
                    coordinates     = jQuery.map(coordinates, function(n, i){
                        return parseInt(n, 10);
                    });
                    coordinates[0] = coordinates[0] + imgOffset.x; coordinates[1] = coordinates[1] + imgOffset.y;    
                    coordinates[2] = coordinates[2] + imgOffset.x; coordinates[3] = coordinates[3] + imgOffset.y;
                    jcrop_api.setSelect(coordinates);
                }
                cropBtn.unbind('click').on('click', function(e){
                    e.preventDefault();
                    if(oPlatform){
                        var coords = jcrop_api.tellSelect(), 
                        arrPoints   = [];
                        arrPoints.push((coords.x - imgOffset.x));
                        arrPoints.push((coords.y - imgOffset.y));
                        arrPoints.push((coords.x2 - imgOffset.x));
                        arrPoints.push((coords.y2 - imgOffset.y));
                        if(arrPoints.length == 4){
                            oPlatform.cropImage('rectangular', arrPoints, imgHeight);
                            jcrop_api.destroy();
                        } else
                            alert(TranslationLabels['must_have_valid_selection']);            
                    }
                });
                saveBtn.unbind('click').on('click', function(e){
                    e.preventDefault();
                    if(oPlatform){
                        var coords = jcrop_api.tellSelect(), 
                        arrPoints   = [];
                        arrPoints.push((coords.x - imgOffset.x));
                        arrPoints.push((coords.y - imgOffset.y));
                        arrPoints.push((coords.x2 - imgOffset.x));
                        arrPoints.push((coords.y2 - imgOffset.y));
                        if(arrPoints.length == 4)
                            oPlatform.saveImage('rectangular', arrPoints, imgHeight);
                        else
                            alert(TranslationLabels['must_have_valid_selection']);
                    }
                });
            }
            return true;            
        };
        
        base.image.src = base.options.url;

        base.init = function() {
            
            //reset global vars
            lineDash        = false;
            canvasValid     = false;
            //reset global vars end
            
            base.$canvas = $('<canvas width="'+base.$el.width()+'" height="'+base.$el.height()+'" class="lasoCanvas"></canvas>');
            base.$canvas.attr('id', 'canvas_'+base.$canvas.length);
            base.$canvas.appendTo(base.$el);

            HEIGHT                  = base.$canvas[0].height;
            WIDTH                   = base.$canvas[0].width;
            base.ctx                = base.$canvas[0].getContext('2d');

            base.clear(base.ctx);
            
            base.ctx.strokeStyle    = '#F00';
            if ( base.ctx.setLineDash !== undefined ){ 
                base.ctx.setLineDash([3,2]);
                lineDash = true;
            } else if ( base.ctx.mozDash !== undefined ) {     
                base.ctx.mozDash = [3,2];
                lineDash = true;
            }

            base.ctx.lineWidth = 2;
            
            var imageObj = new Image();
            imageObj.onload = function() {
                var pattern = base.ctx.createPattern(this, 'repeat');
                base.ctx.fillStyle = pattern;
            };
            imageObj.src = imgURL+'images/pattern.png';
            
            base.$select = $('<div class="lasoSelect"></div>');
            base.$select.attr('id', 'laso_'+base.$canvas.length);
            base.$select.appendTo(base.$el);
            
            cropBtn.unbind('click').on('click', function(e){
                e.preventDefault();
                base.cropImage();
            });
            
            saveBtn.unbind('click').on('click', function(e){
                e.preventDefault();
                base.cropImage(true);
            });

            // fixes mouse co-ordinate problems when there's a border or padding
            // see getMouse for more detail
            if (document.defaultView && document.defaultView.getComputedStyle) {
                stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(base.$canvas[0], null)['paddingLeft'], 10)     || 0;
                stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(base.$canvas[0], null)['paddingTop'], 10)      || 0;
                styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(base.$canvas[0], null)['borderLeftWidth'], 10) || 0;
                styleBorderTop   = parseInt(document.defaultView.getComputedStyle(base.$canvas[0], null)['borderTopWidth'], 10)  || 0;
            }                            
            
            base.$el.unbind('mousedown').on('mousedown', function(e){ 
                if(base.semafores['cropPoint'] == true)
                    return;
                
                base.semafores['cropPoint'] = true;    
                
                clickTarget = $(e.target);
                // left mouse down switches on "capturing mode"
                if( e.which === 1 && clickTarget.is('.potentialPoint:visible') && !clickTarget.is('.lasoPoint') ){
                    base.createLasoPoint(e);
                    base.refresh();                     
                } else if ( e.which === 1 && !clickTarget.is('.lasoPoint')) 
                    base.createLasoPoint(e);
                    
                base.semafores['cropPoint'] = false;
                
            }).unbind('mouseup').on('mouseup', function (e) {
                var target = $(e.target);
                // left mouse up ends "capturing mode" + triggers "Done" event
                if (e.which === 1 && target.attr('id') == 'firstPoint' && base.$select.data("lassoPoints").length > 1 && base.$select.is(".lassoRunning")) {
                    base.$select.removeClass("lassoRunning");
                    base.$select.trigger("lassoDone", [base.$select.data("lassoPoints")]);
                }
            }).unbind('mousemove').on('mousemove', function (e) {
                base.getMouse(e);
                
                if (base.$select.data("lassoPoints") && base.$select.is(".lassoRunning")) {
                    base.invalidate();
                    base.canvasDraw();

                    var lastPoint = base.$select.data("lassoPoints")[base.$select.data("lassoPoints").length-1];

                    base.ctx.moveTo(lastPoint[0], lastPoint[1]);
                    base.ctx.lineTo(mx, my);
                    base.ctx.stroke();
                    base.ctx.closePath();
                } else if(base.$select.data("lassoPoints") && !base.$select.is(".lassoRunning")){
                    var newPoint = $('#addedPoint');
                    var points = base.$select.data("lassoPoints");
                    var div;
                    var l = points.length;
                    var line = false;
                    var distance;
                    var projection;
                    for (var i = 0; i < l; i++) {
                        var ret;
                        var currentLine;
                        if(i == (l-1)){
                            ret         = distToSegmentSquared([mx, my], points[i], points[0]);
                            currentLine = [i, 0];
                            distance    = ret[0];
                            projection  = ret[1];
                        }else {
                            ret         = distToSegmentSquared([mx, my], points[i], points[i+1]);
                            currentLine = [i, i+1];
                            distance    = ret[0];
                            projection  = ret[1];
                        }
                        if(distance <= 15){
                            line = currentLine;
                            break;    
                        } else {
                            newPoint.hide();    
                        }
                    }
                    
                    if(newPoint.length > 0 && line){
                        if(!base.collision($('.lasoPoint:eq('+line[0]+')'), mx, my) && !base.collision($('.lasoPoint:eq('+line[1]+')'), mx, my)){
                            newPoint.show();
                            newPoint.data('lineIndexes', line);
                        } else {
                            newPoint.hide();
                        }
                        newPoint.css({left: projection[0]+'px', top: projection[1]+'px'});        
                    } else if(line) {
                        newPoint = $('<div id="addedPoint" class="potentialPoint" />');
                        newPoint.css({left: projection[0]+'px', top: projection[1]+'px'});
                        base.$select.append(newPoint);
                        newPoint.data('lineIndexes', line);
                    }
                }
            }).unbind('lassoStart').on("lassoStart", function(e, lassoPoint) {
                return;    
            }).on("lassoDone", function(e, lassoPoints) {
                base.$select.data('lassoPoints', lassoPoints);
                base.ctx.fillRect(0,0,WIDTH,HEIGHT);
                base.ctx.globalCompositeOperation = 'destination-out';
                base.canvasDraw();
                base.ctx.closePath();
                base.ctx.fill();
                base.ctx.globalCompositeOperation = 'destination-over';
                base.ctx.stroke();
            }).unbind('lassoPoint').on("lassoPoint", function(e, lassoPoint) {
                return;
            }).unbind('addedPoint').on("addedPoint", function(e, lassoPoint) {
                return;    
            });
            
            if(base.options.cropPoints)
                base.initialDraw();

        }
        
        base.cropImage = function(forSave){
            if(oPlatform && base.$select.data("lassoPoints") && base.$select.data("lassoPoints").length >= 3 && !base.$select.is(".lassoRunning")){
                var points      = base.$select.data("lassoPoints");
                var arrPoints   = [];
                var l = points.length;
                for (var i = 0; i < l; i++) {
                    arrPoints.push((points[i][0] - imgOffset.x));
                    arrPoints.push((points[i][1] - imgOffset.y));
                }
                if(forSave){                          
                    oPlatform.saveImage('polygonal', arrPoints, imgHeight);
                } else                                
                    oPlatform.cropImage('polygonal', arrPoints, imgHeight);
                
            } else {
                alert(TranslationLabels['must_have_valid_selection']);
            }
        }
        
        base.initialDraw = function(){
            if(!base.$select.is(".lassoRunning") && base.options.cropPoints.length >= 3 && base.options.cropType == 'polygonal'){
                var points = slitToPointArrays(base.options.cropPoints);
                var l = points.length;
                for (var i = 0; i < l; i++) {                        
                    base.createLasoPoint(false, points[i]);
                }
                var imageObj = new Image();
                imageObj.onload = function() {
                    var pattern = base.ctx.createPattern(this, 'repeat');
                    base.ctx.fillStyle = pattern;
                    base.$select.removeClass("lassoRunning");
                    base.refresh();
                    base.$select.trigger("lassoDone", [base.$select.data("lassoPoints")]);
                };
                imageObj.src = imgURL+'images/pattern.png';
            }    
        }

        base.createLasoPoint = function(e, point){
            if(point){
                mx = parseFloat(point[0]) + imgOffset.x;
                my = parseFloat(point[1]) + imgOffset.y;
                point = [mx, my]; 
            } else {
                base.getMouse(e);
                point = [mx, my];
            }
            var lasoPoint, addedPoint = $('#addedPoint:visible'); 
            if(!base.$select.is(".lassoRunning") && !base.$select.data("lassoPoints")){
                lasoPoint = $('<div id="firstPoint" class="lasoPoint" />').css({left: mx, top: my}).draggable({
                    cursor: "pointer",
                    containment: 'parent',
                    drag: function(e, ui) {
                        var point = $(this);
                        base.redraw(point, e, ui);
                    }
                });
                base.$select.addClass("lassoRunning");
                base.$select.data("lassoPoints", [point]);
                base.$select.trigger("lassoStart", [point]);
                base.$select.append(lasoPoint);
            } else if(base.$select.is(".lassoRunning") || addedPoint.length > 0){
                
                lasoPoint = $('<div class="lasoPoint" />').css({left: mx, top: my}).draggable({
                    cursor: "pointer",
                    containment: 'parent',
                    drag: function(e, ui) {
                        var point = $(this);
                        base.redraw(point, e, ui);
                    }   
                });
                
                if(addedPoint.length > 0){
                    var lineIndexes = addedPoint.data('lineIndexes');
                    if(lineIndexes[1] == 0)
                        base.$select.data("lassoPoints").push(point);
                    else    
                        base.$select.data("lassoPoints").splice(lineIndexes[1], 0, point);
                    base.$select.trigger("addedPoint", [point]);
                    $('.lasoPoint:eq('+lineIndexes[0]+')').after(lasoPoint);
                    jQuery.removeData(addedPoint, "lineIndexes");
                    addedPoint.remove();    
                } else {
                    base.$select.data("lassoPoints").push(point);
                    base.$select.trigger("lassoPoint", [point]);
                    base.$select.append(lasoPoint);
                }
            }
        }

        base.canvasDraw = function(){
            if (canvasValid == false)
                base.clear(base.ctx);

            // Add stuff you want drawn in the background all the time here

            // draw lines
            base.ctx.beginPath();
            var points = base.$select.data("lassoPoints");
            var l = points.length;
            for (var i = 0; i < l; i++) {
                base.ctx.lineTo(points[i][0], points[i][1]);
            }
            // Add stuff you want drawn on top all the time here
            canvasValid = true;
        }

        base.redraw = function(point, e, ui){
            
            if (ui.position.left < 0 || ui.position.left > WIDTH)
                return false;
            if (ui.position.top < 0 || ui.position.top > HEIGHT)
                return false;
            
            //update coords and redraw lines and fill
            if(point.attr('id') == 'firstPoint'){
                base.$select.data("lassoPoints")[0][0] = ui.position.left;
                base.$select.data("lassoPoints")[0][1] = ui.position.top;
            } else {
                base.$select.data("lassoPoints")[point.index()][0] = ui.position.left;
                base.$select.data("lassoPoints")[point.index()][1] = ui.position.top;    
            }
            
            if(!base.$select.is(".lassoRunning")){
                base.refresh();    
            } else {
                base.invalidate();
                base.canvasDraw();
                if(clickTarget.is('#firstPoint'))
                    base.ctx.closePath();
                base.ctx.stroke();
            }
        }
        
        base.refresh = function(){
            base.clear(base.ctx);
            base.ctx.globalCompositeOperation = 'destination-atop';
            base.ctx.fillRect(0,0,WIDTH,HEIGHT);
            base.ctx.globalCompositeOperation = 'destination-out';
            base.canvasDraw();
            base.ctx.closePath();
            base.ctx.fill();
            base.ctx.globalCompositeOperation = 'destination-over';
            base.ctx.stroke();
        }

        // Sets mx,my to the mouse position relative to the canvas
        // unfortunately this can be tricky, we have to worry about padding and borders
        base.getMouse = function(e) {

            var element = base.$canvas[0]; offsetX = 0, offsetY = 0;

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }

            // Add padding and border style widths to offset
            offsetX += stylePaddingLeft;
            offsetY += stylePaddingTop;

            offsetX += styleBorderLeft;
            offsetY += styleBorderTop;

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY
        }
        
        base.collision = function($div, mx, my) {
            
            var divX            = $div.position().left + parseInt($div.css('margin-left').replace('px', '')),
            divY                = $div.position().top + parseInt($div.css('margin-top').replace('px', '')),
            divHeight           = $div.outerHeight(),
            divWidth            = $div.outerWidth(),
            bounds              = {},
            mouseRadius         = {},
            offset              = 5;
            
            bounds.left         = divX;
            bounds.top          = divY;
            bounds.right        = divX + divWidth;
            bounds.bottom       = divY + divHeight;
            
            mouseRadius.left    = mx - offset;
            mouseRadius.top     = my - offset;
            mouseRadius.right   = mx + offset;
            mouseRadius.bottom  = my + offset;
            
            if (bounds.left <= mouseRadius.left && bounds.top <= mouseRadius.top && bounds.right >= mouseRadius.left && bounds.bottom >= mouseRadius.top) return true;
            if (bounds.left <= mouseRadius.right && bounds.top <= mouseRadius.top && bounds.right >= mouseRadius.right && bounds.bottom >= mouseRadius.top) return true;
            if (bounds.left <= mouseRadius.left && bounds.top <= mouseRadius.bottom && bounds.right >= mouseRadius.left && bounds.bottom >= mouseRadius.bottom) return true;
            if (bounds.left <= mouseRadius.right && bounds.top <= mouseRadius.bottom && bounds.right >= mouseRadius.right && bounds.bottom >= mouseRadius.bottom) return true;
            
            return false;
        }

        //wipes the canvas context
        base.clear = function(c){
            c.clearRect(0, 0, WIDTH, HEIGHT);
        }

        base.invalidate = function (){
            canvasValid = false;
        }
        
    };

    $.crop.defaultOptions = {
        url     : '',
        cropType: 'polygonal'
    };

    $.fn.crop = function(options) {
        return this.each(function() {
            (new $.crop(this, options));
        });
    };

})(jQuery);

//https:github.com/zoltan-dulac/polyClip/blob/master/js/polyclip.js
//http:www.maxnov.com/getimagedata/

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return [dist2(p, [ (v[0] + t * (w[0] - v[0])),
                    (v[1] + t * (w[1] - v[1])) ]), [ (v[0] + t * (w[0] - v[0])),
                    (v[1] + t * (w[1] - v[1])) ]];
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
function slitToPointArrays(a){
    var out = [];
    while (a.length > 0) {
      out.push(a.splice(0,2));
    }
    return out;
}