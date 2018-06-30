
var StartPoppins = function() {
    Intf.init();
    Caller.init()
};


// Server caller
var Caller = {
    
    afterReq: false,
    beforeReq: false,
    baseUrl : '',
    params : [],
    jwtPayload : {},

    init: function(){
        if(typeof window.localStorage['TKN'] == 'string'){
            var pos = window.localStorage['TKN'].indexOf('.') + 1;
            Caller.jwtPayload = JSON.parse(atob(window.localStorage['TKN'].substring(pos, window.localStorage['TKN'].indexOf('.', pos))));
        }
    },
    /**
     * make moopsy standard ajax calls
     * All calls send a json
     * 
     * Parameters:
     *      a: service url
     *      dt: JSON data or form id selector (#idForm)
     *      cb: Callback for response
     *      
     */
    req : function(a,dt,cb){

        if(typeof Caller.beforeReq === 'function') dt = Caller.beforeReq(dt);
        var cBack = cb;

        var data = {};
        if(typeof dt == 'string'){
            data = Caller.form2JSON(dt);
        }else if(typeof dt == 'object'){
            data = dt;
        }

        data.TKN = window.localStorage['TKN'];

        for(i in Caller.params){
            data[Caller.params[i].key] = Caller.params[i].value;
        }

        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        fetch(Caller.baseUrl + a, {
            method: "post",
            headers: headers,
            body: JSON.stringify(dt)
         }).then(response => {
             
            if (response.ok) {
                
                response.json().then( r => {

                    var jwt = r.TKN;
                    
                    if(typeof jwt == 'string'){
                        window.localStorage['TKN'] = jwt;
                        var pos = window.localStorage['TKN'].indexOf('.') + 1;
                        Caller.jwtPayload = JSON.parse(atob(window.localStorage['TKN'].substring(pos, window.localStorage['TKN'].indexOf('.', pos))));
                    }
                    
                    if(typeof Caller.afterReq === 'function'){
                        r = Caller.afterReq(r);
                        if(r === false) return;
                    }
                    if(r.messages) Message.parse(r.messages);
                    if( typeof cBack == 'function') cBack(r);
                });
            }
            if (response.status >= 100 && response.status < 200) {
                console.log("Informazioni per il client");
            }
            if (response.status >= 300 && response.status < 399) {
                console.log("Redirezione");
            }
            if (response.status >= 400 && response.status < 499) {
                Message.showNotify({text: 'Info not found.<br />Try to update Moopsy ;)', leve: 0, title: 'Warning'});
            }
            if (response.status >= 500 && response.status < 599) {
                Message.showNotify({text: 'Server error! Re-try', leve: 0, title: 'Warning'});
            }
         }).catch(error => {
            Message.showNotify({text: 'Server error! Re-try', leve: 0, title: 'Warning'});
         })

    },

    linkPost : function(a,d,t){// action, data, target

        var id = "FORM-POST-" + new Date().getTime();
        var html = '<form action="'+Caller.baseUrl+a+'" method="post" id="'+id+'"';
        if(a=='') html = '<form action="" method="post" ';
        if(t) html += 'target="' + t + '" ';
        html += '>';
        if(typeof(d)=='object') for(var i=0;i<d.length;i++){
            if( d[i].value instanceof Array ){
                for(var l=0;l<d[i].value.length;l++){
                    if (typeof d[i].value[l]=="string") d[i].value[l] = d[i].value[l].replace(/"/g, '\\');
                    html += '<input type="hidden" name="'+d[i].name+'[]" value="'+d[i].value[l]+'" />';
                }
            }else{
                if (typeof d[i].value=="string") d[i].value = d[i].value.replace(/"/g, '\'');
                html += '<input type="hidden" name="'+d[i].name+'" value="'+d[i].value+'" />';
            }
        }
        html += '</form>';
        document.querySelectorAll('body')[0].insertAdjacentHTML('beforeend', html);
        document.getElementById(id).submit();

    },

    addParam: function(k,v){
        Caller.params.push({key:k,value:v});
    },

    form2JSON : function( formId ) {

        var obj = {};
        var form = typeof formId == 'string' ? document.getElementById(formId) : formId;
		var elements = form.querySelectorAll( "input, select, textarea" );
		for( var i = 0; i < elements.length; ++i ) {
            var element = elements[i];
            if(element.type == 'radio' && !element.checked) continue;
            if(element.type == 'checkbox' && !element.checked) continue;
			var name = element.name;
			var value = element.value;

			if( name ) {
				obj[ name ] = value;
			}
		}

		return obj;
    },
    
    startFormAutoSave: function(selector){
        var form = document.querySelector(selector);
        if( !form.hasClass('FormAutoSave') ){
            form.addEventListener('change', function() {
                if( this.hasClass('FormAutoSave-Active') )
                    Caller.req(this.action, Caller.form2JSON(this));
            });
        }
        form.addClass('FormAutoSave');
        form.addClass('FormAutoSave-Active');
    },

    stopFormAutoSave: function(selector){
        var form = document.querySelector(selector);
        form.removeClass('FormAutoSave-Active');
    }
};


