semaforAjax         = false;
semaforScroll       = false;

function lastAddedLiveFunc(url, page, pages, div, pageParam, callback){
    
    var self = this;
    
    self.page   = page;
    self.pages  = pages;
    self.url    = url;
    self.div    = div;
                             
    self.loadPage = function(){ 
        
        var data = new Object;
        
        if(pageParam)
            data[pageParam] = self.page+1;   
        else
            data.page = self.page+1;
        
        if(self.page >= self.pages)
            return;
        
        if(semaforAjax == true)
            return false;            
        
        semaforAjax = true;
                
        $('div#lastPostsLoader').show();
        
        $.ajax({
            url: self.url,
            data: data,
            cache: true,
            type: 'get',
            dataType: "json",
            async : true,
            success: function(data){
                if(data.page <= data.pages){
                    $('#'+div).append(data.html);       
                    self.page   = data.page;
                    self.pages  = data.pages;
                }                 
                
                $('div#lastPostsLoader').hide(); 
                
                if(callback)
                    callback(data);
                   
                semaforAjax = false;
            },
            error: function(e, xhr){
                alert('Fail Callback!');
                semaforAjax = false;
                $('div#lastPostsLoader').hide();
            }
        });    
    }
    
};