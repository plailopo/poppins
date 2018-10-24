

class Poppin{

    constructor(id, tmplt, options){
		
		this.id = id;
		
		if( typeof tmplt == 'string' ){
			
			this.template = tmplt;
			
			if( typeof options == 'object' ){
		
				this.data = options;
				
			}
		
		}else if( typeof tmplt == 'object' ){
		
			this.app = tmplt.app;
			this.template = tmplt.template;
			this.data = tmplt.data;
			
		}else{
			
			console.log('Poppin without options ' + this.id + '... Nothing to do!');
			return;
			
		}
		
		if( Pop.load ){
			this.load();
		}else{
			Pop.waiting_poppins.push(this);
		}
		
		
	}
	
	load(){
		
		if(typeof this.app == 'string'){
			this.app = Pop.getApp(this.app);
		}else{
			this.app = Pop.getApp();
		}
		
		if(this.data === undefined)
			this.data = {};
		
		DataObserver.data_parser(this.data);
		
		console.log('Poppin ', this.id, 'loaded', this)
		
		this.app.addPoppin(this);
		
	}
	
	render(elm, data_ref){
		
		if(elm == null){
			elm = document.createElement('pop');
			elm.setAttribute('id', this.id);
			this.app.e.appendChild(elm);
		}
		
		console.log('render ', this.id, 'into', elm, 'with data', data_ref);
		
		if(data_ref == null){
			data_ref = this.data;
		}
		
		var html = ParserHTML.html_by_template(this.template, data_ref);
		
		var tmpElm = document.createElement('div');
		tmpElm.innerHTML = html;
		var node = tmpElm.firstChild;
		node.poppin = this;
		node.pop_data = data_ref;
		elm.parentElement.insertBefore(node, elm.nextSibling);
		elm.innerHTML = '';
		
		this.binder(node, data_ref);
		
		data_ref._addPoppin(this, node);
		
		this.sub_poppins(node, data_ref);
		
	}
	
	binder(node, data_ref){
		
		// POP-FIRE
		// pop-fire="event:variable/method;event:variable/method;event:variable/method"
		// when event fire:
		// 		- variable: is setted with tag value. Only for INPUT, SELECT or TEXTAREA
		//		- method: run method as method(event, element, poppin)
		
		var elms = node.querySelectorAll('[pop-fire]');
		
		for(var i=0; i< elms.length; i++){
			
			var elm = elms[i];
			var fires = elm.getAttribute("pop-fire").split(';');
			
			elm.pop_fire = [];
			for(var f=0; f< fires.length; f++){
				
				var fire = fires[f].split(':');
				var event = fire[0];
				var action = fire[1];
				
				elm.pop_fire.push({event: event, action: action});
				elm.pop = this;
				elm.addEventListener(event, function(ev){
					
					for(i in this.pop_fire){
						if(this.pop_fire[i].event == ev.type){
							
							var fnc = Pop.getDataByString(this.pop_fire[i].action);
							
							if(typeof fnc == 'function'){
								fnc(node.poppin, node.pop_data, this, ev);
							}else{
								Pop.setDataByString(this.pop_fire[i].action, this.val(), this.pop.data);
							}
							
							break;
						}
					}
					
				});
				
			}

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		elms = node.querySelectorAll('[pop-bind]');
		
		for(i=0; i< elms.length; i++){
			
			var pathVar = data_ref;
			var lastVar = elms[i].getAttribute('pop-bind');
			var varSplitted = lastVar.split('.');
			if(varSplitted.length > 1){
				for(var l in varSplitted){
					lastVar = varSplitted[l];
					if(l < varSplitted.length-1) pathVar = Pop.getDataByString(lastVar, pathVar);
				}
			}
			
			pathVar._addBinder(lastVar, elms[i]);
			
		}
		
	}
		
	sub_poppins(node, data_ref){
		
		var elms = node.querySelectorAll('pop');
		
		for(var i=0; i< elms.length; i++){
			
			var id = elms[i].getAttribute('id');
			var pop_data = elms[i].getAttribute('pop-data') != null ? elms[i].getAttribute('pop-data') : '';
			var dt = Pop.getDataByString(pop_data, data_ref);
			
			var p = this.app.getPoppin(id);
			
			if( Array.isArray(dt) ){
				dt._addPoppin(p, elms[i]);
				
				for(var l = 0; l < dt.length; l++){
					p.render(elms[i], dt[l]);
				}
				
			}else{
				p.render(elms[i], dt);
			}
			
		}
		
	}

}