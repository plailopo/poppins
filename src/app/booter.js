

Pop.load = 0;
Pop.apps = [];

Pop.boot = function(){
		
	Pop.load = 1;
	
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
	
	Pop.load = 2;
	
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





