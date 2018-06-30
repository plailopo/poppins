
window.onload = function() {
    Poppins.boot();
};


var Poppins = {
        
	loaded : false,
	ComponentWaiting : [],
	
	boot : function(){
	
		console.log('Poppins boot', Poppins.Apps, Poppins.ComponentWaiting)
		if(Poppins.Apps.length == 0){
			Poppins.create('PoppinsApp');
		}
		
		for( i in Poppins.Apps ){
			Poppins.Apps[i].app.load();
		}
		
		Poppins.loaded = true;
		
		for( i in Poppins.ComponentWaiting ){
			Poppins.component(Poppins.ComponentWaiting[i][0], Poppins.ComponentWaiting[i][1], Poppins.ComponentWaiting[i][2]);
		}
		
	},
	
	Apps : [],
	
	create : function(n){
		
		var a = new PoppinsApp(n);
		if(a != null){
			Poppins.Apps.push( { name: a.name, app: a });
		}
	},
	
	getApp : function(d){
		if( d == null) return Poppins.Apps[0].app;
		
		for( i in Poppins.Apps ){
			if(Poppins.Apps[i].name == d) return Poppins.Apps[i].app;
		}
	},
	
	component : function(a, s, c){
		new PoppinsComp(a, s, c);
	}
			
}


class PoppinsApp {
	
	constructor(d){
		console.log('app construct')
		if(typeof d != 'string' || d.length<=0 ) return null;
		console.log('created app ', d)
		this.name = d;
		this.components = [];
	}
		
	load(){
		console.log('App ' + this.name + ' loaded');
    }
	
	addComponent(c){
		this.components.push(c);
	}
 
}

class PoppinsComp{
 
	/**
		
		(string: selector)
		(json: behavior)
		(string: app, string: selector)
		(string: selector, json: behavior)
		(string: appname, string: selector, json: behavior)
	
	*/
    constructor(app, selector, behavior){
		
		if(!Poppins.loaded){
			Poppins.ComponentWaiting.push([app, selector, behavior]);
			return;
		}
		
        console.log('component construct', app, selector, behavior)
		this.behavior = typeof behavior == 'object' ? behavior : (typeof selector == 'object' ? selector : (typeof app == 'object' ? app : null));
		this.selector = typeof selector == 'string' ? selector : (typeof app == 'string' && (selector == null || typeof selector == 'object') ? app : null);
		this.app_name = typeof app == 'string' &&  typeof selector == 'string'? app : null;
		this.load();
		
	}
		
    load(){
		
		this.app = Poppins.getApp(this.app_name);
		
		if( typeof this.selector == 'string' ){
			this.e = document.querySelector(this.selector);
		}
		this.template = this.e ? this.e.outerHTML : '';
		
		if( this.behavior == null ) this.behavior = {};
		
		console.log('component loaded ', this);

		this.app.addComponent(this);
        this.parse();
    }
	
	parse(){
		
		var rex = /\{[\ ]*[A-Za-z]{1}[A-Za-z0-9]*[\ ]*\}/g;
		var m;
		
		console.log('parsing ', this.template)
		
		do {
			m = rex.exec(this.template);
			if (m) {
				m = m[0].substring(1, m[0].length - 1).trim();
				
			}
		} while (m);
		
		
		
	}
	
}