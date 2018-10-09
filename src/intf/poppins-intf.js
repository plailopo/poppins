
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
