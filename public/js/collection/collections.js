function collection(platformType){
    
    var self = this;
    
    self.platformType       = platformType;

    // Objects
    self.Create             = $('#Create');
    self.Dashboard          = $('#Dashboard');
    self.board              = $('#Board');
    self.products           = $('#Products');
    self.Navigator          = $('#Navigator');
    self.Publish            = $('#Publish');

    // URLS
    self.loadCollectionURL       = false;
    self.loadCollectionDraftURL  = false;
    self.productURL              = false;
    self.productStyleDirectory   = false;
    self.saveURL                 = false;
    self.publishURL              = false;

    // Buttons
    self.draftBtn           = self.Navigator.find('.draft');
    self.publishBtn         = self.Navigator.find('.publish');
    self.restartBtn         = self.Navigator.find('.restart');
    self.publishSubmit      = self.Publish.find('#PublishSubmit');
    self.publishClose       = self.Publish.find('#PublishClose, .close');
    
    self.minItems           = 0;
    self.maxItems           = 0;
    self.items              = 0;
    
    self.boardOffset        = self.board.offset();
    
    self.sortableIn = 0;
    
    /**
     * Object constructor
     * Initializes draggable and droppable
     * settings and delegates navitaion binds
     */
    self.init = function(){
        
        self.board.sortable({
            cursor: 'move',
            items: '.collectionItem',
            tolerance: "pointer",
            receive: function(event, ui){
                $(this).find('.message').hide();
                if(ui.item.hasClass('ui-draggable')){
                    var origin = ui.item.find('input[name="itemOrigin"]').val();
                    if(origin == 'collection')
                        $(this).sortable( "option", "items", ".collectionItem" );
                }
                self.sortableIn = 1;
                self.items++;
                //beforeLeave(true);
            },
            over: function(event, ui){
                self.sortableIn = 1;
            },
            out: function(event, ui){
                self.sortableIn = 0;
            },
            beforeStop: function(event, ui){
                if (self.sortableIn == 0){
                    if($(this).find(ui.item).length > 0)
                        self.items--;    
                    ui.item.remove();
                    if(self.items == 0)
                        beforeLeave(false);
                }
            },
            stop: function(event, ui) {
                if(ui.item.hasClass('ui-draggable')){
                    var itemId  = ui.item.find('input[name="itemId"]').val(),
                    itemImg     = ui.item.find('input[name="itemImg"]').val(),
                    itemAPI     = ui.item.find('input[name="itemAPI"]').val(),
                    itemURL     = ui.item.find('input[name="itemURL"]').val(),
                    origin      = ui.item.find('input[name="itemOrigin"]').val();
                    
                    ui.item.replaceWith(self.create(itemId,itemImg,itemAPI,itemURL,origin));
                }
                
                $(this).enableSelection();    
            },
            update: function(event, ui){
                if(ui.item.hasClass('ui-draggable')){
                    var itemId  = ui.item.find('input[name="itemId"]').val(),
                    itemImg     = ui.item.find('input[name="itemImg"]').val(),
                    itemAPI     = ui.item.find('input[name="itemAPI"]').val(),
                    itemURL     = ui.item.find('input[name="itemURL"]').val(),
                    origin      = ui.item.find('input[name="itemOrigin"]').val();
                    
                    if(origin === 'collection' || origin == 'draft'){
                        ui.item.remove();
                        self.items--;    
                    }   
                    
                    if($(this).find('#'+origin+'_'+itemId).length > 0){
                        var warning = notify('warning', sprintf(TranslationLabels['this_%s_is_already_in_the_collection'], origin));
                        ui.item.remove();
                        self.items--;
                    }
                    
                    if(self.items > self.maxItems){
                        var warning = notify('warning', TranslationLabels['above_max_item_for_collection']);
                        ui.item.remove();
                        self.items--;    
                    }
                       
                }         
            },
            zIndex: 999,
            opacity: 0.7,
            helper: "clone", 
            appendTo: "body"
        });
        
        self.board.disableSelection();
        
        self.products.on('mouseover', 'ul.items li', function(){
            if(!$(this).is(":ui-draggable")){
                $(this).draggable({
                    cursor: "move",
                    connectToSortable: "#Board", 
                    helper: "clone",
                    opacity: 0.5,
                    zIndex: 999,
                    start: function(event, ui){
                        if(ui.helper.hasClass('ui-draggable')){
                            var origin = ui.helper.find('input[name="itemOrigin"]').val();
                            if(origin == 'collection')
                                self.board.sortable( "option", "items", "> li" );
                        }
                    },
                    stop: function(event, ui){
                        if(ui.helper.hasClass('ui-draggable')){
                            var origin = ui.helper.find('input[name="itemOrigin"]').val();
                            if(origin == 'collection')
                                self.board.sortable( "option", "items", ".collectionItem" );
                        }
                    },
                    revert: function(valid) {
                        if(!valid) {
                            //Dropped outside of valid droppable so remove from board
                        }
                    }
                });
            }
        });                
        
        self.binds();
        
    }
    
    self.create = function(itemId,itemImg,itemAPI,itemURL,origin,caption){
        
        var imageSrc;
        
        if(origin === 'product'){
            //imageSrc = self.productURL+'/original/'+itemImg;
            imageSrc = self.productURL+self.productStyleDirectory+itemImg;
        }else if(origin === 'set'){
            //imageSrc = self.setURL+'/original/'+itemImg;
            imageSrc = self.setURL+self.productStyleDirectory+itemImg;
        }else if(origin === 'collection' || origin == 'draft'){
            self.ajaxLoadCollection(itemId, itemImg, itemAPI, itemURL, origin);
        }
        
        var html = '<div id="'+origin+'_'+itemId+'" class="collectionItem">'+
                   '<div class="reject"></div>'+
                   '<img src="'+imageSrc+'" />'+
                   '<div class="clear"></div>'+
                   '<input type="hidden" name="img_'+origin+'_'+itemId+'" value="'+itemImg+'" />'+
                   '<input type="hidden" name="api_'+origin+'_'+itemId+'" value="'+itemAPI+'" />'+
                   '<input type="hidden" name="url_'+origin+'_'+itemId+'" value="'+itemURL+'" />'+
                   '<textarea class="login-input" name="caption_'+origin+'_'+itemId+'">'+((caption) ? caption : 'Caption:')+'</textarea>'+
                   '</div>';
        return html;

    }
    
    /**
     * Clears dashboard
     */
    self.restart = function(){
        
        self.board.find('.collectionItem').remove();
        self.board.find('.message').show();
        
        self.items = 0;
        
        beforeLeave(false);
        
        self.initCollection(null);
    }
    
    self.ajaxLoadCollection = function(collectionId, collectionImg, origin){
        
        var loadURL = ((origin && origin == 'collection') ? self.loadCollectionURL : self.loadCollectionDraftURL+'/collection_draft');
        
        $.ajax({
            url         : loadURL+'/'+collectionId,
            dataType    : 'json',
            success: function(json){
                if(json.status == true)
                    self.initCollection(json.msg, origin);
                else
                    var error = notify('error', json.msg); 
            },
            error: function(){
                var error = notify('error', TranslationLabels['could_not_load']+origin);
                self.restart();
            } 
        });  
    }
    
    self.initCollection = function(oCollection, type){
        
        if(oCollection){
            self.restart();
            self.board.find('.message').hide();
            self.addItems(oCollection.items);
            
            self.board.data('ID', oCollection.id);
            
            if(type && type == 'collection'){
                self.Publish.find('#name').val(oCollection.name);
                self.Publish.find('#description').val(oCollection.description);
            }
        }else{
            self.board.removeData('ID');
            self.Publish.find('#name').val('');
            self.Publish.find('#description').val('');
        }
    }
    
    self.addItems = function(items){
        
        $.each(items, function(index, value){
            var itemId      = value.item_id;
            var itemImg     = value.item_img;
            var itemOrigin  = value.origin;
            var caption     = value.caption;

            var imgPointer = new Image();
            
            self.items++;
            
            var itemHtml = self.create(itemId, itemImg, itemOrigin, caption);
            
            self.board.append(itemHtml);
            
        });
        //beforeLeave(true);
        self.board.enableSelection();
    }
    
    self.submitPublish = function(saveDraft){
        
        if(semafors['ajax'])
            return;
        
        semafors['ajax'] = true;
        
        if(self.items < self.minItems){
            var warning = notify('warning', TranslationLabels['below_max_item_for_collection']);
            semafors['ajax'] = false;
            return;    
        }
        
        beforeLeave(false);
        
        var sorted		= self.board.sortable( "serialize" );
        var imgs		= self.board.find('input').serialize();
        var captions	= self.board.find('textarea').serialize();
        
        if(sorted.indexOf('undefined') != -1){
            var warning = notify('warning', TranslationLabels['invalid_items_in_collection']);
            semafors['ajax'] = false;
            return;
        }
        
        var oauthProviders = [];
        
        self.Publish.find('input[name="oauth_providers[]"]:not(:disabled)').each(function() {
            oauthProviders.push(this.value);
        });
        
        var postData = $.param({
        	name            : self.Publish.find('input[name="name"]').val(),
            description     : self.Publish.find('textarea[name="description"]').val(),
            share           : ((self.Publish.find('input[name="share"]').is(':checked')) ? 1 : 0),
            oauth_providers : oauthProviders
        });
        
        self.publishSubmit.children('span').html(self.publishSubmit.find('input[name="inactive"]').val());
        
        var url = self.publishURL;

        /*
        var url, action = '?action=publish';
        
        
        
        if(self.platformType == 'collection' && !saveDraft)
            url = self.publishURL+'/';
        else if(self.platformType == 'collection_draft' || saveDraft)
            url = self.publishURL+'/collection_draft/';
        */
        if(self.board.data('ID'))
            url += self.board.data('ID'); 
        
        //if(saveDraft) action = '?action=draft';
            
		// ajax post 에서 세션 유지 시키기 위함
		$.ajaxSetup({
		  beforeSend: function(xhr) {
		    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
		  }
		});


        //$.ajax(url+action, {
        $.ajax(url+'?type=collect', { 
            type: 'post',
            data: sorted+'&'+imgs+'&'+captions+'&'+postData,
            cache: false,
            dataType: "json",
            success : function(json){
                
                if(json.status == true){
                    notify('success', json.msg, function(){
                        //document.location.href = json.redirect;
                    });
                    self.hidePublish();
                    self.restart();
                    self.publishSubmit.html(self.publishSubmit.find('input[name="active"]').val());
                    //if(self.items > 0) beforeLeave(true);
                    
                    return;
                }
                
                semafors['ajax'] = false;
                var error = notify('error', json.msg);
                self.publishSubmit.html(self.publishSubmit.find('input[name="active"]').val());
                //if(self.items > 0) beforeLeave(true);
        
            },
            error: function(){
                semafors['ajax'] = false;
                self.publishSubmit.children('span').html(self.publishSubmit.find('input[name="active"]').val());
                var error = notify('error', TranslationLabels['could_not_complete_request']);
                //if(self.items > 0) beforeLeave(true); 
            }
        });
    }
    
    self.showPublish = function(){        
        $('#mask').show().on('click', self.hidePublish);
        showPopup(self.Publish);
    }
    
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
     * Performes all platform binds
     */
    self.binds = function(){
        self.board.on('click', '.collectionItem .reject', function(){
            $(this).parent().remove();
            self.items--;
            if(self.items == 0)
                beforeLeave(false);
        }).on('focus', '.collectionItem textarea', function(){
            if($(this).text() == 'Caption:')
                $(this).text('');
        }).on('blur', '.collectionItem textarea', function(){
            if($(this).text() == '')
                $(this).text('Caption:');
        });
        
        self.draftBtn.on('click', function(e){ e.preventDefault(); self.submitPublish(true); });
        self.publishBtn.on('click', function(e){ e.preventDefault(); self.showPublish(); });
        self.restartBtn.on('click', function(e){ e.preventDefault(); self.restart(); });
        self.publishSubmit.on('click', function(e){ e.preventDefault(); self.submitPublish(); });
        self.publishClose.click(function(e){ e.preventDefault(); self.hidePublish(); });
        
        self.Create.find('#postToEdit').on('click', function(e){ 
            e.preventDefault(); 
             
            var Share =  $('#Share'); 
            
            self.hidePublish();
            /*
            Share.find('.close').on('click', function(){
                self.hideShare(Share);
            })
            $('#mask').show().on('click', function(){
                self.hideShare(Share);    
            });
            */
            
            showPopup(Share);
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
        
        self.Create.on('click', '#sharingList li > .action a', function(e){
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
                self.Publish.find('.wrapper-styledCheckbox').trigger('click');
            }
        });
        
        self.Publish.find('.wrapper-styledCheckbox').on('click', function(e){
            var cbx = $('input[name="share"]');
            if(cbx.is(':checked')){
                $(this).next().next().show();
                $('[id^=share_to_]').removeAttr("disabled");    
            } else {
                $(this).next().next().hide();
                $('[id^=share_to_]').attr("disabled",true);
            }
        });
                
    }
    
}