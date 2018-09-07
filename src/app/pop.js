

class Poppin{

    constructor(name, tmplt, options){
		
		this.name = name;
		
		if( typeof tmplt == 'string' ){
			
			this.template = tmplt;
			
			if( typeof options == 'object' ){
		
				this.data = options;
				
			}
		
		}else if( typeof tmplt == 'object' ){
		
			this.app_refer = tmplt.app;
			this.template = tmplt.template;
			this.data = tmplt.data;
			
		}else{
			
			console.log('Poppin without options ' + this.name + '... Nothing to do!');
			return;
			
		}
		
		this.load();
		
	}
	
	load(){
		
		if(typeof this.app_refer == 'string'){
			this.app = Pop.getApp(this.app_refer);
		}else if(typeof this.app_refer == 'object'){
			this.app = this.app_refer;
		}else{
			this.app = Pop.getApp();
		}
		
		if(this.data == undefined)
			this.data = {};
		
		DataObserver.data_parser(this.data);
		
		/*
		var elm = this.app.e.querySelector(this.template);
		if(typeof elm == 'object'){
			this.template = elm.outerHTML;
			elm.remove();
		}
		*/
		
		this.app.addPoppin(this);
		
	}
	
	render(elm, data_ref){
		
		if(elm == null){
			var elm = document.createElement('pop');
			elm.setAttribute('name', this.name);
			this.app.e.appendChild(elm);
		}
		
		if(data_ref == null){
			data_ref = this.data;
		}
		
		var html = ParserHTML.html_by_template(this.template, data_ref);
		
		var tmpElm = document.createElement('div');
		tmpElm.innerHTML = html;
		var node = tmpElm.firstChild;
		elm.parentElement.insertBefore(tmpElm.firstChild, elm.nextSibling);
		
		this.binder(node, data_ref);
		
		console.log(data_ref)
		data_ref._addPoppin(this, node);
		
		console.log('go', data_ref)
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
							
							var fnc = Pop.getDataByString(window, this.pop_fire[i].action);
							
							if(typeof fnc == 'function'){
								fnc(this, ev);
							}else{
								Pop.setDataByString(this.pop.data, this.pop_fire[i].action, this.val());
							}
							
							break;
						}
					}
					
				})
				
			}

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		var elms = node.querySelectorAll('[pop-bind]');
		
		if( typeof this.data_binder == 'undefined' )
			this.data_binder = [];
		
		for(var i=0; i< elms.length; i++){
		
			var dataToBind = elms[i].getAttribute('pop-bind');
			
			if( typeof this.data_binder[dataToBind] == 'undefined' )
				this.data_binder[dataToBind] = [];
			
			this.data_binder[dataToBind].push(elms[i]);
			
			var self = this.data_binder[dataToBind];
			
			var pathVar = data_ref;
			var lastVar = elms[i].getAttribute('pop-bind');
			var varSplitted = lastVar.split('.');
			for(var l in varSplitted){
				if(l==0) continue;
				lastVar = varSplitted[l];
				pathVar = pathVar[varSplitted[l-1]]
			}

			Object.defineProperty(pathVar, lastVar, {
				configurable: true,
				
				set: function(v) {
					this.value = v;
					
					for(i in self){
						self[i].innerHTML = v;
					}
					
				}
			});
		}
		
	}
		
	sub_poppins(node, data_ref){
		
		var elms = node.querySelectorAll('pop');
		
		for(var i=0; i< elms.length; i++){
			
			var name = elms[i].getAttribute('name');
			var dt = Pop.getDataByString(data_ref, elms[i].getAttribute('pop-data'));
			
			var p = this.app.getPoppin(name);
			
			if( Array.isArray(dt) ){
				dt._addPoppin(p, elms[i]);
				for(var l in dt)
					p.render(elms[i], dt[l]);
				
			}else{
				p.render(elms[i], dt);
			}
			
		}
		
	}

}