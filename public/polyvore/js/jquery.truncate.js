(function($) {
    $.fn.trunc = function(numWords, numSymbols) {
        this.each(function() {
            var me = $(this);
            var original = me.text().trim();
            var truncated = original.split(/ \s*/);
            
            if (truncated.length <= numWords) {
                if(numSymbols && !isNaN(numSymbols)){
                    truncated = truncated.join(" ").trim();
                    if(truncated.length > numSymbols){
                        truncated = truncated.substr(0, numSymbols);
                        init();    
                    }
                } else
                    return;
            }
            
            if($.type(truncated) === "array"){
                while (truncated.length > numWords) {
                    truncated.pop();
                }
                truncated = truncated.join(" ").trim();
                init();
            }

            function expand() {
                me.empty();
                me.text(original);
                var link = $('<a href="#" class="remoteLink">'+TranslationLabels['view_less']+'</a>');
                link.click(collapse);
                me.append(link);
                return false;
            }
            
            function init() {
                if(me.hasClass('truncated'))
                    return;
                    
                collapse();
                
                return;
                        
            }

            function collapse() {
                me.empty();
                me.text(truncated + "... ");
                var link = $('<a href="#" class="remoteLink">'+TranslationLabels['view_more']+'</a>');
                link.click(expand);
                me.append(link);
                me.addClass('truncated');
                return false;
            }
        });
    };
})(jQuery);