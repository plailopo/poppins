

class PopApp{
	
    constructor(name, onLoad){
		
		this.name = name;
		this.onLoad = onLoad;
		this.poppins = [];
		
		Pop.apps.push(this);

	}
	
	load(){
		var oldTag = document.querySelector('app#'+this.name);
		this.e = document.createElement('div');
		this.e.innerHTML = oldTag.innerHTML;
		this.e.setAttribute('pop-app', this.name);
		oldTag.parentNode.replaceChild(this.e, oldTag);
		
		for( i in this.onLoad ){
			this.loadPop(this.onLoad[i]);
		}
	}
	
	loadPop(name){
		this.getPoppin(name).render();
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