
var Log = {

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

    error: function(msg){
        Log.Page.innerHTML += '<div style="color:#dd0000;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
    },

    debug: function(msg){
        Log.Page.innerHTML += '<div style="color:#eeeeee;margin:2px 2px 6px 2px;"> - ' + msg + '</div>';
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