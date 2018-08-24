
/****** ELEMENT UTILS ********/

Element.prototype.addClass = function(c) {
    if(this.className.includes(c)) return;
    this.className += ' ' + c;
    return this;
};

Element.prototype.removeClass = function(c) {
    var re = new RegExp(c,"g");
    this.className = this.className.replace(re, '').replace('  ', ' ');
    return this;
};

Element.prototype.hasClass = function(c) {
    var re = new RegExp(c,"g");
    return this.className.match(re);
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
    return this;
};

Element.prototype.val = function(v) {
    var form = this.closest('form');
    var i = 0;
	
	
    if(this.tagName.toLowerCase() == 'input'){

        if(this.getAttribute('type').toLowerCase() == 'checkbox'){
            if(this.checked && v==null) return this.value;
            if(!this.checked && v==null) return null;
            this.value = v;
        }else if(this.getAttribute('type').toLowerCase() == 'radio'){
            
            var radioList = form.querySelectorAll('input[type=radio][name='+this.name+']');
            
            for(i=0; i<radioList.length; i++){
                
				var chg = null;
				
                if(radioList[i].checked && v==null){
                    return radioList[i].value;
                }else if(radioList[i].value == v && !radioList[i].checked){
                    radioList[i].checked = true;
                    chg = new Event("change");
                    radioList[i].dispatchEvent(chg);
                }else if(radioList[i].value != v && radioList[i].checked){
                    radioList[i].checked = false;
                    chg = new Event("change");
                    radioList[i].dispatchEvent(chg);
                }
            }
        }else{
            if(v==null) return this.value;
            this.value = v;
        }
    }else if(this.tagName.toLowerCase() == 'select'){
        if(v==null) return this.value;
        var opts = this.querySelectorAll('option');
        for( i=0; i<opts.length; i++){
            opts[i].selected = false;
            if(opts[i].value == v){
                opts[i].selected = true;
            }
        }
    }else if(this.tagName.toLowerCase() == 'textarea'){
        if(v==null) return this.value;
        this.value = v;
    }
};

Element.prototype.closest = function(selector) {

    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    });

    var parent;

    // traverse parents
    var el = this;
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
};

Element.prototype.data = function(n, v) {
    if(v == null){
        var ret = this.dataset[n];
        if(typeof ret == 'string' && (ret.substring(0,1) == "{" || ret.substring(0,1) == "]")){
            return JSON.parse(ret);
        }else{
            return ret;
        }
    }else if(typeof v == 'object'){
        this.dataset = JSON.stringify(v);
    }else{
        this.dataset = v;
    }
    return this;
};

/****** STRING UTILS ********/
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};