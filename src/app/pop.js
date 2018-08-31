

class Poppin{

    constructor(options){
		
		if( typeof options == 'object' ){
		
			this.name = options.name;
			this.app_name = options.app_name;
			this.template = options.template;
					
			this.behavior = options;
			
		}else{
			console.log('Poppin without options... Nothing to do!');
			return;
		}
		
		this.load();
		
	}
	
	load(){
		
		this.app = Pop.getApp(this.app_name);
		this.app.addPoppin(this);
		
	}
	
	render(elm){
		
		if(elm == null){
			elm = this.app.e;
		}
		
		new PopLink(this, elm).place(this.behavior.data);
		
	}

}