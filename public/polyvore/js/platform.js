/**
* @todo
* min/max items
* placeholder background draw when template
* fix reset when hasTemplate etc..
*/

//static variables for the whole page
$.staticVars = {
    cache: {},
    searchResult: {},
    tagsLimit: 20,
    ignoreFurtherTags: false
};

function platform(platformType){
    var self = this;
    
    /**
     * Bool check whether platform mode is
     * template_create or template_create_draft
     */
    self.inTemplateCreate = function(){
        if($.inArray(self.platformType, ['template_create', 'template_create_draft']) !== -1)
            return true;
        return false;
    }
    
    /**
     * Bool check whether platform mode is
     * set or set_draft
     */
    self.inSet = function(){
        if($.inArray(self.platformType, ['set', 'set_draft']) !== -1)
            return true;
        return false;
    }
    
    self.startplatformType  = platformType;
    self.platformType       = platformType;
    self.hasTemplate        = false;
    self.semaphoreCrop      = false;
    self.semaphoreSave      = false;
    self.semaphoreGetCrops  = false;

    // Objects
    self.Create         = $('#Create');
    self.Dashboard      = $('#Dashboard');
    self.board          = $('#Board');
    self.products       = $('#Products');
    self.Navigator      = $('#Navigator');
    self.ItemNavigator  = $('#ItemNavigator');
    self.Crop           = $('#Crop');
    self.Publish        = $('#Publish');
    self.QuickCrop      = $('#QuickCrop');
    
    // URLS
    self.loadSetURL         = false;
    self.loadSetDraftURL    = false;
    self.cropURL            = false;
    self.productURL         = false;
    self.embellishmentURL   = false;
    self.publishURL         = false;
    self.searchTagsURL      = false;
    
    // Buttons
    self.draftBtn       = self.Navigator.find('.draft');
    self.publishBtn     = self.Navigator.find('.publish');
    self.restartBtn     = self.Navigator.find('.restart');
    self.undoBtn        = self.Navigator.find('.undo');
    self.redoBtn        = self.Navigator.find('.redo');
    self.zoomInBtn      = self.Navigator.find('.zoomIn');
    self.zoomOutBtn     = self.Navigator.find('.zoomOut');
    self.flipBtn        = self.Navigator.find('.flip');
    self.flopBtn        = self.Navigator.find('.flop');
    self.forwardBtn     = self.Navigator.find('.forward');
    self.backwardBtn    = self.Navigator.find('.backward');
    self.removeBtn      = self.Navigator.find('.remove');
    self.noBckgBtn      = self.ItemNavigator.find('.noBackground');
    self.whiteBckgBtn   = self.ItemNavigator.find('.whiteBackground');
    self.cropBtn        = self.ItemNavigator.find('.crop');
    self.cropPolyBtn    = self.Crop.find('#PolygonalCrop');
    self.cropRectBtn    = self.Crop.find('#RectangularCrop');
    self.publishSubmit  = self.Publish.find('#PublishSubmit');
    self.publishClose   = self.Publish.find('#PublishClose, .close');

    if(self.inTemplateCreate()){
        self.HintNavigator  = $('#HintNavigator');
        self.placeholderBtn = self.Create.find('.placeholderBtn');
        self.hintStart      = '';
    }
    
    self.boardOffset    = self.board.offset();
    
    //Items vars
    self.zoomFactor     = 1.1;
    self.minItems       = 0;
    self.maxItems       = 0;
    self.items          = 0;
    self.itemsCreated   = 0;
    
    //History vars
    self.history                = new Array();
    self.historyLastPointer     = 0;
    self.historyCurrentPointer  = 0;
    
    /**
     * Object constructor
     * Initializes draggable and droppable
     * settings and delegates navigation binds
     */
    self.init = function(){
        self.semaphoreCrop      = false;
        self.semaphoreSave      = false;
        self.semaphoreGetCrops  = false;
        
        self.products.on('mouseover', 'ul.items:not(".undraggable") li', function(){
            if(!$(this).is(":ui-draggable")){
                $(this).draggable({
                    cursor: "move",
                    start: function(event, ui){
                        var dragOrigin = $(this).find('input[name="itemOrigin"]').val();
                        if( self.inSet() && self.hasTemplate && (dragOrigin == 'product' || dragOrigin == 'embellishment')){
                            self.board.find('.placeholder').addClass('ui-state-active');
                            self.board.on('mouseover.drag', '.placeholder' , function(event){
                                $(this).addClass('ui-state-hover');
                            }).on('mouseout.drag', '.placeholder' , function(event){
                                $(this).removeClass('ui-state-hover');
                            });
                        }
                    },
                    helper: function() {
                        return $( "<div class='ui-widget'>"+$(this).find('img')[0].outerHTML+"</div>" );
                    }
                });
            }
        });
        
        self.board.droppable({
            accept: ".ui-draggable",
            drop: function( event, ui ) {
alert("drop~!!!!");            	
                if(!ui.draggable.hasClass('image') && !ui.draggable.hasClass('ui-rotatable-handle')){
                    var dragOrigin = ui.draggable.find('input[name="itemOrigin"]').val();
                   
                    if( self.inSet() && self.hasTemplate && (dragOrigin == 'product' || dragOrigin == 'embellishment')){
                        var el = self.board.find('.placeholder.ui-state-hover');
                        if(el.length > 0)
                            self.add(ui.draggable, false, el);

                        self.board.find('.placeholder').removeClass('ui-state-hover ui-state-active');
                        self.board.off('mouseover.drag', '.placeholder').off('mouseout.drag', '.placeholder');
                    }else{
                        self.add(ui.draggable, {left : event.clientX, top : event.clientY}, $(this));
                        $(this).find('.message').hide();
                    }
                
                }
            }
        });
        
        self.binds();
        
        self.undoBtn.addClass('inactive');          
        self.redoBtn.addClass('inactive'); 
        
        self.applyItemNavigation(false);
        
    }
    
    /**
     * Clears dashboard
     */
    self.restart = function(skipRestartPlatformType){
        
        self.board.find('.image').remove();
        self.board.find('.message').show();
        
        if(!skipRestartPlatformType){
            self.platformType = self.startplatformType;
            self.hasTemplate  = false;
        }
        
        self.items          = 0;
        self.itemsCreated   = 0;
        
        beforeLeave(false);

        self.history                = new Array();
        self.historyLastPointer     = 0;
        self.historyCurrentPointer  = 0;
    
        self.undoBtn.addClass('inactive');
        self.redoBtn.addClass('inactive');
    
        self.applyItemNavigation(false);
        
        self.clearData();
        
        self.semaphoreCrop      = false;
        self.semaphoreSave      = false;
        self.semaphoreGetCrops  = false;
        
    }
    
    /**
    * Loads set/draft/tamplate on drop
    * by itemId and type(set/draft/template)
    * On success initData is called with json
    * parameters for each item in the object
    */
    //self.ajaxLoadData = function(id, type){
    self.ajaxLoadData = function(itemId, itemOrigin, itemImg){
alert(111);
        $.ajax({
            url         : '/create/'+itemOrigin+'/'+itemId,
            dataType    : 'json',
            success: function(json){
                if(json.status == true){
                    self.platformType = itemOrigin;           
                    self.initData(json.msg);
                }else
                    notify('error', json.msg);
            },
            error: function(){
                notify('error', TranslationLabels['could_not_load']);
            } 
        });
    }
    
    /**
    * Configures data and dasboard
    * according to platform type and
    * items.    
    */
    self.initData = function(oData){
        //FIX ONLY FOR TEMPLATESS!!!!
        if(self.platformType == 'template'){
            oData.template_version_id = oData.id;
            delete(oData.id);
            self.platformType = 'set';
        }
        
        if(self.inSet() && oData.template_version_id)
            self.hasTemplate = true;
        else
            self.hasTemplate = false;
        
        self.restart(true);
        
        if(oData){
            
            self.board.find('.message').hide();
            
            if(self.inTemplateCreate()){
                self.Publish.find('#name').val(oData.name);
                self.Publish.find('#instructions').val(oData.instructions);
            }else if(self.platformType == 'set'){
                if(oData.hasOwnProperty('tags')){
                    var values = [];
                    for(var key in oData.tags) {
                        values.push(oData.tags[key]);
                    }
                    self.Publish.find( "#tagIds" ).val(values.join(","));
                    self.Publish.find( "#tags" ).val(values.join(","));
                }
                self.Publish.find('#name').val(oData.name);
                self.Publish.find('#description').val(oData.description);
                self.Publish.find('#category_id').val(oData.category_id);
            }else if(self.hasTemplate){
                self.Publish.find('#name').val(oData.name);
            }
            
            if(oData.id)
                self.board.data('id', oData.id);
            
            if(self.hasTemplate && oData.template_version_id)
                self.board.data('template_version_id', oData.template_version_id);
            
            self.addItems(oData.items);
            
        }
    }
    
    self.clearData = function(){
        if(self.board.data('id'))
            self.board.removeData('id');
        if(self.board.data('setDraftId'))
            self.board.removeData('setDraftId');
        if(self.board.data('template_version_id'))
            self.board.removeData('template_version_id');
        
        if(self.inSet()){
            self.board.removeData('id');
            self.Publish.find('#name').val('');
            self.Publish.find('#description').val('');
            self.Publish.find('#category_id').val('');
            self.Publish.find('#tags').val('');
        }else if(self.inTemplateCreate()){
            self.Publish.find('#name').val('');
            self.Publish.find('#instructions').val('');
        }
        
    }
    
    /**
    * Used by initData
    * This method add all items to
    * dasboard according to their itemOrigin
    */
    self.addItems = function(items){
        $.each(items, function(index, value){
            
            if( $.inArray(value.itemOrigin, ['product', 'embellishment']) != -1){
                
                self.addImageOnInit(value, self.board);
                
            }else if(value.itemOrigin == 'placeholder'){
                
                self.board.find('.message').hide();
                    
                var placeHolder = $('<div class="image placeholder"><span class="hint">'+value.hint+'</span></div>');

                placeHolder.data({
                    itemOrigin : 'placeholder',
                    hint       : value.hint
                });

                placeHolder.appendTo(self.board).hide();
                
                if(self.inTemplateCreate()){
                    self.items++;
                    self.itemsCreated++;
                    self.makeDraggable(placeHolder);
                }else if(self.inSet() && self.hasTemplate){
                    
                    placeHolder.data('itemId', value.itemId);
                    placeHolder.addClass('unselectable');
                    
                    if(value.child)
                        self.addImageOnInit(value.child, placeHolder);
                        
                }
                
                placeHolder.attr('id', 'image_'+(++self.itemsCreated))
                            .css({
                                left: value.cssLeft+'px',
                                top: value.cssTop+'px',
                                width: value.width+'px',
                                height: value.height+'px',
                                zIndex: value.zIndex
                            });
                            
                if(value.rotate)
                    placeHolder.rotatable(parseInt(value.rotate));

                placeHolder.show();
                   
            }
        });
        
        beforeLeave(true);
        
    }
    
    /**
    * Send ajax data for draft
    */
    self.draft = function(){
        
        if(semafors['ajax'])
            return;
        
        semafors['ajax'] = true;
        
        var postData = new Object();
            
        postData.items = self.generateOutputData();
        
        if(self.board.data('template_version_id'))
            postData.info = { template_version_id : self.board.data('template_version_id') };
        
        self.draftBtn.children('span').html(self.draftBtn.find('input[name="inactive"]').val());

        var url = self.publishURL+'/'+self.platformType+'/';

        if(self.board.data('id'))
            url += self.board.data('id');
        
        $.ajax(url+'?action=draft', {  
            type: 'post',
            data: $.param(postData),
            cache: false,
            dataType: "json",
            success : function(json){
                
                if(json.status != true)
                    notify('error', json.msg);
                else
                    notify('success', json.msg);
                
                self.draftBtn.html(self.draftBtn.find('input[name="active"]').val());
                    
                semafors['ajax'] = false;
        
            },
            error: function(){
                semafors['ajax'] = false;
                self.draftBtn.children('span').html(self.draftBtn.find('input[name="active"]').val());
                notify('error', TranslationLabels['could_not_complete_request']);
            }
        });
    }
    
    /**
    * Send ajax data for publish
    */
    self.submitPublish = function(){
       
        if(semafors['ajax'])
            return;
        
        semafors['ajax'] = true;
        
        var postData = new Object();
        
        postData.items = self.generateOutputData();
        
        beforeLeave(false);
        
        var oauthProviders = [];
        
        self.Publish.find('input[name="oauth_providers[]"]:not(:disabled)').each(function() {
            oauthProviders.push(this.value);
        });
        
        if( self.inSet() ){
            postData.info = {
                name            : self.Publish.find('input[name="name"]').val(),
                description     : self.Publish.find('textarea[name="description"]').val(),
                category_id     : self.Publish.find('select[name="category_id"]').val(),
                tags            : self.Publish.find('input[name="tags"]').val(),
                share           : ((self.Publish.find('input[name="share"]').is(':checked')) ? 1 : 0),
                contestId       : self.Publish.find('input[name="contestId"]').val(),
                oauth_providers : oauthProviders  
            }
            
            if(self.board.data('template_version_id'))
                postData.info.template_version_id = self.board.data('template_version_id');
            
        }else if(self.inTemplateCreate()){
            postData.info = {
                name        : self.Publish.find('input[name="name"]').val(),
                instructions: self.Publish.find('textarea[name="instructions"]').val()
            }
        }
        
        self.publishSubmit.children('span').html(self.publishSubmit.find('input[name="inactive"]').val());

        //var url = self.publishURL+'/'+self.platformType+'/';
        var url = self.publishURL;

//alert($.param(postData));

        if(self.board.data('id'))
            url += self.board.data('id');



        //$.ajax(url+'?action=publish', {
        $.ajax(url, {
            type: 'post',
            data: $.param(postData),
            cache: false,
            dataType: "json",
            success : function(json){
alert("성공~");  
                if(json.status == true){
                    document.location.href = json.redirect;
                    return;
                }
                
                semafors['ajax'] = false;
                notify('error', json.msg);
                self.publishSubmit.html(self.publishSubmit.find('input[name="active"]').val());
                if(self.items > 0)
                    beforeLeave(true);
        
            },
            error: function(){
alert("오류~");
                semafors['ajax'] = false;
                self.publishSubmit.children('span').html(self.publishSubmit.find('input[name="active"]').val());
                notify('error', TranslationLabels['could_not_complete_request']);
                if(self.items > 0)
                    beforeLeave(true);
            }
        });
    }
    
    /**
    * Displays publish popup box
    */
    self.showPublish = function() {
        showPopup(self.Publish, false, true);
    }
    
    /**
    * Hides publish popup box
    */
    self.hidePublish = function(){
        $('#mask').click();
    }
    
    /**
    * Hides sharing popup box
    */
    self.hideShare = function(share){
        $('#mask').click();
    }
    
    
    /**
    * Goes throuhg each element and makes it
    * as object according to platform type
    */
    self.generateOutputData = function(){
        
        var postData = new Array();
        var index    = 0;
        
        self.board.children('.image').each(function(){
                                 
            
            if(self.hasTemplate){
                                         
                if(!$(this).hasClass('placeholder') && !$(this).hasClass('filled'))
                    return;
                                    
                var item = $(this).find('.image');
                
                if(item.length == 0)
                    return; 
               
                postData[index] = {};
                postData[index].placeholderId   = $(this).data('itemId');
                postData[index].itemOrigin      = item.data('itemOrigin');
                postData[index].itemId          = item.data('itemId');
                postData[index].itemImg         = item.data('itemImg');
                postData[index].whiteBck        = item.hasClass('whiteBackground');
                postData[index].height          = item.height();
                postData[index].cssLeft         = parseInt(item.css('left'));
                postData[index].cssTop          = parseInt(item.css('top'));
                postData[index].flip            = item.hasClass('flip');
                postData[index].flop            = item.hasClass('flop');
                
            }else{
                
                postData[index] = {};
                
                if($(this).hasClass('placeholder') && self.inTemplateCreate()){
                    postData[index].hint    = $(this).find('.hint').html();
                    postData[index].width   = $(this).width();
                }else{
                    postData[index].itemId  = $(this).data('itemId');
                    postData[index].itemImg = $(this).data('itemImg');
                    postData[index].whiteBck    = $(this).hasClass('whiteBackground');
                    postData[index].flip        = $(this).hasClass('flip');
                    postData[index].flop        = $(this).hasClass('flop');
                    if($(this).data('cropType')){
                        postData[index].cropType    = $(this).data('cropType'); 
                        postData[index].cropPoints  = $(this).data('cropPoints'); 
                        postData[index].cropHeight  = $(this).data('cropHeight');
                    }
                }

                postData[index].itemOrigin  = $(this).data('itemOrigin');
                postData[index].height      = $(this).height();
                postData[index].top         = $(this).position().top;
                postData[index].left        = $(this).position().left;
                postData[index].cssLeft     = parseInt($(this).css('left'));
                postData[index].cssTop      = parseInt($(this).css('top'));
                postData[index].zIndex      = $(this).zIndex();
                postData[index].rotate      = $(this).data('rotate');
            }  
        
            index++;
            
        });
        
        return postData;
        
    }
    
    /**
     * Performes all platform binds
     */
    self.binds = function(){
        self.board.on('click', '.image:not(.unselectable)', function(){
            self.selectImage($(this));
        });
        
        $(document).on('keyup', function(event){
            if(event.keyCode == 46)
                self.removeItem();
        });
        
        self.draftBtn.on('click', function(e){ e.preventDefault(); self.draft(); });
        self.publishBtn.on('click', function(e){ e.preventDefault(); self.showPublish(); });
        self.restartBtn.on('click', function(e){ e.preventDefault(); self.restart(); });
        self.undoBtn.on('click', function(e){ e.preventDefault(); self.undo(); });
        self.redoBtn.on('click', function(e){ e.preventDefault(); self.redo(); });
        self.zoomInBtn.on('click', function(e){ e.preventDefault(); self.zoomIn(); });
        self.zoomOutBtn.on('click', function(e){ e.preventDefault(); self.zoomOut(); });
        self.flipBtn.on('click', function(e){ e.preventDefault(); self.flip(); });
        self.flopBtn.on('click', function(e){ e.preventDefault(); self.flop(); });
        self.forwardBtn.on('click', function(e){ e.preventDefault(); self.moveForward(); });
        self.backwardBtn.on('click', function(e){ e.preventDefault(); self.moveBackward(); });
        self.removeBtn.on('click', function(e){ e.preventDefault(); self.removeItem(); });
        self.cropBtn.on('click', function(e){ e.preventDefault(); self.startCrop(); });
        self.cropPolyBtn.on('click', function(e){ 
                                        e.preventDefault();
                                        if($(this).hasClass('active')){ return false; } self.startCrop('polygonal'); 
                                     });
        self.cropRectBtn.on('click', function(e){ 
                                        e.preventDefault();
                                        if($(this).hasClass('active')){ return false; } self.startCrop('rectangular');
                                     });
        self.noBckgBtn.on('click', function(e){ e.preventDefault(); self.noBackground(); });
        self.whiteBckgBtn.on('click', function(e){ e.preventDefault(); self.whiteBackground(); });
        self.Crop.find('.close').on('click', function(e){ e.preventDefault(); self.closeCrop(); });
        self.Crop.find('#closeCropBtn').on('click', function(e){ e.preventDefault(); self.closeCrop(); });
        
        self.board.on('click', function(e){
            if($(e.target).context == $(this).context || $(e.target).hasClass('unselectable'))
                self.deselectImage();
        });
        
        self.publishSubmit.on('click', function(e){ e.preventDefault(); self.submitPublish()});
        self.publishClose.click(function(e){ e.preventDefault(); self.hidePublish()});
        
        self.Create.find('#postToEdit').on('click', function(e){
            e.preventDefault(); 
            self.hidePublish(); 
            
            var Share =  $('#Share'); 
            Share.find('.close').on('click', function(){
                self.hideShare(Share);
            });
            
            /*
            
            $('#mask').show().on('click', function(){
                self.hideShare(Share);    
            });
            */
            showPopup(Share, false, true);
        });
        
        self.Create.find('#shareBackBtn').on('click', function(e){ 
            e.preventDefault();
            var Share =  $('#Share');
            self.hideShare(Share);
            self.showPublish();
        });
        
        self.Create.on('click', '#socialNetworks li span.largeIcon', function(e){
            e.preventDefault();
            var type = $(this).attr('class').split(' ')[1];
            Load('/profile-settings/sharing?action=connect&oauth_provider='+type+'&for_refresh=1', false, false, refreshSharingLists, [type], false, false);
            var elem            = $('span.postTo'), 
            providersList       = elem.text(),
            parts               = providersList.split( /:\s*/);
            if(parts[1] == ''){
                providersList   = providersList+type.capitalize();
                elem.text(providersList);
                elem.parent().show();
                self.Publish.find('input[name="share"]').prop('checked', true);
            } else {
                providersList   = providersList+','+type.capitalize();
                elem.text(providersList);        
            }
        });
        
        self.Create.on('click', '#sharingList li a.right', function(e){
            e.preventDefault();    
            removeFromSharingList(this);
            var type            = $(this).parent().parent().attr('id'),
            elem                = $('span.postTo'), 
            providersList       = elem.html(),
            pos                 = providersList.indexOf(type.capitalize()),
            text                = providersList.substr(0,pos) + providersList.substr((pos+1+type.length)),
            parts               = text.split( /:\s*/);
            elem.html(text);
            if(parts[1] == ''){
                elem.parent().hide();
                self.Publish.find('input[name="share"]').prop('checked', false);
            }
        });
        
        self.Publish.find('input[name="share"]').on('click', function(e){
            var cbx = $(this);
            if(cbx.is(':checked')){
                cbx.next().next().next().show();
                $('[id^=share_to_]').removeAttr("disabled");    
            } else {
                cbx.next().next().next().hide();
                $('[id^=share_to_]').attr("disabled",true);   
            }
        });
        
        var tags            = self.Publish.find( "#tags");
        var searchTagsUrl   = self.searchTagsURL+'/'+self.platformType+'?action=search_tags';  
        
        createTagsAutocomplete(tags, searchTagsUrl, "#Publish");
        
        if(self.inTemplateCreate()){
            self.placeholderBtn.click(function(e){ e.preventDefault(); self.addPlaceHolder()});
            self.HintNavigator.find('input[name="placeholder"]').on('keyup', function(){
                self.setPlaceholderHint($(this).val());
            });
        }
    }
    
    /**
     * Selects specific image
     * from dashboard. This methods makes
     * the image active and makes resize
     * and item specific actions available.
     */
    self.selectImage = function(element){
       
        if(element.hasClass('selected'))
            return;
        
        if(element.hasClass('unselectable'))
            return;
        
        self.deselectImage();
        
        var aspectRatio;
        
        if(element.hasClass('placeholder'))
            aspectRatio = false;
        else
            aspectRatio = true;
        
        if(!self.hasTemplate){
            element.resizable({
                aspectRatio : aspectRatio,
                handles     : "ne, nw, se, sw",
                stop        : function(event, ui){
                    self.recordHistory({
                        event       : 'resize',
                        element     : ui.helper.attr('id'),
                        startWidth  : ui.originalSize.width,
                        startHeight : ui.originalSize.height,
                        startLeft   : ui.originalPosition.left,
                        startTop    : ui.originalPosition.top,
                        endWidth    : ui.size.width,
                        endHeight   : ui.size.height,
                        endLeft     : ui.position.left,
                        endTop      : ui.position.top
                    });
                }
            }).rotatable({
                end: function(degreeStart, degreeEnd){
                    self.recordHistory({
                        event       : 'rotate',
                        element     : element.attr('id'),
                        degreeEnd   : degreeEnd,
                        degreeStart : degreeStart
                    });
                }
            });
        }
        
        element.addClass('selected');
        
        if(self.inTemplateCreate() && element.hasClass('placeholder'))
            self.hintStart = $(element).find('.hint').html();
        else if(self.hasTemplate)
            element.parent().addClass('childSelected');
        
        self.applyItemNavigation(element);
        
    }
    
    /**
     * Deselects active image and sets
     * and deactivates resize and item
     * specific actions.
     */
    self.deselectImage = function(){
        self.applyItemNavigation(false);
        
        var el = self.board.find('.selected');
        
        if(el.length == 0)
            return;
        
        el.removeClass('selected');
            
        if(!self.hasTemplate)
            el.resizable("destroy").rotatable("destroy");
        else
            el.parent().removeClass('childSelected');
    
        if(self.inTemplateCreate() && el.hasClass('placeholder')){

            var hintEnd = el.find('.hint').html();
            if(self.hintStart != hintEnd){
                self.recordHistory({
                    event   : 'hint',
                    element : el.attr('id'),
                    start   : self.hintStart,
                    end     : hintEnd
                });
            }

        }
        
    }
    
    self.addDefaultItem = function(itemId,itemImg){
        
        var imgPointer = new Image();
        
        var position = self.board.position();
        
        position.left   += 350;
        position.top    += 390;
alert('addDefaultItem : ' + self.productURL+itemImg);        
        //imgPointer.src = self.productURL+itemId+'.png'; //원래있던것
        //imgPointer.src = self.productURL+'/original/'+itemImg; // 이렇게 해야되는것 아닌가??
        imgPointer.src = self.productURL+itemImg;
        
        imgPointer.onload = function(){
            self.board.find('.message').hide();
            self.addPreoloadedImage(imgPointer, itemId, 'product', itemImg, position, self.board);  
        }
        
        imgPointer.onerror = function(){
            notify('error', TranslationLabels['cannot_load_image']);
        };
        
        beforeLeave(true);
        
    }
    
    /**
     * Add image to dashboards with
     * image predload technique
     */
    self.add = function(element, position, target){
        
        var itemId     = element.find('input[name^="itemId"]').val();
        var itemOrigin = element.find('input[name^="itemOrigin"]').val();
        var itemImg    = element.find('input[name^="itemImg"]').val();
        
        var imgPointer = new Image();
        
        if(self.hasTemplate && itemOrigin == 'embellishment'){
            notify('warning', TranslationLabels['placeholder_accepts_only_products']);
            return;
        }
        
        if( self.hasTemplate && (itemOrigin == 'product' || itemOrigin == 'embellishment') && target.attr('id') == self.board.attr('id'))
            return;
        
//alert(self.productURL);

        if(itemOrigin === 'product'){
            //imgPointer.src = self.productURL+itemId+'.png';
            imgPointer.src = self.productURL+'/original/'+itemImg;
        }else if(itemOrigin === 'embellishment'){
            //imgPointer.src = self.embellishmentURL+itemId+'.png';
            imgPointer.src = self.embellishmentURL+'/original/'+itemImg;
        }else if( $.inArray(itemOrigin, ['set', 'set_draft', 'template_create', 'template_create_draft', 'template']) != -1){
            self.ajaxLoadData(itemId, itemOrigin, itemImg);
            return;
        }
        
        imgPointer.onload = function(){
            self.addPreoloadedImage(imgPointer, itemId, itemOrigin, itemImg, position, target);  
        }
        
        imgPointer.onerror = function(){
            notify('error', TranslationLabels['cannot_load_image']);
        };

        beforeLeave(true);
        
    }
    
    /**
     * Adds preloaded image to dashboard,
     * selects it and records action to
     * history stack
     */
    self.addPreoloadedImage = function(image, itemId, itemOrigin, itemImg, position, target) {
        var imageWrapper = $('<div class="image"><img src="'+image.src+'"></div>');
        
        if(self.hasTemplate){
            var innerItem = target.find('.image');
            if(innerItem.length >0)
                self.removeItem(innerItem.attr('id'), true);
        }
    
        imageWrapper.data({
            imageURL   : image.src,
            itemId     : itemId,
            itemOrigin : itemOrigin,
            itemImg    : itemImg
        });
        
        imageWrapper.appendTo(target).hide();
        
        var left, top;
        
        if(self.hasTemplate){
            
            target.find('.hint').hide();
            
            var imageRatio = imageWrapper.width() / imageWrapper.height();
            
            if(imageWrapper.width() > target.width()){
                imageWrapper.height(target.width() / imageRatio);
            }
            
            if(imageWrapper.height() > target.height()){
                imageWrapper.height(target.height());
            }
            
            left    = (target.width() / 2) - (imageWrapper.width() / 2);
            top     = (target.height() / 2) - (imageWrapper.height() / 2);
            
            target.addClass('filled');
            
        }else{
            left    = parseInt(position.left - self.boardOffset.left - imageWrapper.width() / 2);
            top     = parseInt(position.top  - self.boardOffset.top - imageWrapper.height() / 2);
        }
        
        self.makeDraggable(imageWrapper);
        
        imageWrapper.attr('id', 'image_'+(++self.itemsCreated))
                    .css({
                        left: left+'px',
                        top: top+'px',
                        zIndex: ++self.items
                    })
                    .show();
        
        self.recordHistory({
            event       : 'add',
            element     : imageWrapper.attr('id'),
            object      : imageWrapper[0].outerHTML,
            parent      : imageWrapper.parent(),
            data        : imageWrapper.data()
        });
        
        self.selectImage(imageWrapper);
    
    }
    
    self.addImageOnInit = function(initData, target){
alert('addImageOnInit');    
        var imgPointer = new Image();

        self.items++;
        self.itemsCreated++;

        if(initData.itemOrigin === 'product')
            imgPointer.src = self.productURL+initData.itemId+'.png';
        else if(initData.itemOrigin === 'embellishment')
            imgPointer.src = self.embellishmentURL+initData.itemId+'.png';

        imgPointer.onload = function(){
            if(self.hasTemplate && target.hasClass('placeholder')){
                target.find('.hint').hide();
                target.addClass('filled');
            }
            self.addPreoloadedImageOnInit(imgPointer, initData.itemId, initData.itemOrigin, initData, target);  
        }

        imgPointer.onerror = function(){
            notify('error', TranslationLabels['cannot_load_image']);
        };
        
        beforeLeave(true);
                            
    }
    
    /**
    * Adds image on initialization
    * If platformType is not template 
    * it checks cropping, flipping and makes it draggable
    * If platfomrType is template and the item is placeholder
    * it makes it droppable so images can be put in it
    */
    self.addPreoloadedImageOnInit = function(image, itemId, itemOrigin, itemImg, initData, target) {
alert('addPreoloadedImageOnInit');
        var imageWrapper = $('<div class="image"><img src="'+image.src+'"></div>');
        
        imageWrapper.data({
            imageURL   : image.src,
            itemId     : itemId,
            itemOrigin : itemOrigin,
            itemImg    : itemImg
        });
        
        imageWrapper.appendTo(target).hide();
        
        if(initData.rotate)
            imageWrapper.rotatable(parseInt(initData.rotate));
        
        imageWrapper.attr('id', 'image_'+(++self.itemsCreated))
                    .css({
                        left: initData.cssLeft+'px',
                        top: initData.cssTop+'px',
                        zIndex: initData.zIndex
                    })
                    .height(initData.height);
                    
        if( self.hasTemplate && !initData.placeholderId ){
            imageWrapper.addClass('unselectable');
        }else{
            self.makeDraggable(imageWrapper);
        }

        if(initData.whiteBck)
            self.whiteBackground(imageWrapper.attr('id'));

        if(initData.flip)
            imageWrapper.addClass('flip');

        if(initData.flop)
            imageWrapper.addClass('flop');

        if(initData.cropType)
            self.cropImageInit(imageWrapper, initData.cropType, initData.cropPoints, initData.cropHeight);
        else
            imageWrapper.show();
        
    }
    
    /**
    * Only for template create
    * Adds placeholder on dashboard
    * and makes it draggable and resizable
    */
    self.addPlaceHolder = function(){
alert('addPlaceHolder');
        if(!self.inTemplateCreate())
            return;
        
        self.board.find('.message').hide();
        
        var placeHolder = $('<div class="image placeholder"><span class="hint">'+TranslationLabels['hint']+'</span></div>');
        
        placeHolder.data({
            itemOrigin : 'placeholder',
            hint       : TranslationLabels['hint']
        });
        
        placeHolder.appendTo(self.board).hide();
        
        var left    = 100;
        var top     = 100;
                
        self.makeDraggable(placeHolder);
        
        placeHolder.attr('id', 'image_'+(++self.itemsCreated))
                    .css({
                        left: left+'px',
                        top: top+'px',
                        zIndex: ++self.items
                    })
                    .show();
        
        self.recordHistory({
            event       : 'add',
            element     : placeHolder.attr('id'),
            object      : placeHolder[0].outerHTML
        });
        
        self.selectImage(placeHolder);
        
        beforeLeave(true);
        
    }
    
    /**
    * Sets hint on the placeholder
    */
    self.setPlaceholderHint = function(hint, element){
        
        if(!self.inTemplateCreate())
            return;
        
        var el;
        
        if(!element)
            el = self.getActive();
        else
            el = $('#'+element);
        if(el.length == 0)
            return;
        
        if(!el.hasClass('placeholder'))
            return;
        
        el.find('.hint').html(hint);
        
    }
    
    /**
     * Removes active or specific item
     * from dashboard. This method also
     * deselects item and records action
     * to history stack
     */
    self.removeItem = function(elementId, recordHistory){
        
        var el;
        
        if(elementId)
            el = self.board.find('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        if(!self.hasTemplate){
            if(el.zIndex() < self.items){
                self.board.children('.image').each(function(){
                    if($(this).zIndex() > el.zIndex()) 
                        $(this).css('z-index', $(this).zIndex()-1); 
                });
            }
        }             
        
        if(el.hasClass('selected')){
            
            el.removeClass('selected');
            
            if(!self.hasTemplate)
                el.resizable("destroy").rotatable("destroy");
            else
                el.parent().removeClass('childSelected');
            
        }

        if(!elementId || recordHistory){
            
            self.recordHistory({
                event   : 'remove',
                element : el.attr('id'),
                object  : el[0].outerHTML,
                parent  : el.parent(),
                data    : el.data()
            });
            
        }
        
        if(self.hasTemplate){
            el.parent().find('.hint').show();
            el.parent().removeClass('filled');
        }
        
        el.remove();

        self.items--;
        
        self.applyItemNavigation(false);
        
        if(self.items == 0)
            beforeLeave(false);
        
    }
    
    /**
     * Zooms in active or specific item
     * with prespecified zoom koef. Method
     * records action to history stack
     */
    self.zoomIn = function(elementId){
        
        var el;
        
        if(elementId)
            el = self.board.find('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        el.width(el.width() * self.zoomFactor);
        el.height(el.height() * self.zoomFactor);
        
        
        if(!elementId){
            self.recordHistory({
                event   : 'zoomIn',
                element : el.attr('id')
            });
        }
        
    }
    
    /**
     * Zooms out active or specific item
     * with prespecified zoom koef. Method
     * records action to history stack
     */
    self.zoomOut = function(elementId){
        
        var el;
        
        if(elementId)
            el = self.board.find('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        el.width(el.width() / self.zoomFactor);
        el.height(el.height() / self.zoomFactor);
        
        if(!elementId){
            self.recordHistory({
                event   : 'zoomOut',
                element : el.attr('id')
            });
        }
        
    }
    
    /**
     * Flips active or specific item. Method
     * records action to history stack
     */
    self.flip = function(elementId) {
        
        var el;
        
        if(elementId)
            el = self.board.find('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        el.toggleClass('flip');
        
        if(!elementId){
            self.recordHistory({
                event   : 'flip',
                element : el.attr('id')
            });
        }
        
    }
    
    /**
     * Flops active or specific item. Method
     * records action to history stack
     */
    self.flop = function(elementId) {
        
        var el;
        
        if(elementId)
            el = self.board.find('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        el.toggleClass('flop');
        
        if(!elementId){
            self.recordHistory({
                event   : 'flop',
                element : el.attr('id')
            });
        }
        
    }
    
    /**
     * Switches zIndex of active or specific item
     * and with the element with above to its zIndex.
     * Method records action to history stack
     */
    self.moveForward = function(elementId){
        
        var el;
        
        if(elementId)
            el = self.board.children('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        if(el.zIndex() >= self.items)
            return;
            
        self.board.children('.image').each(function(){
            if($(this).zIndex() == el.zIndex() + 1)
                $(this).css('z-index', el.zIndex());
        });
        
        el.css('z-index', el.zIndex() + 1);
        
        if(!elementId){
            self.recordHistory({
                event   : 'moveForward',
                element : el.attr('id')
            });
        }
          
    }
    
    /**
     * Switches zIndex of active or specific item
     * and with the element with below to its zIndex.
     * Method records action to history stack
     */
    self.moveBackward = function(elementId) {
        
        var el;
        
        if(elementId)
            el = self.board.children('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        if(el.zIndex() == 1)
            return;
            
        self.board.children('.image').each(function(){
            if($(this).zIndex() == el.zIndex() - 1)
                $(this).css('z-index', el.zIndex());
        });
        
        el.css('z-index', el.zIndex() - 1);
        
        if(!elementId){
            self.recordHistory({
                event   : 'moveBackward',
                element : el.attr('id')
            });
        }
            
    }
    
    /**
     * 배경제거
     */
    self.noBackground = function(elementId){
        var el;

        if(elementId)
            el = self.board.children('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
        
        if(!el.hasClass('whiteBackground'))
            return;
            
        el.removeClass('whiteBackground');
        
        if(!elementId){
            self.recordHistory({
                event   : 'noBackground',
                element : el.attr('id')
            });
        }    
    }
    
    /**
     * Adds white background of active or specific item.
     * Method records action to history stack
     */
    self.whiteBackground = function(elementId){
          
        var el;
        
        if(elementId)
            el = self.board.children('#'+elementId);
        else
            el = self.getActive();
        
        if(el.length == 0)
            return;
             
        if(el.hasClass('whiteBackground'))
            return;
            
        el.addClass('whiteBackground');
        
        if(!elementId){
            self.recordHistory({
                event   : 'whiteBackground',
                element : el.attr('id')
            });
        }    
    }
    
    /**
     * Executes history undo. Deslects active
     * element if needed.
     */
    self.undo = function() {
        
        if(!self.history[self.historyCurrentPointer])
            return;
        
        var history = self.history[self.historyCurrentPointer];
        
        if(history.event == 'drag'){
            $('#'+history.element).css({
               left : history.startLeft,
               top  : history.startTop
            });                      
        }else if(history.event == 'resize'){
            $('#'+history.element).css({
               left     : history.startLeft,
               top      : history.startTop,
               width    : history.startWidth,
               height   : history.startHeight
            });                      
        }else if(history.event == 'add'){
            self.removeItem(history.element);
        }else if(history.event == 'remove'){
            history.parent.append(history.object);
            if(self.hasTemplate){
                history.parent.find('.hint').hide();
                history.parent.addClass('filled');
            }
            self.board.find('#'+history.element).data(history.data);
            self.makeDraggable(self.board.find('#'+history.element));
            self.items++;
            if(self.items == 1)
                beforeLeave(true);
        }else if(history.event == 'zoomIn'){
            self.zoomOut(history.element);
        }else if(history.event == 'zoomOut'){
            self.zoomIn(history.element);
        }else if(history.event == 'moveForward'){
            self.moveBackward(history.element);
        }else if(history.event == 'moveBackward'){
            self.moveForward(history.element);
        }else if(history.event == 'flip'){
            self.flip(history.element);
        }else if(history.event == 'rotate'){
            $('#'+history.element).rotatable(history.degreeStart);
        }else if(history.event == 'flop'){
            self.flop(history.element);
        }else if(history.event == 'noBackground'){
            self.whiteBackground(history.element);
        }else if(history.event == 'whiteBackground'){
            self.noBackground(history.element);
        }else if(history.event == 'crop'){
            var el = $('#'+history.element);
            
            el.width(history.startWidth)
              .height(history.startHeight)
              .find('img').attr('src', history.startUrl);;
            
            self.clearCropData(history.element);
            
            if(history.startCropType)
                self.recordCropData(history.element, history.endCropType, history.endCropPoints, history.endCropHeight);    
            
            if($('#'+history.element).hasClass('selected')){
                self.deselectImage();
                self.selectImage($('#'+history.element));
            }
        }else if( self.inTemplateCreate() && history.event == 'hint'){
            var el = $('#'+history.element);
            el.find('.hint').html(history.start);
        }
        
        self.historyCurrentPointer--;  
        
        self.redoBtn.removeClass('inactive');
            
        if(!self.history[self.historyCurrentPointer])
            self.undoBtn.addClass('inactive');
        
        var elActive = self.getActive();
        
        if(elActive.length == 0)
            self.applyItemNavigation(false);
                
    }
    
    /**
     * Executes history redo. Deslects active
     * element if needed.
     */
    self.redo = function() {
        
        if(!self.history[self.historyCurrentPointer+1])
            return;                             
        
        var history = self.history[self.historyCurrentPointer+1];
        
        if(history.event == 'drag'){
            $('#'+history.element).css({
               left : history.endLeft,
               top  : history.endTop
            });
        }else if(history.event == 'resize'){
            $('#'+history.element).css({
               left     : history.endLeft,
               top      : history.endTop,
               width    : history.endWidth,
               height   : history.endHeight
            });                      
        }else if(history.event == 'add'){
            history.parent.append(history.object);
            if( self.hasTemplate ){
                history.parent.find('.hint').hide();
                history.parent.addClass('filled');
            }
            self.board.find('#'+history.element).data(history.data);
            self.makeDraggable(self.board.find('#'+history.element));
            self.items++;
            if(self.items == 1)
                beforeLeave(true);
        }else if(history.event == 'remove'){
            self.removeItem(history.element);
        }else if(history.event == 'zoomIn'){
            self.zoomIn(history.element);
        }else if(history.event == 'zoomOut'){
            self.zoomOut(history.element);
        }else if(history.event == 'moveForward'){
            self.moveForward(history.element);
        }else if(history.event == 'moveBackward'){
            self.moveBackward(history.element);
        }else if(history.event == 'flip'){
            self.flip(history.element);
        }else if(history.event == 'flop'){
            self.flop(history.element);
        }else if(history.event == 'rotate'){
            $('#'+history.element).rotatable(history.degreeEnd);
        }else if(history.event == 'noBackground'){
            self.noBackground(history.element);
        }else if(history.event == 'whiteBackground'){
            self.whiteBackground(history.element);
        }else if(history.event == 'crop'){
            
            $('#'+history.element)
                    .width(history.endWidth)
                    .height(history.endHeight)
                    .find('img').attr('src', history.endUrl);
            self.recordCropData(history.element, history.endCropType, history.endCropPoints, history.endCropHeight);    
            
            if($('#'+history.element).hasClass('selected')){
                self.deselectImage();
                self.selectImage($('#'+history.element));
            }
            
        }else if( self.inTemplateCreate() && history.event == 'hint'){
            var el = $('#'+history.element);
            el.find('.hint').html(history.end);
        }
        
        self.historyCurrentPointer++;
        
        self.undoBtn.removeClass('inactive');
            
        if(self.historyCurrentPointer == self.historyLastPointer)
            self.redoBtn.addClass('inactive');
        
        var elActive = self.getActive();
        
        if(elActive.length == 0)
            self.applyItemNavigation(false);
        
    }    
    
    /**
     * Makes specific element draggable
     * in the dashboard section.
     * This method is used by history
     * undo and redo methods.
     */
    self.makeDraggable = function(element){
        
        var startX, startY, startLeft, startTop;
        element.draggable({
            start: function(event, ui){
                self.selectImage(element);
                startLeft   = parseInt(element.css('left'));
                startTop    = parseInt(element.css('top'));
                startX = event.clientX;
                startY = event.clientY;
                ui.position.left = startLeft;
                ui.position.top = startTop;
            },
            drag: function(event, ui){
                
                var endX, endY, distX, distY, calcX, calcY;
                
                endX = event.clientX;
                endY = event.clientY;
                
                distX = endX - startX;
                distY = endY - startY;
                
                if( self.hasTemplate ){
                    
                    var radians;
                
                    if(!element.parent().data('rotate'))
                        radians = 0;
                    else
                        radians = element.parent().data('rotate') * Math.PI / 180;
                    
                    calcX = distX * Math.cos(radians) + distY * Math.sin(radians);
                    calcY = - distX * Math.sin(radians) + distY * Math.cos(radians);
                
                }else{
                    calcX = distX;
                    calcY = distY;
                }
                
                ui.position.left    = startLeft + calcX;
                ui.position.top     = startTop + calcY;
                
            },
            stop: function(event, ui){
                self.recordHistory({
                    event       : 'drag',
                    element     : ui.helper.attr('id'),
                    endLeft     : ui.position.left,
                    endTop      : ui.position.top,
                    startLeft   : ui.originalPosition.left,
                    startTop    : ui.originalPosition.top
                });
            }
        });   
    }
    
    /**
     * Activates or deactivates
     * item specific navigations.
     * Used when item is selected,
     * added, removed from dashboard.
     */
    self.applyItemNavigation = function(element){
        if(element !== false){
            
            if( self.hasTemplate ){
                
                self.zoomInBtn.removeClass('inactive');
                self.zoomOutBtn.removeClass('inactive');
                self.removeBtn.removeClass('inactive');
                self.flipBtn.removeClass('inactive');
                self.flopBtn.removeClass('inactive');
                
                self.ItemNavigator.hide();
                
            }else if(! self.inTemplateCreate() || !$(element).hasClass('placeholder')){
                
                self.zoomInBtn.removeClass('inactive');
                self.zoomOutBtn.removeClass('inactive');
                self.forwardBtn.removeClass('inactive');
                self.backwardBtn.removeClass('inactive');
                self.removeBtn.removeClass('inactive');
            
                self.ItemNavigator.show();
                self.noBckgBtn.html('<img src="'+element.data('imageURL')+'" />');
                self.whiteBckgBtn.html('<img src="'+element.data('imageURL')+'" />');
                self.cropBtn.find('img').remove();
                self.cropBtn.show().append('<img src="'+element.data('imageURL')+'" />');
                
                self.flipBtn.removeClass('inactive');
                self.flopBtn.removeClass('inactive');
            
            }else if(self.inTemplateCreate() && $(element).hasClass('placeholder')){
                
                self.zoomInBtn.removeClass('inactive');
                self.zoomOutBtn.removeClass('inactive');
                self.forwardBtn.removeClass('inactive');
                self.backwardBtn.removeClass('inactive');
                self.removeBtn.removeClass('inactive');
            
                self.HintNavigator.show();
                self.HintNavigator.find('input[name="placeholder"]').val(self.hintStart);
            }
            
        }else{
            self.ItemNavigator.hide();
            self.zoomInBtn.addClass('inactive');
            self.zoomOutBtn.addClass('inactive');
            self.flipBtn.addClass('inactive');
            self.flopBtn.addClass('inactive');
            self.forwardBtn.addClass('inactive');
            self.backwardBtn.addClass('inactive');
            self.removeBtn.addClass('inactive');
            if(self.inTemplateCreate()){
                self.HintNavigator.hide();
                self.HintNavigator.find('input[name="placeholder"]').blur();
            }
        }
        
    }
    
    /**
     * Starts dialog modal popup that
     * performes polygonal and rectangular crop.
     */
    self.startCrop = function(defaultCropType){
        
        var el = self.getActive();
        
        if(el.lenght == 0)
            return;
        
        showPopup(self.Crop, false, true);
        
        var cropType;
        var cropPoints;
        
        if(defaultCropType)
            cropType = defaultCropType;
        else{
            cropType    = el.data('cropType');
            cropPoints  = el.data('cropPoints');
        }
        
        if(cropType && cropType == 'rectangular'){
            self.cropPolyBtn.removeClass('active');
            self.cropRectBtn.addClass('active');
        }else{
            self.cropRectBtn.removeClass('active');
            self.cropPolyBtn.addClass('active'); 
        }
        
        self.Crop.find('#CropDashboard').html('')
                                        .crop({
                                            url         : el.data('imageURL'), 
                                            cropPoints  : cropPoints,
                                            cropType    : cropType
                                        });
                                        
        self.getTopCrops(el);
        
    }
    
    /**
     * Closes cropping dialog modal popup.
     */
    self.closeCrop = function(){
        $('#mask').click();
    }
    
    /**
     * Activates cropping and reloads image from
     * croppingURL source passing crop parameters.
     */
    self.cropImage = function(cropType, cropPoints, cropHeight){

        if(self.semaphoreCrop === true)
            return;
        
        self.semaphoreCrop = true;
        
        $('#cropImgBtn').addClass('inactive').find('span').html($('#cropImgBtn').find('input[name^="processing"]').val());
        
        var el = self.getActive();

        if(el.length == 0)
            return;
        
        var startWidth  = el.width();
        var startHeight = el.height();
        
        var startUrl = el.find('img').attr('src');
        
        var zoomKoef = el.width() / el.find('img')[0].naturalWidth;
        
        el.find('img').on('load', function(){
        
            $(this).unbind('load').unbind('error');
            self.closeCrop();
            
            $('#cropImgBtn').removeClass('inactive').find('span').html($('#cropImgBtn').find('input[name="crop"]').val());
            
            var ratio       = $(this)[0].naturalWidth / $(this)[0].naturalHeight;
            var newHeight   = $(this)[0].naturalHeight * zoomKoef;
            var newWidth    = newHeight * ratio;
            
            self.recordHistory({
                event           : 'crop',
                element         : el.attr('id'),
                startWidth      : startWidth,
                startHeight     : startHeight,
                startUrl        : startUrl,
                startCropType   : el.data('cropType'),
                startCropPoints : el.data('cropPoints'),
                startCropHeight : el.data('cropHeight'),   
                endWidth        : newWidth,
                endHeight       : newHeight,
                endUrl          : $(this).attr('src'),
                endCropType     : cropType,
                endCropPoints   : cropPoints,
                endCropHeight   : cropHeight
            });
            
            el.css({
                width: newWidth,
                height: newHeight
            });
            
            self.clearCropData(el);
            self.recordCropData(el, cropType, cropPoints, cropHeight);
            
            self.deselectImage();
            self.selectImage(el);
                        
            self.semaphoreCrop = false;
            
        }).on('error', function(){
            $(this).unbind('load').unbind('error').attr('src',startUrl);
            notify('error', TranslationLabels['cannot_load_image']);
            self.semaphoreCrop = false;
            $('#cropImgBtn').removeClass('inactive').find('span').html($('#cropImgBtn').find('input[name="crop"]').val());
        });
        
        el.find('img').attr('src', self.cropURL+'?'+decodeURIComponent($.param({itemId: el.data('itemId'), itemOrigin: el.data('itemOrigin'), cropHeight: cropHeight, cropType: cropType, cropPoints: cropPoints})));
        
    }
    
    /**
     * Saves cropping to database,
     * appends new crop to QuickCrop window to the right
     */
    self.saveImage = function(cropType, cropPoints, cropHeight){
        
        if(self.semaphoreSave === true || self.semaphoreGetCrops === true)
            return;
        
        self.semaphoreSave = true;
        
        var el = self.getActive();

        if(el.length == 0)
            return;
        
        $('#saveImgBtn').addClass('inactive').find('span').html($('#saveImgBtn').find('input[name^="saving"]').val());
        
        $('<img src="'+self.cropURL+'?'+decodeURIComponent($.param({itemId: el.data('itemId'), itemOrigin: el.data('itemOrigin'), cropHeight: cropHeight, cropType: cropType, cropPoints: cropPoints}))+'" />').on('load', function(){
            
            var image = $(this);
            
            $.ajax({
                url     : self.cropURL,
                type    : 'get',
                data    : decodeURIComponent($.param({save: 1, itemId: el.data('itemId'), itemOrigin: el.data('itemOrigin'), cropHeight: cropHeight, cropType: cropType, cropPoints: cropPoints})),
                cache   : false,
                dataType: 'json',  
                success : function(data){
                    
                    $('#saveImgBtn').removeClass('inactive').find('span').html($('#saveImgBtn').find('input[name="save"]').val());
                    
                    if(data.status == 1){
                        
                        var holder = $('<div id="'+data.msg+'" />').append(image);
                        
                        holder.prependTo(self.QuickCrop);
                        
                        holder.on('click', function(){
                            $.ajax({
                                url     : self.cropURL,
                                type    : 'get',
                                data    : $.param({hit: 1, itemId: $(this).prop('id')}),
                                cache   : false,
                                dataType: 'json',  
                                success : function(data){
                                    if(data.status == 1){
                                                
                                    }
                                }
                            });
                            
                            self.Crop.find('#CropDashboard').html('')
                                                            .crop({
                                                                url         : el.data('imageURL'), 
                                                                cropPoints  : cropPoints,
                                                                cropType    : cropType
                                                            });
                                    
                        });
                        
                        self.semaphoreSave = false;
                        
                        notify('success', TranslationLabels['crop_saved']);
                             
                    } else {
                        notify('error', data.msg);
                        self.semaphoreSave = false;
                        return;
                    }
                },
                error   : function(e){
                    notify('error', TranslationLabels['could_not_complete_request']);
                    self.semaphoreSave = false;
                    $('#saveImgBtn').removeClass('inactive').find('span').html($('#saveImgBtn').find('input[name="save"]').val());
                    return;
                }
            });
            
            
            //must bind click events on images to register hits for popularity    
            
        }).on('error', function(){
            notify('error', TranslationLabels['cannot_load_image']);
            self.semaphoreSave = false;
            return;
        });    
    }
    
    self.getTopCrops = function(el){
        
        if(self.semaphoreGetCrops === true)
            return;
        
        self.semaphoreGetCrops = true;
        
        var actionButtons = self.Crop.find('a.btn');
        
        actionButtons.addClass('hidden');
        
        $.ajax({
            url     : self.publishURL+'/'+self.platformType+'/'+el.data('itemId'),
            type    : 'get',
            data    : $.param({action: 'get_crops'}),
            cache   : false,
            dataType: 'json',  
            success : function(data){
                
                if(data.status == 1){
                    
                    self.QuickCrop.html('<img src="'+imgURL+'images/flat/ajax-loader-round.gif" id="qickCropLoader" class="hidden" />');
                    
                    var len = data.msg.length;
                    
                    if(len > 0)
                        $('#qickCropLoader').removeClass('hidden');
                    else
                        actionButtons.removeClass('hidden');    
                    
                    if(data.msg.length == 0)
                        self.semaphoreGetCrops = false;
                    
                    $.each(data.msg, function(index, value){
                        
                        var obj = jQuery.parseJSON(value);
                        
                        $('<img src="'+self.cropURL+'?'+decodeURIComponent($.param({itemId: obj.item_id, itemOrigin: obj.item_origin, cropHeight: obj.data.cropHeight, cropType: obj.crop_type, cropPoints: obj.data.cropPoints}))+'" />').on('load', function(){
                            
                            var holder = $('<div id="'+obj.id+'" class="cropImageHolder hidden" />').append($(this));
                            holder.prependTo(self.QuickCrop);
                            
                            holder.on('click', function(){
                                $.ajax({
                                    url     : self.cropURL,
                                    type    : 'get',
                                    data    : $.param({hit: 1, itemId: $(this).prop('id')}),
                                    cache   : false,
                                    dataType: 'json',  
                                    success : function(data){
                                        if(data.status == 1){
                                                    
                                        }
                                    }
                                });
                                
                                self.Crop.find('#CropDashboard').html('')
                                                                .crop({
                                                                    url         : el.data('imageURL'), 
                                                                    cropPoints  : obj.data.cropPoints,
                                                                    cropType    : obj.crop_type
                                                                });
                                        
                            });
                            
                            if(index == (len-1)){
                                $('#qickCropLoader').addClass('hidden');
                                self.QuickCrop.find('.cropImageHolder').removeClass('hidden');
                                self.semaphoreGetCrops = false;
                                actionButtons.removeClass('hidden');        
                            }
                            
                        }).on('error', function(){
                            if(index == (len-1)){
                                $('#qickCropLoader').addClass('hidden');
                                self.QuickCrop.find('.cropImageHolder').removeClass('hidden');
                                self.semaphoreGetCrops = false;
                                actionButtons.removeClass('hidden');        
                            }
                            return;
                        });
                        
                    });
                    
                }
            },
            error   : function(e){
                self.semaphoreGetCrops = false;
                actionButtons.removeClass('hidden');
                notify('error', TranslationLabels['could_not_load_crops']);
                return;
            }
        });
            
    }
    
    /**
     * Activates cropping and reloads image from
     * croppingURL source passing crop parameters.
     */
    self.cropImageInit = function(el, cropType, cropPoints, cropHeight){

        if(el.length == 0)
            return;
        
        var oldImage = new Image();
        oldImage.src = el.data('imageURL');      
        
        var zoomKoef = el.width() / oldImage.width;
        
        el.find('img').on('load', function(){
        
            $(this).unbind('load').unbind('error');
            
            el.show();
            
            self.recordCropData(el, cropType, cropPoints, cropHeight);
            
        }).on('error', function(){
            $(this).unbind('load').unbind('error').attr('src',oldImage.src);
            notify('error', TranslationLabels['cannot_load_image']);
        });
        
        el.find('img').attr('src', self.cropURL+'?'+decodeURIComponent($.param({itemId: el.data('itemId'), itemOrigin: el.data('itemOrigin'), cropHeight: cropHeight, cropType: cropType, cropPoints: cropPoints})));
        
    }
    
    /**
     * Gets active dashboard item
     */
    self.getActive = function(){
        return self.board.find('.selected');
    }
    
    /**
     * Records passed data to history stack.
     * Clears history if steps are more than
     * the history buffer.
     */
    self.recordHistory = function(event){
        
        self.undoBtn.removeClass('inactive');
        self.redoBtn.addClass('inactive');
        
        if(self.historyCurrentPointer != self.historyLastPointer){
            for(var i = self.historyCurrentPointer + 1; i <= self.historyLastPointer; i++)
                delete self.history[i];
            
            self.historyLastPointer = self.historyCurrentPointer;
        }
        
        self.history[++self.historyLastPointer] = event;
        
        self.historyCurrentPointer = self.historyLastPointer;
        
        if(self.history.length > 20)
            delete(self.history[self.historyLastPointer-20]);
        
    }

    /**
    * Removes element data
    * containing crop data
    */
    self.clearCropData = function(element){
        var el;
        
        if(typeof(element) == 'object')
            el = element;
        else
            el = $('#'+element);
        
        el.removeData("cropType");
        el.removeData("cropPoints");
        el.removeData("cropHeight");
    }
    
    /**
    * Records element data
    * containing crop data
    */
    self.recordCropData = function(element, cropType, cropPoints, cropHeight){
        
        var el;
        
        if(typeof(element) == 'object')
            el = element;
        else
            el = $('#'+element);
        
        el.data({
            cropPoints  : cropPoints,
            cropType    : cropType,
            cropHeight  : cropHeight
        });

    }
    
}