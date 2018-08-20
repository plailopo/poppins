
window.onload = function() {
    Poppins.boot();
};


var Poppins = {
        
	load : 0,
	ComponentWaiting : [],

	/*
		On Boot
		- Start default l'app
		- run apps
		- lancia l'array di avvio dei component
	*/	
	boot : function(){
		
		Poppins.load = 1;
		
		Poppins.doc_parser();
		
		for( i in Poppins.ComponentWaiting ){
			Poppins.ComponentWaiting[i].load();
		}
		
		Poppins.ComponentWaiting = [];
		
		Poppins.load = 2;
		
	},
	
	doc_parser : function(){
		
		var elms = document.querySelectorAll('[p-component]');
		
		for(var i=0; i< elms.length; i++){
			console.log('new component found', elms[i])
			new PoppinsComp(elms[i]);
		}
	}
	
}


class PoppinsComp{
	
	/**
		name		: string
		e 		 	: root element
		
	BEHAVIOR: // Data and methods
		html	 	: html template
		init	 	: function(){ ... }
		
		...
		
	*/
	
 
	/**
		Constructor
		(string: selector)
		(json: behavior)
		(string: selector, json: behavior)
	
	*/
    constructor(selector, behavior){
		
		this.selector = selector;
        this.behavior = typeof behavior == 'object' ? behavior : null;
		
		if(Poppins.load < 2){
			Poppins.ComponentWaiting.push(this);
		}else{
			this.load();
		}
		
	}
		
    load(){
		
		this.e = typeof this.selector == 'string' ? document.querySelector(this.selector) : this.selector;
		
		this.template = this.e ? this.e.outerHTML : '';
		
		if( this.behavior == null ) this.behavior = {};
		
        this.render();
    }
	
	render(){
		
		if(this.e == null) return;
		
		if(!this.e.hasAttribute('p-component')){
			this.e.setAttribute('p-component', this.e.tagName);
		}
		
		this.e.p_component = this;
		
		// p-data
		var elms = this.e.querySelectorAll('[p-data]');
		
		for(var i=0; i< elms.length; i++){
			var name_param = elms[i].getAttribute("p-data");
			elms[i].innerHTML = eval( 'this.behavior.' + name_param );
		}
		
		// p-bind
		var elms = this.e.querySelectorAll('[p-bind]');
		
		for(var i=0; i< elms.length; i++){
			
			var name_param = elms[i].getAttribute("p-bind");
			var params = name_param.split("#");
			if(params.length != 2) continue;
			elms[i].p_function_bind = params[1];
			elms[i].addEventListener(params[0], function(ev){
				
				var compRoot = this.closest('[p-component]');
				var comp = compRoot.p_component;
				
				var toFire = eval( 'comp.behavior.' + this.p_function_bind );
				
				if(typeof toFire == 'function'){
					toFire(this, ev, comp);
				}else{
					eval( 'comp.behavior.' + this.p_function_bind + ' = this.val()');
					//toFire  = this.val();
				}
			})
		}
		
		// p-data-bind
		var elms = this.e.querySelectorAll('[p-data-bind]');
		
		if( typeof this.dataBinder == 'undefined' )
			this.dataBinder = [];
		
		for(var i=0; i< elms.length; i++){
		
			var dataToBind = elms[i].getAttribute('p-data-bind');
			
			if( typeof this.dataBinder[dataToBind] == 'undefined' )
				this.dataBinder[dataToBind] = [];
			
			this.dataBinder[dataToBind].push(elms[i]);
			
			var self = this.dataBinder[dataToBind];
			Object.defineProperty(this.behavior, elms[i].getAttribute('p-data-bind'), {
				configurable: true,
				/*
				get: function() {
					return firstName + ' ' + lastName;
				},
				*/
				set: function(v) {
					this.value = v;
					
					for(i in self){
						self[i].innerHTML = v;
					}
					console.log('set')
					/*
					var vrbl = self.getAttribute('p-data-bind');
					var elms = document.querySelectorAll('[p-data-bind="'+vrbl+'"]');
					for(var i=0; i< elms.length; i++){
						elms[i].innerHTML = v;
					}
					*/
				}
			});
		}
		
		
		/*
		var rex = /\{[\ ]*[A-Za-z]{1}[A-Za-z0-9]*[\ ]*\}/g;
		var m;
		
		do {
			m = rex.exec(this.template);
			if (m) {
				m = m[0].substring(1, m[0].length - 1).trim();
				
			}
		} while (m);
		*/
		
	}
	
};
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
            console.log(message +' '+ url + ' ('+lineNumber+')')
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
}

Element.prototype.val = function(v) {
    var form = this.closest('form');
    
    if(this.tagName.toLowerCase() == 'input'){

        if(this.getAttribute('type').toLowerCase() == 'checkbox'){
            if(this.checked && v==null) return this.value;
            if(!this.checked && v==null) return null;
            this.value = v;
        }else if(this.getAttribute('type').toLowerCase() == 'radio'){
            
            var radioList = form.querySelectorAll('input[type=radio][name='+this.name+']');
            
            for(var i=0; i<radioList.length; i++){
                
                if(radioList[i].checked && v==null){
                    return radioList[i].value;
                }else if(radioList[i].value == v && !radioList[i].checked){
                    radioList[i].checked = true;
                    var chg = new Event("change");
                    radioList[i].dispatchEvent(chg);
                }else if(radioList[i].value != v && radioList[i].checked){
                    radioList[i].checked = false;
                    var chg = new Event("change");
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
        for(var i=0; i<opts.length; i++){
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
    })

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
}

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
}

/****** STRING UTILS ********/
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};;
var exitPageEvent = new Event('exit-page');
var enterPageEvent = new Event('enter-page');
var Intf = {

    ChangingView : false,
    Navigator : [],
    HomePage : 'home',

    init: function(){

        Intf.form.initRadio();
        Intf.form.initCheckbox();

        if(window.location.toString().indexOf("#") > 0 )
            window.location = window.location.toString().split("#")[0];

        window.addEventListener('hashchange', function(){
            var str = window.location.hash.slice(1);
            if(str.length>2){
                if(str.substring(0, 2) == "./"){
                    eval( str.substring(2) + '()' );
                }else if(str.substring(0, 2) == "TV"){
                    Intf.toggleView(str.slice(2));
                }else{
                    Intf.changeView(str);
                }
            }
        });

        var lknToogleViews = document.querySelectorAll("[intf-toggleview]");
        if(lknToogleViews.length > 0){
            lknToogleViews[0].addEventListener('click', function() {
                Intf.toggleView(this.getAttribute("intf-toggleview"));
            });
        }
        
    },

    height: function(){
        return "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 
    },

    width: function(){
        return "innerWidth" in window ? window.innerWidth: document.documentElement.offsetWidth; 
    },

    getActiveView : function(){
        var pages = document.querySelectorAll(".page-view.active");
        return pages.length > 0 ? pages[0].id.substring(5) : '';
    },

    changeView : function(view, fx){

        if( Intf.ChangingView ) return;

        var pageOut = document.querySelector(".page-view.active");
		var pageIn = document.getElementById('VIEW-' + view.toUpperCase());
		
		if(pageOut.id == pageIn.id) return;

		Intf.ChangingView = true;
        
        var transition = Intf.transitionFx(fx);

        var outClass = transition[0];
        var inClass  = transition[1];

        Intf.Navigator.push(view);

        setTimeout(Intf.changeViewEnd, 1000);
        pageOut.addClass( outClass ).addClass('exiting');
        pageOut.animationClass = outClass;
        pageOut.dispatchEvent(exitPageEvent);
        
        pageIn.addEventListener( 'animationend', Intf.changeViewEnd);
        pageIn.addClass('active').addClass( inClass )
        pageIn.animationClass = inClass;
    },

    changeViewEnd: function(){
        if(!Intf.ChangingView) return;
        var pageOut = document.querySelector(".page-view.active.exiting");
        pageOut.removeClass('active').removeClass('exiting');
        pageOut.removeClass(pageOut.animationClass);

        var pageIn = document.querySelector(".page-view.active");
        pageIn.removeClass(pageIn.animationClass);
        pageIn.dispatchEvent(enterPageEvent);
        Intf.ChangingView = false;
    },

    backView : function(fx){
        Intf.Navigator.pop();
        var pg = Intf.Navigator.pop();
        Intf.changeView(pg == null ? Intf.HomePage : pg, fx);
    },

    flushNavigator : function(){
        Intf.Navigator = [];
    },

    transitionFx : function(fx){

        var outClass = '';
        var inClass  = '';

        if(fx == null) fx = 'pushLeft';

		switch( fx ) {

            case 'fade' :
                outClass = 'page-fx-fadeOut';
                inClass = 'page-fx-fadeIn';
                break;
			case 'slideLeft':
				outClass = 'page-fx-moveToLeft';
				inClass = 'page-fx-moveFromRight';
				break;
			case 'slideRight':
				outClass = 'page-fx-moveToRight';
				inClass = 'page-fx-moveFromLeft';
				break;
			case 'slideTop':
				outClass = 'page-fx-moveToTop';
				inClass = 'page-fx-moveFromBottom';
				break;
			case 'slideBottom':
				outClass = 'page-fx-moveToBottom';
				inClass = 'page-fx-moveFromTop';
				break;
			case 'fadeSlideLeft':
				outClass = 'page-fx-fade';
				inClass = 'page-fx-moveFromRight page-fx-ontop';
				break;
			case 'fadeSlideRight':
				outClass = 'page-fx-fade';
				inClass = 'page-fx-moveFromLeft page-fx-ontop';
				break;
			case 'fadeSlideTop':
				outClass = 'page-fx-fade';
				inClass = 'page-fx-moveFromBottom page-fx-ontop';
				break;
			case 'fadeSlideBottom':
				outClass = 'page-fx-fade';
				inClass = 'page-fx-moveFromTop page-fx-ontop';
				break;
			case 'fade2SlideLeft':
				outClass = 'page-fx-moveToLeftFade';
				inClass = 'page-fx-moveFromRightFade';
				break;
			case 'fade2SlideRight':
				outClass = 'page-fx-moveToRightFade';
				inClass = 'page-fx-moveFromLeftFade';
				break;
			case 'fade2SlideTop':
				outClass = 'page-fx-moveToTopFade';
				inClass = 'page-fx-moveFromBottomFade';
				break;
			case 'fade2SlideBottom':
				outClass = 'page-fx-moveToBottomFade';
				inClass = 'page-fx-moveFromTopFade';
				break;
			case 'pushLeft':
				outClass = 'page-fx-moveToLeftEasing page-fx-ontop';
				inClass = 'page-fx-moveFromRight';
				break;
			case 'pushRight':
				outClass = 'page-fx-moveToRightEasing page-fx-ontop';
				inClass = 'page-fx-moveFromLeft';
				break;
			case 'pushTop':
				outClass = 'page-fx-moveToTopEasing page-fx-ontop';
				inClass = 'page-fx-moveFromBottom';
				break;
			case 'pushBottom':
				outClass = 'page-fx-moveToBottomEasing page-fx-ontop';
				inClass = 'page-fx-moveFromTop';
				break;
			case 'scaleSlideLeft':
				outClass = 'page-fx-scaleDown';
				inClass = 'page-fx-moveFromRight page-fx-ontop';
				break;
			case 'scaleSlideRight':
				outClass = 'page-fx-scaleDown';
				inClass = 'page-fx-moveFromLeft page-fx-ontop';
				break;
			case 'scaleSlideTop':
				outClass = 'page-fx-scaleDown';
				inClass = 'page-fx-moveFromBottom page-fx-ontop';
				break;
			case 'scaleSlideBottom':
				outClass = 'page-fx-scaleDown';
				inClass = 'page-fx-moveFromTop page-fx-ontop';
				break;
			case 'scaleDown':
				outClass = 'page-fx-scaleDown';
				inClass = 'page-fx-scaleUpDown page-fx-delay300';
				break;
			case 'scaleUp':
				outClass = 'page-fx-scaleDownUp';
				inClass = 'page-fx-scaleUp page-fx-delay300';
				break;
			case 'slideLeftScale':
				outClass = 'page-fx-moveToLeft page-fx-ontop';
				inClass = 'page-fx-scaleUp';
				break;
			case 'slideRightScale':
				outClass = 'page-fx-moveToRight page-fx-ontop';
				inClass = 'page-fx-scaleUp';
				break;
			case 'slideTopScale':
				outClass = 'page-fx-moveToTop page-fx-ontop';
				inClass = 'page-fx-scaleUp';
				break;
			case 'slideBottomScale':
				outClass = 'page-fx-moveToBottom page-fx-ontop';
				inClass = 'page-fx-scaleUp';
				break;
			case 'scaleDownUp':
				outClass = 'page-fx-scaleDownCenter';
				inClass = 'page-fx-scaleUpCenter page-fx-delay400';
				break;
			case 'glueLeft':
				outClass = 'page-fx-rotateRightSideFirst';
				inClass = 'page-fx-moveFromRight page-fx-delay200 page-fx-ontop';
				break;
			case 'glueRight':
				outClass = 'page-fx-rotateLeftSideFirst';
				inClass = 'page-fx-moveFromLeft page-fx-delay200 page-fx-ontop';
				break;
			case 'glueTop':
				outClass = 'page-fx-rotateTopSideFirst';
				inClass = 'page-fx-moveFromTop page-fx-delay200 page-fx-ontop';
				break;
			case 'glueBottom':
				outClass = 'page-fx-rotateBottomSideFirst';
				inClass = 'page-fx-moveFromBottom page-fx-delay200 page-fx-ontop';
				break;
			case 'flipLeft':
				outClass = 'page-fx-flipOutRight';
				inClass = 'page-fx-flipInLeft page-fx-delay500';
				break;
			case 'flipRight':
				outClass = 'page-fx-flipOutLeft';
				inClass = 'page-fx-flipInRight page-fx-delay500';
				break;
			case 'flipTop':
				outClass = 'page-fx-flipOutTop';
				inClass = 'page-fx-flipInBottom page-fx-delay500';
				break;
			case 'flipBottom':
				outClass = 'page-fx-flipOutBottom';
				inClass = 'page-fx-flipInTop page-fx-delay500';
				break;
			case 'fall':
				outClass = 'page-fx-rotateFall page-fx-ontop';
				inClass = 'page-fx-scaleUp';
				break;
			case 'newsPaper':
				outClass = 'page-fx-rotateOutNewspaper';
				inClass = 'page-fx-rotateInNewspaper page-fx-delay500';
				break;
			case 'doorPushLeft':
				outClass = 'page-fx-rotatePushLeft';
				inClass = 'page-fx-moveFromRight';
				break;
			case 'doorPushRight':
				outClass = 'page-fx-rotatePushRight';
				inClass = 'page-fx-moveFromLeft';
				break;
			case 'doorPushTop':
				outClass = 'page-fx-rotatePushTop';
				inClass = 'page-fx-moveFromBottom';
				break;
			case 'doorPushBottom':
				outClass = 'page-fx-rotatePushBottom';
				inClass = 'page-fx-moveFromTop';
				break;
			case 'doorLeft':
				outClass = 'page-fx-rotatePushLeft';
				inClass = 'page-fx-rotatePullRight page-fx-delay180';
				break;
			case 'doorRight':
				outClass = 'page-fx-rotatePushRight';
				inClass = 'page-fx-rotatePullLeft page-fx-delay180';
				break;
			case 'doorTop':
				outClass = 'page-fx-rotatePushTop';
				inClass = 'page-fx-rotatePullBottom page-fx-delay180';
				break;
			case 'doorBottom':
				outClass = 'page-fx-rotatePushBottom';
				inClass = 'page-fx-rotatePullTop page-fx-delay180';
				break;
			case 'foldOutLeft':
				outClass = 'page-fx-rotateFoldLeft';
				inClass = 'page-fx-moveFromRightFade';
				break;
			case 'foldOutRight':
				outClass = 'page-fx-rotateFoldRight';
				inClass = 'page-fx-moveFromLeftFade';
				break;
			case 'foldOutTop':
				outClass = 'page-fx-rotateFoldTop';
				inClass = 'page-fx-moveFromBottomFade';
				break;
			case 'foldOutBottom':
				outClass = 'page-fx-rotateFoldBottom';
				inClass = 'page-fx-moveFromTopFade';
				break;
			case 'foldInLeft':
				outClass = 'page-fx-moveToRightFade';
				inClass = 'page-fx-rotateUnfoldLeft';
				break;
			case 'foldInRight':
				outClass = 'page-fx-moveToLeftFade';
				inClass = 'page-fx-rotateUnfoldRight';
				break;
			case 'foldInTop':
				outClass = 'page-fx-moveToBottomFade';
				inClass = 'page-fx-rotateUnfoldTop';
				break;
			case 'foldInBottom':
				outClass = 'page-fx-moveToTopFade';
				inClass = 'page-fx-rotateUnfoldBottom';
				break;
			case 'roomLeft':
				outClass = 'page-fx-rotateRoomLeftOut page-fx-ontop';
				inClass = 'page-fx-rotateRoomLeftIn';
				break;
			case 'roomRight':
				outClass = 'page-fx-rotateRoomRightOut page-fx-ontop';
				inClass = 'page-fx-rotateRoomRightIn';
				break;
			case 'roomTop':
				outClass = 'page-fx-rotateRoomTopOut page-fx-ontop';
				inClass = 'page-fx-rotateRoomTopIn';
				break;
			case 'roomBottom':
				outClass = 'page-fx-rotateRoomBottomOut page-fx-ontop';
				inClass = 'page-fx-rotateRoomBottomIn';
				break;
			case 'cubeLeft':
				outClass = 'page-fx-rotateCubeLeftOut page-fx-ontop';
				inClass = 'page-fx-rotateCubeLeftIn';
				break;
			case 'cubeRight':
				outClass = 'page-fx-rotateCubeRightOut page-fx-ontop';
				inClass = 'page-fx-rotateCubeRightIn';
				break;
			case 'cubeTop':
				outClass = 'page-fx-rotateCubeTopOut page-fx-ontop';
				inClass = 'page-fx-rotateCubeTopIn';
				break;
			case 'cubeBottom':
				outClass = 'page-fx-rotateCubeBottomOut page-fx-ontop';
				inClass = 'page-fx-rotateCubeBottomIn';
				break;
			case 'carouselLeft':
				outClass = 'page-fx-rotateCarouselLeftOut page-fx-ontop';
				inClass = 'page-fx-rotateCarouselLeftIn';
				break;
			case 'carouselRight':
				outClass = 'page-fx-rotateCarouselRightOut page-fx-ontop';
				inClass = 'page-fx-rotateCarouselRightIn';
				break;
			case 'carouselTop':
				outClass = 'page-fx-rotateCarouselTopOut page-fx-ontop';
				inClass = 'page-fx-rotateCarouselTopIn';
				break;
			case 'carouselBottom':
				outClass = 'page-fx-rotateCarouselBottomOut page-fx-ontop';
				inClass = 'page-fx-rotateCarouselBottomIn';
				break;
			case 'slide1':
				outClass = 'page-fx-rotateSidesOut';
				inClass = 'page-fx-rotateSidesIn page-fx-delay200';
				break;
			case 'slide2':
				outClass = 'page-fx-rotateSlideOut';
				inClass = 'page-fx-rotateSlideIn';
				break;

        }
        
        return [outClass, inClass];
    },

    data2HTML: function(id, data){

        if(typeof id == 'string')
            id = document.getElementById(id);

        id.querySelectorAll('[data-value]').forEach(function(e){
            e.innerHTML = '';
            if(data.hasOwnProperty(e.dataset.value)){
                eval('var val = data.' + e.dataset.value);
                e.innerHTML = val;
            }
        });

    },

    data2FORM: function(id, data){

        if(typeof id == 'string')
            id = document.getElementById(id);

        id.querySelectorAll('input, textarea, select').forEach(function(e){
            if(data.hasOwnProperty(e.name)){
                eval('var val = data.' + e.name);
                e.val(val);
            }
        });

    }
};


Intf.form = {
    initRadio: function(){
        var forms = document.querySelectorAll("form");

        for(var f=0; f < forms.length; f++){

            var rndsFound = forms[f].querySelectorAll("input[type=radio]");

            for(var r=0; r<rndsFound.length; r++){
                rndsFound[r].className += ' hidden';
                var btn = document.createElement("button");
                btn.className = 'btn' + (rndsFound[r].dataset.class ? ' '+rndsFound[r].dataset.class : '');
                btn.type = 'button';
                btn.radioLink = rndsFound[r];
                btn.innerHTML = rndsFound[r].dataset.label ? rndsFound[r].dataset.label : '???';
                btn.disabled = rndsFound[r].disabled;
                btn.className += rndsFound[r].checked ? ' active' : '';
                btn.MyForm = forms[f];
                btn.aloneActive = rndsFound[r].dataset.aloneactive ? true : false;
                if(btn.aloneActive && !rndsFound[r].checked){
                    btn.className += ' hidden';
                }
                rndsFound[r].btnLink = btn;
                btn.addEventListener('click', function(){
                    var radio = this.radioLink;
                    var clickedN = 0;
                    var list = this.MyForm.querySelectorAll('input[type=radio][name='+radio.name+']');
                    for(var i=0;i<list.length;i++){
                        if(list[i].value == radio.value) clickedN = i;
                        list[i].btnLink.removeClass('active');
                        if(this.aloneActive){
                            list[i].btnLink.addClass('hidden');
                        }
                    }
                    if(this.aloneActive){
                        clickedN++;
                        if(clickedN >= list.length) clickedN=0;
                        list[clickedN].btnLink.addClass('active');
                        list[clickedN].btnLink.removeClass('hidden');
                        list[clickedN].checked = true;
                    }else{
                        radio.checked = true;
                        this.addClass('active');
                        this.removeClass('hidden');
                    }
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    this.closest('form').dispatchEvent(evt);
                })
                rndsFound[r].addEventListener('change', function() {
                    var list = this.btnLink.MyForm.querySelectorAll('input[type=radio][name='+this.name+']');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked) {
                            list[i].btnLink.addClass('active')
                            list[i].btnLink.removeClass('hidden');
                        } else {
                            list[i].btnLink.removeClass('active')
                            list[i].btnLink.addClass('hidden');
                        }
                        
                    }

                });
                rndsFound[r].parentNode.insertBefore(btn, rndsFound[r].nextSibling);
            }
        }
    },

    initCheckbox: function(){
        var forms = document.querySelectorAll("form");

        for(var f=0; f < forms.length; f++){

            var chksFound = forms[f].querySelectorAll("input[type=checkbox]");

            for(var r=0; r<chksFound.length; r++){
                chksFound[r].className += ' hidden';
                var btn = document.createElement("button");
                btn.className = 'btn' + (chksFound[r].dataset.class ? ' '+chksFound[r].dataset.class : '');
                btn.type = 'button';
                btn.checkLink = chksFound[r];
                btn.innerHTML = '<i class="fas fa-'+( chksFound[r].checked ? 'check' : 'square' )+'"></i>';
                btn.disabled = chksFound[r].disabled;
                btn.MyForm = forms[f];
                chksFound[r].btnLink = btn;
                btn.addEventListener('click', function(){
                    var check = this.checkLink;
                    if(check.checked){
                        check.checked = false;
                        this.removeClass('active')
                    }else{
                        check.checked = true;
                        this.addClass('active')
                    }
                    this.innerHTML = '<i class="fas fa-'+( check.checked ? 'check' : 'square' )+'"></i>';
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    this.closest('form').dispatchEvent(evt);
                })
                chksFound[r].addEventListener('change', function() {
                    this.btnLink.innerHTML = '<i class="fas fa-'+( this.checked ? 'check' : 'square' )+'"></i>';
                    if(this.checked){
                        this.btnLink.addClass('active')
                    }else{
                        this.btnLink.removeClass('active')
                    }
                });
                chksFound[r].parentNode.insertBefore(btn, chksFound[r].nextSibling);
            }
        }
    }

}
;
var Message = {

    parse : function(j){

        if(!Array.isArray(j)) return;

        for(i in j){
            if(j[i].type == 'NOTIFY') Message.showNotify(j[i]);
            else if(j[i].type == 'POPUP') Message.showPopup(j[i]);
            else if(j[i].type == 'FIELD') Message.showField(j[i]);
        }
    },

    showNotify: function(e){

        if(typeof e.text == 'undefined' ) return;
        var UID = new Date().getTime();

        var msgObj = document.createElement('div');
        msgObj.className = 'alert';
        msgObj.id =  'MSG_'+UID;

        if(e.level==0)      msgObj.addClass('alert-error');
        else if(e.level==1) msgObj.addClass('alert-warn');
        else if(e.level==2) msgObj.addClass('alert-success');
        else if(e.level==3) msgObj.addClass('alert-info');
        else if(e.level==4) msgObj.addClass('');

        var a = document.createElement('a');
        a.addClass('close')
        a.innerText = 'X';
        a.addEventListener('click', function(){
            this.closest('.alert').remove();
        })
        msgObj.appendChild(a);
        
        if(typeof e.title=='string'){
            var title = document.createElement('h3');
            title.innerText = e.title;
            msgObj.appendChild(title);
        }

        if(typeof e.text=='string'){
            var text = document.createElement('p');
            text.innerHTML = e.text;
            msgObj.appendChild(text);
        }

        if( Array.isArray(e.buttons) && e.buttons.length>0){
            var btnsCont = document.createElement('div');
            btnsCont.addClass('btnsContainer');
            for(i in e.buttons){
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn';
                b.addClass(e.buttons[i].className);
                b.dataset.btnAction = e.buttons[i].action;
                b.innerText = e.buttons[i].text;
                b.addEventListener('click', function(){
                    eval(this.dataset.btnAction);
                });
                btnsCont.appendChild(b);
            }
            msgObj.appendChild(btnsCont);
        }

        var m = document.getElementById('Poppins-Notify-Container');
        if(m == null){
            m = document.createElement("div");
            m.id = 'Poppins-Notify-Container';
            m.className = 'poppinsNotifyContainer';
            document.body.appendChild(m);
        }
        m.appendChild(msgObj);
    },

    showPopup: function(e){

        if(typeof e.text == 'undefined' ) return;
        var UID = new Date().getTime();

        var msgObj = document.createElement('div');
        msgObj.className = 'dialog';
        msgObj.id =  'MSG_'+UID;

        if(e.level==0)      msgObj.addClass('dialog-error');
        else if(e.level==1) msgObj.addClass('dialog-warn');
        else if(e.level==2) msgObj.addClass('dialog-success');
        else if(e.level==3) msgObj.addClass('dialog-info');
        else if(e.level==4) msgObj.addClass('');
        
        if(typeof e.title=='string'){
            var title = document.createElement('div');
            title.addClass('dialog-head');
            title.innerHTML = '<h3>'+e.title+'</h3>';
            msgObj.appendChild(title);
        }

        if(typeof e.text=='string'){
            var text = document.createElement('div');
            text.addClass('dialog-body');
            text.innerHTML = e.text;
            msgObj.appendChild(text);
        }

        if( Array.isArray(e.buttons) && e.buttons.length>0){
            var btnsCont = document.createElement('div');
            btnsCont.addClass('dialog-foot');
            for(i in e.buttons){
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn';
                b.addClass(e.buttons[i].className);
                b.dataset.btnAction = e.buttons[i].action;
                b.innerText = e.buttons[i].text;
                b.addEventListener('click', function(){
                    eval(this.dataset.btnAction);
                });
                btnsCont.appendChild(b);
            }
            msgObj.appendChild(btnsCont);
        }

        document.body.appendChild(msgObj);

        Dialog.open('MSG_'+UID);

    },

    showField: function(d){

    }

}


var Dialog = {

    showMask: function(){
        var m = document.getElementById('Poppins-MASK');
        if(m == null){
            m = document.createElement("div");
            m.id = 'Poppins-MASK';
            m.className = 'poppinsMask';
            document.body.appendChild(m);
        }
        m.addClass('active');
    },

    hideMask: function(){
        document.getElementById('Poppins-MASK').removeClass('active');
    },

    open: function(id, opt){

        if(opt == null) opt = {};
        var set = {
            draggable: typeof opt.draggable == 'undefined' ? true : opt.draggable,
            btnClose: typeof opt.btnClose == 'undefined' ? true : opt.btnClose,
            open: typeof opt.open == 'undefined' ? function(){} : opt.open,
            close: typeof opt.close == 'undefined' ? function(){} : opt.close,
            number: 0
        };

        var d = id;
        if(typeof d == 'string')
            d = document.getElementById(id);

        if( d.length==0 ) return;

        Dialog.showMask();

        d.dialog = set;

        if( d.querySelector('a.close')==null && set.btnClose ){
            var a = document.createElement('a');
            a.className = 'close';
            a.innerText = 'X';
            a.addEventListener('click', Dialog.close);
            d.insertBefore(a, d.firstChild);
        }

        if(typeof set.open == 'function'){
            set.open(d);
        }else if(typeof set.open == 'string'){
            eval( set.open + "(d);" );
        }

        var openedDialog = document.querySelectorAll('.dialog.open');
        if( openedDialog.length>0 ){
            openedDialog.forEach(function(e){
                e.style.zIndex = 99999;
                e.removeClass('first')
                e.dialog.number++;
            });
        }
        
        d.addClass('open');
        d.addClass('first');
        
    },

    close: function(){
        var o = document.querySelector('.dialog.open.first');
        if( o==null || o.length == 0 ) return;

        o.removeClass('open');
        o.removeClass('first');
        var set = o.dialog;

        if(typeof set.close == 'function'){
            set.close(o);
        }else if(typeof set.close == 'string'){
            eval( set.close + "(o);" );
        }

        var openedDialog = document.querySelectorAll('.dialog.open');
        if(openedDialog.length==0){
            Dialog.hideMask();
            return;
        }

        openedDialog.forEach(function(e){
            e.dialog.number--;
            if(e.dialog.number == 0){
                e.addClass('first');
                e.style.zIndex = 100001;
            }
        });
    },

    alert: function(txt, title){
        
        var dialog = document.createElement('div');
        dialog.className = 'dialog dialog-info';
        dialog.id = 'DialogAlert' + new Date().getTime();

        var html = '<div class=" dialog-head"><h3>'+( title ? title : 'Info' )+'</h3></div>';
        html += '<div class="dialog-body">'+txt+'</div>';
        html += '<div class="dialog-foot">'
        html += '<button type="button" class="btn active" onclick="Dialog.close();this.closest(\'.dialog\').remove();">Close</button>';
        html += '</div>';

        dialog.innerHTML = html;

        document.body.appendChild(dialog);
        Dialog.open(dialog);
    }

};/**
 * Mobile util
 */

var Mob = {

    Demo: false,

    geolocation : {

        watching : 0,

        options : {
            maximumAge: 3000, 
            timeout: 300000, 
            enableHighAccuracy: true
        },

        test_position : {
            coords : {
                latitude : 45,
                longitude : 11,
                accuracy : 3,
                altitude : 13,
                altitudeAccuracy : 5,
                heading : 0,
                speed : 0
            },
            timestamp : new Date().getTime()
        },

        has : function(){
            if("geolocation" in navigator){
                return true;
            }

            return false;
        },

        /**
         * return object position
        */
        get : function(callBack){

            if(Mob.Demo){
                callBack(Mob.geolocation.test_position);
            }

            if(!Mob.geolocation.has()){
                callBack(null, {code: -100, message:'geolocation not found'})
                return;
            }

            navigator.geolocation.getCurrentPosition(function(p){ // On success
                callBack( Mob.geolocation.format(p) );
            }, function(e){ // On error
                callBack(null, e);
            }, Mob.geolocation.options );

        },

        startWatch: function(callBack){

            if(Mob.Demo){
                callBack(Mob.geolocation.test_position);
            }

            if(!Mob.geolocation.has()){
                callBack(null, {code: -100, message:'geolocation not found'})
                return;
            }
            
            Mob.geolocation.watching = navigator.geolocation.watchPosition(function(p){ // On success
                callBack( Mob.geolocation.format(p) );
            }, function(e){ // On error
                callBack(null, e);
            }, Mob.geolocation.options );
        },

        stopWatch: function(){

            if(!Mob.geolocation.has() && Mob.geolocation.watching > 0){
                navigator.geolocation.clearWatch(Mob.geolocation.watching);
                Mob.geolocation.watching = 0;
            }

        },

        format : function (position) {

            var positionObject = {};
        
            if ('coords' in position) {
                positionObject.coords = {};
        
                if ('latitude' in position.coords) {
                    positionObject.coords.latitude = position.coords.latitude;
                }
                if ('longitude' in position.coords) {
                    positionObject.coords.longitude = position.coords.longitude;
                }
                if ('accuracy' in position.coords) {
                    positionObject.coords.accuracy = typeof position.coords.accuracy == 'number' ? position.coords.accuracy.toFixed(2) : 0;
                }
                if ('altitude' in position.coords) {
                    positionObject.coords.altitude = position.coords.altitude;
                }
                if ('altitudeAccuracy' in position.coords) {
                    positionObject.coords.altitudeAccuracy = typeof position.coords.altitudeAccuracy == 'number' ? position.coords.altitudeAccuracy.toFixed(2) : 0;
                }
                if ('heading' in position.coords) {
                    positionObject.coords.heading = position.coords.heading;
                }
                if ('speed' in position.coords) {
                    positionObject.coords.speed = position.coords.speed;
                }
            }
        
            if ('timestamp' in position) {
                positionObject.timestamp = position.timestamp;
            }

            return positionObject;
        }
    }
};
var StartPoppins = function() {
    Intf.init();
    Caller.init();
};


// Server caller
var Caller = {
    
    afterReq: false,
    beforeReq: false,
    baseUrl : '',
    params : [],
    jwtPayload : {},

    init: function(){
        if(typeof window.localStorage.TKN == 'string'){
            var pos = window.localStorage.TKN.indexOf('.') + 1;
            Caller.jwtPayload = JSON.parse(atob(window.localStorage.TKN.substring(pos, window.localStorage.TKN.indexOf('.', pos))));
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

        data.TKN = window.localStorage.TKN;

        for(var i in Caller.params){
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
                        window.localStorage.TKN = jwt;
                        var pos = window.localStorage.TKN.indexOf('.') + 1;
                        Caller.jwtPayload = JSON.parse(atob(window.localStorage.TKN.substring(pos, window.localStorage.TKN.indexOf('.', pos))));
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
         });

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


