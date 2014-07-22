jQuery.fn.colourPicker = function(conf) {
    // Config for plug
    var config = jQuery.extend({
        id          : 'jquery-colour-picker',               // id of colour-picker container
        ico         : 'ico.gif',                            // SRC to colour-picker icon
        title       : TranslationLabels['pick_a_colour'],   // Default dialogue title
        inputBG     : true,                                 // Whether to change the input's background to the selected colour's
        speed       : 500,                                  // Speed of dialogue-animation
        openTxt     : TranslationLabels['open_colour_picker'],
        callback    : function(){},
        callbackArgs: []
    }, conf);

    // Inverts a hex-colour
    var hexInvert = function (hex) {
        if(isHexaColor(hex)){
            var r = hex.substr(0, 2);
            var g = hex.substr(2, 2);
            var b = hex.substr(4, 2);

            return 0.212671 * r + 0.715160 * g + 0.072169 * b < 0.5 ? 'ffffff' : '000000'
        }
    };

    // Add the colour-picker dialogue if not added
    var colourPicker = jQuery('#' + config.id);

    if (!colourPicker.length) {
        colourPicker = jQuery('<div id="' + config.id + '"></div>').appendTo(document.body).hide();

        // Remove the colour-picker if you click outside it (on body)
        jQuery(document.body).on('click', function(event) {
            if (!(jQuery(event.target).is('#' + config.id) || jQuery(event.target).parents('#' + config.id).length)) {
                colourPicker.hide();
            }
        });
    }

    // For every select passed to the plug-in
    return this.each(function () {
        // Insert icon and input
        var select  = jQuery(this),
        holder      = jQuery('<div class="jquery-colour-picker-holder" />').insertAfter(select),
        icon        = jQuery('<a href="#"><img src="' + config.ico + '" alt="' + config.openTxt + '" /></a>').prependTo(holder),
        input       = jQuery('<input type="text" name="' + select.attr('name') + '" value="" class="jquery-color-picker-input" />').prependTo(holder),
        loc         = '';

        // Build a list of colours based on the colours in the select
        jQuery('option', select).each(function () {
            var option  = jQuery(this),
            hex         = option.val(),
            title       = option.text();
            id          = option.prop('id');
            
            if(hex){
            
                if(hex.indexOf('#') !== -1)
                    hexRel = hex.substr(1);
                
                loc += '<li><a href="#" title="' 
                        + title 
                        + '" rel="' 
                        + hexRel
                        + '" id="' 
                        + id 
                        + '" style="background: ' 
                        + hex 
                        + '; color: ' 
                        + hexInvert(hexRel) 
                        + ';">' 
                        + title 
                        + '</a></li>';
                    
            }
        });

        loc += '<a href="#" class="jquery-color-picker-reset">Reset</a>';
        
        // Remove select
        select.remove();

        // If user wants to, change the input's BG to reflect the newly selected colour
        if (config.inputBG) {
            input.change(function () {
                input.css({background: '#' + input.val(), color: '#' + hexInvert(input.val())});
                if(config.callback){
                    if(config.callbackArgs && jQuery.type(config.callbackArgs) !== "array")
                        config.callbackArgs = [];
                    config.callbackArgs.push(input);  
                    config.callback.apply(undefined, config.callbackArgs); //call callback
                }
            });

//            input.change();
        }

        // When you click the icon
        holder.on('click', function () {
            
            if(colourPicker.is(':visible')){
                colourPicker.hide();
                return;    
            }
            
            // Show the colour-picker next to the icon and fill it with the colours in the select that used to be there
            var iconPos    = icon.offset(),
            heading        = config.title ? '<h2>' + config.title + '</h2>' : '';

            colourPicker.html(heading + '<ul>' + loc + '</ul>').css({
                position: 'absolute', 
                left: iconPos.left + 15 + 'px', 
                top: iconPos.top + 'px'
            }).show();
            
            colourPicker.find('.jquery-color-picker-reset').off('click').on('click', function(e){
                e.preventDefault();
                input.val('').css({background: 'url("'+imgURL+'/images/flat/icon-sprite.png") no-repeat 10px -4500px'});
                colourPicker.find('a.selected').removeClass('selected');
                loc = colourPicker.find('ul').html();
                colourPicker.hide();    
            });

            // When you click a colour in the colour-picker
            jQuery('a:not(.jquery-color-picker-reset)', colourPicker).off('click').on('click', function (e) {
                e.preventDefault();
                
                // The hex is stored in the link's rel-attribute
                var hex = jQuery(this).attr('rel');
                
                colourPicker.find('a.selected').removeClass('selected');
                jQuery(this).addClass('selected');

                // If user wants to, change the input's BG to reflect the newly selected colour
                if(config.inputBG) {
                    input.css({background: '#' + hex, color: '#' + hexInvert(hex)});
                }

                // Trigger change-event on input
                input.val(hex);
                input.change();

                // Hide the colour-picker and return false
                colourPicker.hide();
                
                loc = colourPicker.find('ul').html();

                return false;
            });

            return false;
        });
        
    });
};

function isHexaColor(sNum){
  return (typeof sNum === "string") && sNum.length === 6 
         && ! isNaN( parseInt(sNum, 16) );
}