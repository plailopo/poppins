
window.onload = function() {
    Poppins.boot();
};


var Poppins = {
        
	load : 0,
	apps : [],

	/*
		On Boot
	*/	
	boot : function(){
		
		Poppins.load = 1;
		
		for( i in Poppins.apps ){
			Poppins.apps[i].load();
		}
		
		/*
		Poppins.doc_parser();
		
		for( i in Poppins.poppins_waiting ){
			Poppins.poppins_waiting[i].load();
		}
		
		Poppins.poppins_waiting = [];
		*/
		
		Poppins.load = 2;
		
	},
	
	doc_parser : function(){
		
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
			
	},
	
	addApp : function(a){
		Poppins.apps[a];
	},
	
	getApp : function(name){
		if(name == null)
			return Poppins.apps[0];
		
		for(i in Poppins.apps){
			if(Poppins.apps[i].name == name) 
				return Poppins.apps[i];
		}
	},
	
	extend : function(){
		for(var i=1; i<arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key)) { 
					if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
						extend(arguments[0][key], arguments[i][key]);
					else
					   arguments[0][key] = arguments[i][key];
				 }
		return arguments[0];
	}
	
	
	
}




