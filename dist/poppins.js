

window.onload = function() {
    Pop.boot();
	Intf.init();
    
	//Caller.init();
};


var Pop = {};;
Pop.getDataByString = function(s, obj) {

	if(obj == null) obj = window;

    var keys = s.split(".");

    for (var i = 0; i < keys.length; i++) {

        if (!(keys[i] in obj) || obj[keys[i]] === null || typeof obj[keys[i]] == 'undefined') {
            return null;
        }

        obj = obj[keys[i]];
    }

    return obj;
};

Pop.setDataByString = function(s, val, obj) {
	
	if(obj == null) obj = window;
	
	var str = '';
    var keys = s.split(".");
	var i;

    for (i = 0; i < keys.length; i++) {
	
		str += '{ "' + keys[i] + '" : ';
		
    }
	
	if(typeof val == 'string'){
		str += '"' + val + '"';
	}else{
		str += val;
	}
	
	for (i = 0; i < keys.length; i++) {
	
		str += '}';
		
    }
	
	obj = Pop.extend(obj, JSON.parse(str));
    
};

Pop.extend = function(){
	for(var i=1; i<arguments.length; i++)
		for(var key in arguments[i])
			if(arguments[i].hasOwnProperty(key)) { 
				if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
					Pop.extend(arguments[0][key], arguments[i][key]);
				else
				   arguments[0][key] = arguments[i][key];
			 }
	return arguments[0];
};;
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

Element.prototype.toggleClass = function(c) {
	if(this.hasClass(c)){
		this.removeClass(c);
	}else{
		this.addClass(c);
	}
    return this;
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
    return this;
};

Element.prototype.val = function(v) {
    var form = this.closest('form');
    var i = 0;
	
    if(this.tagName.toLowerCase() == 'input'){
		
		if(!this.hasAttribute('type')){
			this.setAttribute('type', 'text');
		}

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
					Pop.getDataByString(str.substring(2))();
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
        pageIn.addClass('active').addClass( inClass );
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
                e.innerHTML = Pop.getDataByString(e.dataset.value, data);
            }
        });

    },

    data2FORM: function(id, data){

        if(typeof id == 'string')
            id = document.getElementById(id);

        id.querySelectorAll('input, textarea, select').forEach(function(e){
            if(data.hasOwnProperty(e.name)){
                e.val(Pop.getDataByString(e.name, data));
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
                });
                rndsFound[r].addEventListener('change', function() {
                    var list = this.btnLink.MyForm.querySelectorAll('input[type=radio][name='+this.name+']');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked) {
                            list[i].btnLink.addClass('active');
                            list[i].btnLink.removeClass('hidden');
                        } else {
                            list[i].btnLink.removeClass('active');
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
                        this.removeClass('active');
                    }else{
                        check.checked = true;
                        this.addClass('active');
                    }
                    this.innerHTML = '<i class="fas fa-'+( check.checked ? 'check' : 'square' )+'"></i>';
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    this.closest('form').dispatchEvent(evt);
                });
				
                chksFound[r].addEventListener('change', function() {
                    this.btnLink.innerHTML = '<i class="fas fa-'+( this.checked ? 'check' : 'square' )+'"></i>';
                    if(this.checked){
                        this.btnLink.addClass('active');
                    }else{
                        this.btnLink.removeClass('active');
                    }
                });
                chksFound[r].parentNode.insertBefore(btn, chksFound[r].nextSibling);
            }
        }
    }

};
;/**
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
                callBack(null, {code: -100, message:'geolocation not found'});
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
                callBack(null, {code: -100, message:'geolocation not found'});
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
};;
Pop.load = 0; // 1 parsed, 2 complete

Pop.apps = [];
Pop.waiting_poppins = [];

Pop.boot = function(){
	
	Pop.doc_app_parser();
	
	Pop.doc_pop_parser();
	
	Pop.load = 1;
	
	for(var p in Pop.waiting_poppins){
		Pop.waiting_poppins[p].load();
	}
	
	for(var i in Pop.apps ){
		Pop.apps[i].load();
	}
	
};
	
Pop.doc_app_parser = function(){
		
	var apps = document.querySelectorAll('app');
	var i;
	
	for(i=0; i< apps.length; i++){
		
		var app_id = apps[i].getAttribute('id');
		if(app_id == undefined || app_id.length == 0 ){
			console.error("App without identifier")
			continue;
		}
		
		var already_exist = false;
		for(a in Pop.apps){
			if(Pop.apps[a].id == app_id){
				already_exist = true;
				break;
			}
		}
		if(already_exist) continue;
		
		
		if( Pop.apps[app_id] == undefined )
			new PopApp(app_id);
		
	}
		
};

Pop.doc_pop_parser = function(){
	
	var pops = document.querySelectorAll('pop');
	
	for(i=0; i< pops.length; i++){
		
		var pop_id = pops[i].getAttribute('id');
		if(pop_id == undefined || pop_id.length == 0) {
			console.error("Pop without identifier")
			continue;
		}
		
		var app_id = pops[i].getAttribute('app');
		if(app_id == null){
			app_id = pops[i].closest('app').getAttribute('id');
		}
		
		var tmp_data = pops[i].getAttribute('data');
		var d = tmp_data != undefined ? Pop.getDataByString(tmp_data) : {};
		
		new Poppin(pop_id, {
	
			app : app_id,
			template : pops[i].innerHTML,
			data : d

		});
	}
	
};
	
Pop.addApp = function(a){
	Pop.appspush(a);
};
	
Pop.getApp = function(id){
	if(id == null)
		return Pop.apps[0];
	
	for( var i in Pop.apps){
		if(Pop.apps[i].id == id) 
			return Pop.apps[i];
	}
};





;
var DataObserver = {
	
	object_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set: function(obj, prop, value) {
			var i;
			if(typeof value === 'object'){
				value = DataObserver.data_parser(value);
				for(i in obj._pop_binders[prop]){
					//console.log(i)
				}
			}else{
				for(i in obj._pop_binders[prop]){
					obj._pop_binders[prop][i].innerHTML = value;
				}
			}
			return Reflect.set(...arguments);
		}
		
	},
	
	array_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set: function(target, property, value, receiver) {
			var i;
			if( property != 'length' && typeof value === 'object'){
				value = DataObserver.data_parser(value);
				for(i in target._poppins){
					target._poppins[i].p.render(target._poppins[i].e, value);
				}
			}else if( property == 'length' && typeof value === 'number'){
				for(i in target._poppins){
					var pointer = target._poppins[i].e.parentElement.children.length - value - 1;
					var many = pointer;
					for( many; many > 0; many--){
						target._poppins[i].e.parentElement.children[pointer].remove();
					}
				}
			}
			// you have to return true to accept the changes
			return Reflect.set(...arguments);
		}
		
	},
	
	data_parser : function(o){
		
		if( o._poppins !== undefined ) return o;
		
		// Defining POPPINS
		// Poppins list for data
		Object.defineProperty(o, "_poppins", {
			configurable : false,
			value: []
		});
	
		Object.defineProperty(o, "_addPoppin", {
			configurable : false,
			value: function(pop, elm){
				this._poppins.push({p:pop, e:elm});
			}
		});
		
		Object.defineProperty(o, "_getPoppin", {
			configurable : false,
			value: function(){
				return this._poppins;
			}
		});
		
		// Defining BINDER list
		Object.defineProperty(o, "_pop_binders", {
			configurable : false,
			value: []
		});
	
		Object.defineProperty(o, "_addBinder", {
			configurable : false,
			value: function(name, elm){
				if( this._pop_binders[name] === undefined )
					this._pop_binders[name] = [];
				
				this._pop_binders[name].push(elm);
			}
		});
		
		Object.defineProperty(o, "_getBinders", {
			configurable : false,
			value: function(){
				return this._pop_binders;
			}
		});
		
		if(Array.isArray(o)){
			
			o = new Proxy(o, DataObserver.array_handler);

		}else{
			o = new Proxy(o, DataObserver.object_handler);
			
		}

		for (var i in o) {
			if (o[i] !== null && typeof(o[i])=="object") {
				o[i] = DataObserver.data_parser(o[i]);
			}
		}
		
		return o;
	}
};

;
const Match_MustacheEntry = /\{\{[A-Za-z][A-Za-z_\-:.#]*\}\}/gm;
const Match_MustacheOnly = /[\{\}]*/gm;

var ParserHTML = {
	
	
	html_by_template : function(tmpl, data){
			
		tmpl = tmpl.trim();
		
		var html = '';
		
		var m;
		var pointer = 0;
		
		do {
			m = Match_MustacheEntry.exec(tmpl);
			if (m) {
				html += tmpl.substring(pointer, m.index);
				var opt = null;
				var param = m[0].replace(Match_MustacheOnly, '');
				
				if( param.indexOf(':') > 0 ){
					var paramSplit = param.split(':');
					opt = paramSplit[0];
					param = paramSplit[1];
				}
				
				if(opt != null){
					// TODO manage option
				}
				
				// data
				var v = Pop.getDataByString(param, data);
				var withTag = true;
				var tmpPos = m.index - 1;
				
				while(tmpPos >= 0){
					if( tmpl.substr(tmpPos, 1) == "<" ){
						withTag = false;
						break;
					}else if( tmpl.substr(tmpPos, 1) == ">" ){
						withTag = true;
						break;
					}
					tmpPos--;
				}
				
				if(withTag) html += '<span pop-bind="'+m[0].replace(Match_MustacheOnly, '')+'">';
				html += v == null ? '' : v;
				if(withTag) html += '</span>';
				
				pointer = m.index + m[0].length;
			}
		} while (m);
		
		html += tmpl.substr(pointer);
		
		return html;
	}
};;;

class Poppin{

    constructor(id, tmplt, options){
		
		this.id = id;
		
		if( typeof tmplt == 'string' ){
			
			this.template = tmplt;
			
			if( typeof options == 'object' ){
		
				this.data = options;
				
			}
		
		}else if( typeof tmplt == 'object' ){
		
			this.app = tmplt.app;
			this.template = tmplt.template;
			this.data = tmplt.data;
			
		}else{
			
			console.log('Poppin without options ' + this.id + '... Nothing to do!');
			return;
			
		}
		
		if( Pop.load ){
			this.load();
		}else{
			Pop.waiting_poppins.push(this);
		}
		
		
	}
	
	load(){
		
		if(typeof this.app == 'string'){
			this.app = Pop.getApp(this.app);
		}else{
			this.app = Pop.getApp();
		}
		
		if(this.data === undefined)
			this.data = {};
		
		DataObserver.data_parser(this.data);
		
		console.log('Poppin ', this.id, 'loaded', this)
		
		this.app.addPoppin(this);
		
	}
	
	render(elm, data_ref){
		
		if(elm == null){
			elm = document.createElement('pop');
			elm.setAttribute('id', this.id);
			this.app.e.appendChild(elm);
		}
		
		console.log('render ', this.id, 'into', elm, 'with data', data_ref);
		
		if(data_ref == null){
			data_ref = this.data;
		}
		
		var html = ParserHTML.html_by_template(this.template, data_ref);
		
		var tmpElm = document.createElement('div');
		tmpElm.innerHTML = html;
		var node = tmpElm.firstChild;
		node.poppin = this;
		node.pop_data = data_ref;
		elm.parentElement.insertBefore(node, elm.nextSibling);
		elm.innerHTML = '';
		
		this.binder(node, data_ref);
		
		data_ref._addPoppin(this, node);
		
		this.sub_poppins(node, data_ref);
		
	}
	
	binder(node, data_ref){
		
		// POP-FIRE
		// pop-fire="event:variable/method;event:variable/method;event:variable/method"
		// when event fire:
		// 		- variable: is setted with tag value. Only for INPUT, SELECT or TEXTAREA
		//		- method: run method as method(event, element, poppin)
		
		var elms = node.querySelectorAll('[pop-fire]');
		
		for(var i=0; i< elms.length; i++){
			
			var elm = elms[i];
			var fires = elm.getAttribute("pop-fire").split(';');
			
			elm.pop_fire = [];
			for(var f=0; f< fires.length; f++){
				
				var fire = fires[f].split(':');
				var event = fire[0];
				var action = fire[1];
				
				elm.pop_fire.push({event: event, action: action});
				elm.pop = this;
				elm.addEventListener(event, function(ev){
					
					for(i in this.pop_fire){
						if(this.pop_fire[i].event == ev.type){
							
							var fnc = Pop.getDataByString(this.pop_fire[i].action);
							
							if(typeof fnc == 'function'){
								fnc(node.poppin, node.pop_data, this, ev);
							}else{
								Pop.setDataByString(this.pop_fire[i].action, this.val(), this.pop.data);
							}
							
							break;
						}
					}
					
				});
				
			}

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		elms = node.querySelectorAll('[pop-bind]');
		
		for(i=0; i< elms.length; i++){
			
			var pathVar = data_ref;
			var lastVar = elms[i].getAttribute('pop-bind');
			var varSplitted = lastVar.split('.');
			if(varSplitted.length > 1){
				for(var l in varSplitted){
					lastVar = varSplitted[l];
					if(l < varSplitted.length-1) pathVar = Pop.getDataByString(lastVar, pathVar);
				}
			}
			
			pathVar._addBinder(lastVar, elms[i]);
			
		}
		
	}
		
	sub_poppins(node, data_ref){
		
		var elms = node.querySelectorAll('pop');
		
		for(var i=0; i< elms.length; i++){
			
			var id = elms[i].getAttribute('id');
			var pop_data = elms[i].getAttribute('pop-data') != null ? elms[i].getAttribute('pop-data') : '';
			var dt = Pop.getDataByString(pop_data, data_ref);
			
			var p = this.app.getPoppin(id);
			
			if( Array.isArray(dt) ){
				dt._addPoppin(p, elms[i]);
				
				for(var l = 0; l < dt.length; l++){
					p.render(elms[i], dt[l]);
				}
				
			}else{
				p.render(elms[i], dt);
			}
			
		}
		
	}

};

class PopApp{
	
    constructor(id, onLoad){
		
		this.loaded = 0;
		this.id = id;
		this.onLoad = onLoad != null ? onLoad : [];
		this.poppins = [];
		
		Pop.apps.push(this);
		
	}
	
	load(){
		
		var oldTag = document.querySelector('app#'+this.id);
		this.e = document.createElement('div');
		this.e.innerHTML = oldTag.innerHTML;
		this.e.setAttribute('pop-app', this.id);
		oldTag.parentNode.replaceChild(this.e, oldTag);
		this.loaded = 100;
		
		var poppese = this.e.querySelectorAll('pop');

		[].forEach.call(poppese, function(p) {
			p.remove();
		});
				
		for( var i in this.onLoad ){
			this.loadPop(this.onLoad[i]);
		}
	}
	
	loadPop(id){
		if(this.loaded < 100){
			this.onLoad.push(id);
		}else{
			this.getPoppin(id).render();
		}
	}
	
	addPoppin(pop){
		this.poppins.push(pop);
	}
	
	getPoppin(id){
		for( var i in this.poppins){
			if(this.poppins[i].id == id)
				return this.poppins[i];
		}
		return null;
	}
	
}