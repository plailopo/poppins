
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





