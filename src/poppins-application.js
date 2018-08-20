
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
	
}