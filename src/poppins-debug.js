

var Log = {

    _category : [],

    LEVEL_DEBUG     : 0,
    LEVEL_INFO      : 1,
    LEVEL_WARNING   : 2,
    LEVEL_ERROR     : 3,
    LEVEL_SHUTDOWN  : -1,

    Page : false,

    start : function(){

        Log.Page = document.createElement("div");
        Log.Page.style.cssText = 'position:absolute;left:0;top:0;width:100%;min-height:1400px;z-index:9999999;background:#222222;';
        Log.Page.className = 'hidden';
        document.getElementsByTagName("BODY")[0].appendChild(Log.Page);

        var lnk = document.createElement("a");
        lnk.style.cssText = 'position:absolute;left:50%;top:0;z-index:9999999;color:#dd0000;padding:2px;width:100px;text-align:center;margin-left:-50px;';
        lnk.innerText = 'debug';
        lnk.addEventListener('click', Log.toggle);
        document.getElementsByTagName("BODY")[0].appendChild(lnk);

        Log.flush();

        window.onerror = function(message, url, lineNumber) {
            Log.error(message +' '+ url + ' ('+lineNumber+')');
            console.log(message +' '+ url + ' ('+lineNumber+')');
            return true;
        };
    },

    add_category: function(id, level, c, p){
        Log._category.push({id:id, level:level, console:c, page:p});
    },

    /*
        Write a log
    */
    write: function(){

        if(arguments.length < 3) return;

        var level = Log.LEVEL_SHUTDOWN;
        if(typeof arguments[0] == 'number'){
            level = arguments[0];
        }

        var level_name = 'ERROR';
        if(level == Log.LEVEL_DEBUG) level_name = 'DEBUG';
        else if(level == Log.LEVEL_INFO) level_name = 'INFO';
        else if(level == Log.LEVEL_WARNING) level_name = 'WARN';

        var cat = null;
        var found_cat = false;
        if(typeof arguments[1] == 'string'){
            for(var c in Log._category){
                if(Log._category[c].id == arguments[1]){
                    found_cat = true;
                    if(level >= Log._category[c].level){
                        cat = Log._category[c];
                    }
                }
            }
        }
        
        if(!found_cat){
            console.error('Log category not configured: ', arguments[1]);
        }

        if( cat==null && Log._category.length>0) return;

        // Console log
        if(cat.console){
            var args = [level_name + ' - ' + cat.id];
            for(var i in arguments){
                if(i<2) continue;
                args.push(arguments[i]);
            }
            if(level == Log.LEVEL_ERROR){
                console.error.apply(this, args);
            }else{
                
                console.log.apply(this, args);
            }
        }

        // Page log
        if(cat.page && Log.Page !== false){

            var msg = level_name + ' - ' + arguments[2];
            if(arguments.length > 3) for(var m=3; m<arguments.length; m++){
                msg += arguments[m];
            }

            if(level == Log.LEVEL_ERROR){
                Log.Page.innerHTML += '<div style="color:#dd0000;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
            }else if(level == Log.LEVEL_WARN){
                Log.Page.innerHTML += '<div style="color:#ff9900;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
            }else if(level == Log.LEVEL_INFO){
                Log.Page.innerHTML += '<div style="color:#4da6ff;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
            }else if(level == Log.LEVEL_DEBUG){
                Log.Page.innerHTML += '<div style="color:#f4f4f4;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
            }
        }
    },

    error: function(cat){
        var args = [Log.LEVEL_ERROR, cat];
        for(var i in arguments){
            if(i==0) continue;
            args.push(arguments[i]);
        }
        Log.write.apply(this, args);
    },

    warn: function(cat){
        var args = [Log.LEVEL_WARN, cat];
        for(var i in arguments){
            if(i==0) continue;
            args.push(arguments[i]);
        }
        Log.write.apply(this, args);
    },

    info: function(cat){
        var args = [Log.LEVEL_INFO, cat];
        for(var i in arguments){
            if(i==0) continue;
            args.push(arguments[i]);
        }
        Log.write.apply(this, args);
    },

    debug: function(cat){
        var args = [Log.LEVEL_DEBUG, cat];
        for(var i in arguments){
            if(i==0) continue;
            args.push(arguments[i]);
        }
        Log.write.apply(this, args);
    },

    open: function(){
        Log.Page.removeClass('hidden');
    },

    close: function(){
        Log.Page.addClass('hidden');
    },

    toggle: function(){
        if(Log.Page.hasClass('hidden'))
            Log.Page.removeClass('hidden');
        else
            Log.Page.addClass('hidden');
    },

    flush: function(){
        Log.Page.innerHTML = '<div class="right"><button class="btn" onclick="Log.flush()">flush</button></div>';
    }
};