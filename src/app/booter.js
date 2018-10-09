

Pop.load = 0;
Pop.apps = [];

Pop.boot = function(){
	
	for(var i in Pop.apps ){
		Pop.apps[i].load();
	}
	
};
	
Pop.doc_parser = function(){
		
	var app = document.querySelectorAll('app');
	
	for(var i=0; i< app.length; i++){
		new App(app[i].getAttribute('name'), app[i]);
	}
	
	if(app.length == 0){
		var a = document.createElement("app"); 
		a.setAttribute('name', 'app');
		document.body.appendChild(a);    
		new App('app', a);
	}
		
};
	
Pop.addApp = function(a){
	Pop.appspush(a);
};
	
Pop.getApp = function(name){
	if(name == null)
		return Pop.apps[0];
	
	for( var i in Pop.apps){
		if(Pop.apps[i].name == name) 
			return Pop.apps[i];
	}
};





