(function($) {

    $.myTabs = function(el, options) {
        
        var base            = this;
        base.$el            = $(el);
        base.$nav           = base.$el.find(".tabs");
        base.semaphore      = false;
        base.loaded         = new Array();
        
        base.loadIt = function(){
            var active = base.$nav.find('.active');
            
            if(active.length == 0)
                return;
            
            if(base.semaphore)
                return;
                    
            base.semaphore = true;
            
            var activeId = active.attr('id');
            
            var postData;
            
            if(options.post)
                postData = options.post;
            
            var contentElement = base.$el.find('#'+activeId+'_content');
            
            contentElement.show().html(TranslationLabels['loading']+'...');
            
            $.ajax({
                url: options.load,
                data: postData,
                method: 'post',
                dataType: 'json',
                success: function(response){
                    contentElement.html(response.html);
                    base.$el.data('lastURL', options.load); 
                    base.$el.data('lastPostData', postData); 
                    base.semaphore = false;
                },
                error: function(){
                    contentElement.html('');
                    base.semaphore = false;
                    dialogError(TranslationLabels['could_not_complete_request']); 
                }
            });
        
        }
        
        base.reload = function(){
            if(base.$el.data('lastURL')){
                if(!$.isPlainObject(options))
                    options = {};
                options.load = base.$el.data('lastURL'); 
                options.post = base.$el.data('lastPostData');
                
                base.loadIt();
            }
            return;
        }
        
        if($.type(options) === "string" && options == 'reload'){
            base.reload();
            return;    
        }
        
        if($.isPlainObject(options) && options.load){
            base.loadIt();
            return;
        }
        
        base.init = function() {
        
            base.options = $.extend({},$.myTabs.defaultOptions, options);
            
            var tabId = 1;
            base.$el.find('ul.tabs li').each(function(){
                $(this).attr('id', base.options.prefixtabs+'_'+tabId);
                $('#'+base.options.content).append('<div id="'+base.options.prefixtabs+'_'+tabId+'_content" class="tab_content"></div>');
                tabId++;
            });
            
            base.$el.find("."+base.options.classcontent).hide(); // Initially hide all content
            
            var initTab = base.$el.find("#"+base.options.tabsholder+" li[id^=" + base.options.prefixtabs + "_"+base.options.tabinit+"]").children('a'); // Activate default tab

            base.load(initTab);
            
            base.$nav.delegate("li > a", "click", function(e) {
                e.preventDefault();
                base.load($(this));
            });
            
        };
        
        base.load = function(tab){
/*
            if (tab.hasClass("active"))
                return;       
                
            if(base.semaphore)
                return;
            
            base.semaphore = true;
            
            var tabId = tab.parent().attr('id');
            var contentElement = $("#"+base.options.content).find('#'+tabId+'_content');
            
            $("#"+base.options.content).children('div').hide();

            if(base.loaded.indexOf(tabId) !== -1){
                base.resetTabs();
                tab.parent().addClass("active");
                contentElement.show();
                base.semaphore = false;
                return;
            }

            contentElement.show().html(TranslationLabels['loading']+'...');

            $.ajax({
                url: tab.attr("href"),
                dataType: 'json',
                success: function(response){
                    base.resetTabs();
                    tab.parent().addClass("active"); // Activate this
                    contentElement.html(response.html); // Show content for current tab
                    base.loaded.push(tabId);
                    base.$el.data('lastURL', tab.attr("href")); 
                    base.$el.data('lastPostData', '');
                    base.semaphore = false;
                },
                error: function(){
                    contentElement.html('');
                    base.semaphore = false;
                    dialogError(TranslationLabels['could_not_complete_request']);
                } 
            });
*/            
        };
        
        base.resetTabs = function(){
            base.$el.find("#"+base.options.tabsholder+" li[id^=" + base.options.prefixtabs + "]").removeClass("active"); //Reset active classes
        };
        
        base.init();
    };
    
    $.myTabs.defaultOptions = {
        "speed": 300,
        "prefixtabs":"tabz",
        "prefixcontent":"contentz",
        "content":"tabscontent",
        "tabinit":1,
        "tabsholder":"tabsholder2",
    };
    
    $.fn.myTabs = function(options) {
        return this.each(function() {
            (new $.myTabs(this, options));
        });
    };
    
})(jQuery);