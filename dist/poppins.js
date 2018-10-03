

window.onload = function() {
    Pop.boot();
	Intf.init();
    
	//Caller.init();
};


var Pop = {};
Pop.getDataByString = function(obj, s) {

    var keys = s.split(".");

    for (var i = 0; i < keys.length; i++) {

        if (!(keys[i] in obj) || obj[keys[i]] === null || typeof obj[keys[i]] == 'undefined') {
            return null;
        }

        obj = obj[keys[i]];
    }

    return obj;
}

Pop.setDataByString = function(obj, s, val) {
	
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
    
}

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

Pop.load = 0;
Pop.apps = [];

Pop.boot = function(){
	
	for( i in Pop.apps ){
		Pop.apps[i].load();
	}
	
	/*
	Pop.doc_parser();
	
	for( i in Pop.poppins_waiting ){
		Pop.poppins_waiting[i].load();
	}
	
	Pop.poppins_waiting = [];
	*/
	
};
	
Pop.doc_parser = function(){
		
	var app = document.querySelectorAll('app');
	
	for(var i=0; i< app.length; i++){
		new App(app[i].getAttribute('name'), app[i]);
	}
	
	if(app.length == 0){
		var a = document.createElement("app"); 
		a.setAttribute('name', 'app')
		document.body.appendChild(a);    
		new App('app', a);
	}
		
};
	
Pop.addApp = function(a){
	Pop.apps[a];
};
	
Pop.getApp = function(name){
	if(name == null)
		return Pop.apps[0];
	
	for(i in Pop.apps){
		if(Pop.apps[i].name == name) 
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
			console.log('set', prop, value, obj._pop_binders)
			if(typeof value === 'object'){
				value = DataObserver.data_parser(value);
				console.log(obj._pop_binders)
				for(var i in obj._pop_binders[prop]){
					console.log(i)
				}
			}else{
				for(var i in obj._pop_binders[prop]){
					obj._pop_binders[prop][i].innerHTML = value;
				}
			}
			return Reflect.set(...arguments);
		}
		
	},
	
	array_handler : {
		
		get: function(target, property) {
			//console.log('getting array ' + property + ' for ' + target);
			// property is index in this case
			return target[property];
		},
		
		set: function(target, property, value, receiver) {
			console.log('setting array ' , property , ' for ' , target , ' with value ' , value);
			target[property] = value;
			if( property != 'length' && typeof value === 'object'){
				console.log('ok', target._pop_binders)
				value = DataObserver.data_parser(value);
				for(var i in target._pop_binders[property]){
					console.log(i)
				}
			}
			// you have to return true to accept the changes
			return true;
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
				this._poppins.push({p:pop, e:elm})
			}
		});
		
		Object.defineProperty(o, "_getPoppin", {
			configurable : false,
			value: function(){
				return this._poppins
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
				console.log(name, elm)
				if( this._pop_binders[name] === undefined )
					this._pop_binders[name] = [];
				
				this._pop_binders[name].push(elm);
			}
		});
		
		Object.defineProperty(o, "_getBinders", {
			configurable : false,
			value: function(){
				return this._pop_binders
			}
		});
		
		if(Array.isArray(o)){
			
			o = new Proxy(o, DataObserver.array_handler);
			/*
			Object.defineProperty(o, "push", {
				configurable : true,
				value: function(o){
					[].push.call(this, o);
					if ( typeof(o) == "object") {
						o = DataObserver.data_parser(o);
					}
				}
			});
			*/
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
}

;
const Match_MustacheEntry = /\{\{[A-Za-z][A-Za-z_\-:.#]*\}\}/gm;
const Match_MustacheOnly = /[\{\}]*/gm;

var ParserHTML = {
	
	
	html_by_template : function(tmpl, data){
			
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
				var v = Pop.getDataByString(data, param);
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
};
//const Match_MustacheEntry = /\{\{[A-Za-z][A-Za-z_\-:.#]*\}\}/gm;
//const Match_MustacheOnly = /[\{\}]*/gm;


/*
class PopLink{
	

    constructor(pop, parentElement){
		
		this.poppin = pop;
		this.parent = parentElement;
		
	}
	
	place(data){
		
		this.data = data;
		this.node = document.createElement('div');
		this.node.setAttribute('pop-comp', this.poppin.name);
		this.parse();
		this.binder();
		this.sub_poppins();
		this.parent.appendChild(this.node);
		
	}
	
	parse(){
		
		var html = '';
		
		var m;
		var pointer = 0;
		
		do {
			m = Match_MustacheEntry.exec(this.poppin.template);
			if (m) {
				html += this.poppin.template.substring(pointer, m.index);
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
				var v = Pop.getDataByString(this.data, param);
				var withTag = true;
				var tmpPos = m.index - 1;
				
				while(tmpPos >= 0){
					if( this.poppin.template.substr(tmpPos, 1) == "<" ){
						withTag = false;
						break;
					}else if( this.poppin.template.substr(tmpPos, 1) == ">" ){
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
		
		html += this.poppin.template.substr(pointer);
		
		this.node.innerHTML = html;
	}
	
	binder(){
		
		// POP-DATA-SET
		// pop-data-set="event:variable/method"
		// when event fire:
		// 		- variable: is setted with tag value. Only for INPUT, SELECT or TEXTAREA
		//		- method: run method as method(event, element, poppin)
		var elms = this.node.querySelectorAll('[pop-data-set]');
		
		for(var i=0; i< elms.length; i++){
			var paramVal = elms[i].getAttribute("pop-data-set").split(':');
			var eventType = paramVal[0];
			var dataParam = paramVal[1];
			elms[i].pop_data_set = dataParam;
			elms[i].pop_root = this;
			elms[i].addEventListener(eventType, function(ev){
				
				var pop = this.pop_root;
				var param = this.pop_data_set;
				
				var fnc = Pop.getDataByString(pop.poppin.behavior, param);
				
				if(typeof fnc == 'function'){
					fnc(this, ev);
				}else{
					Pop.setDataByString(pop.data, param, this.val());
				}
				
			})

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		var elms = this.node.querySelectorAll('[pop-bind]');
		
		if( typeof this.data_binder == 'undefined' )
			this.data_binder = [];
		
		for(var i=0; i< elms.length; i++){
		
			var dataToBind = elms[i].getAttribute('pop-bind');
			
			if( typeof this.data_binder[dataToBind] == 'undefined' )
				this.data_binder[dataToBind] = [];
			
			this.data_binder[dataToBind].push(elms[i]);
			
			var self = this.data_binder[dataToBind];
			
			var pathVar = this.data;
			var lastVar = elms[i].getAttribute('pop-bind');
			var varSplitted = lastVar.split('.');
			for(var l in varSplitted){
				if(l==0) continue;
				lastVar = varSplitted[l];
				pathVar = pathVar[varSplitted[l-1]]
			}

			Object.defineProperty(pathVar, lastVar, {
				configurable: true,
				
				set: function(v) {
					this.value = v;
					
					for(i in self){
						self[i].innerHTML = v;
					}
					
				}
			});
		}
		
	}
	
	sub_poppins(){
		
		var elms = this.node.querySelectorAll('pop');
		
		for(var i=0; i< elms.length; i++){
			
			var name = elms[i].getAttribute('name');
			var dt = Pop.getDataByString(this.data, elms[i].getAttribute('pop-data'));
			
			var e = document.createElement('div');
			elms[i].parentNode.replaceChild(e, elms[i]);
			
			var p = new PopLink(this.poppin.app.getPoppin(name), e);
			
			if( Array.isArray(dt) ){
				for(i in dt) p.place(dt[i]);
			}else{
				p.place(dt);
			}
		}
		
	}
	
}

*/;

class Poppin{

    constructor(name, tmplt, options){
		
		this.name = name;
		
		if( typeof tmplt == 'string' ){
			
			this.template = tmplt;
			
			if( typeof options == 'object' ){
		
				this.data = options;
				
			}
		
		}else if( typeof tmplt == 'object' ){
		
			this.app_refer = tmplt.app;
			this.template = tmplt.template;
			this.data = tmplt.data;
			
		}else{
			
			console.log('Poppin without options ' + this.name + '... Nothing to do!');
			return;
			
		}
		
		this.load();
		
	}
	
	load(){
		
		if(typeof this.app_refer == 'string'){
			this.app = Pop.getApp(this.app_refer);
		}else if(typeof this.app_refer == 'object'){
			this.app = this.app_refer;
		}else{
			this.app = Pop.getApp();
		}
		
		if(this.data === undefined)
			this.data = {};
		
		DataObserver.data_parser(this.data);
		
		this.app.addPoppin(this);
		
	}
	
	render(elm, data_ref){
		
		if(elm == null){
			var elm = document.createElement('pop');
			elm.setAttribute('name', this.name);
			this.app.e.appendChild(elm);
		}
		
		if(data_ref == null){
			data_ref = this.data;
		}
		
		var html = ParserHTML.html_by_template(this.template, data_ref);
		
		var tmpElm = document.createElement('div');
		tmpElm.innerHTML = html;
		var node = tmpElm.firstChild;
		elm.parentElement.insertBefore(node, elm.nextSibling);
		
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
							
							var fnc = Pop.getDataByString(window, this.pop_fire[i].action);
							
							if(typeof fnc == 'function'){
								fnc(this, ev);
							}else{
								Pop.setDataByString(this.pop.data, this.pop_fire[i].action, this.val());
							}
							
							break;
						}
					}
					
				})
				
			}

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		var elms = node.querySelectorAll('[pop-bind]');
		
		for(var i=0; i< elms.length; i++){
			
			var pathVar = data_ref;
			var lastVar = elms[i].getAttribute('pop-bind');
			var varSplitted = lastVar.split('.');
			if(varSplitted.length > 1){
				for(var l in varSplitted){
					lastVar = varSplitted[l];
					if(l < varSplitted.length-1) pathVar = Pop.getDataByString(pathVar, lastVar);
				}
			}
			
			pathVar._addBinder(lastVar, elms[i]);
			
		}
		
	}
		
	sub_poppins(node, data_ref){
		
		var elms = node.querySelectorAll('pop');
		
		for(var i=0; i< elms.length; i++){
			
			var name = elms[i].getAttribute('name');
			var dt = Pop.getDataByString(data_ref, elms[i].getAttribute('pop-data'));
			
			var p = this.app.getPoppin(name);
			
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
	
    constructor(name, onLoad){
		
		this.loaded = 0;
		this.name = name;
		this.onLoad = onLoad != null ? onLoad : [];
		this.poppins = [];
		
		Pop.apps.push(this);

	}
	
	load(){
		var oldTag = document.querySelector('app#'+this.name);
		this.e = document.createElement('div');
		this.e.innerHTML = oldTag.innerHTML;
		this.e.setAttribute('pop-app', this.name);
		oldTag.parentNode.replaceChild(this.e, oldTag);
		this.loaded = 100;
		
		for( i in this.onLoad ){
			this.loadPop(this.onLoad[i]);
		}
	}
	
	loadPop(name){
		if(this.loaded < 100){
			this.onLoad.push(name);
		}else{
			this.getPoppin(name).render();
		}
	}
	
	addPoppin(pop){
		this.poppins.push(pop);
	}
	
	getPoppin(name){
		for(i in this.poppins){
			if(this.poppins[i].name == name)
				return this.poppins[i];
		}
		return null;
	}
	
}