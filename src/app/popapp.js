

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