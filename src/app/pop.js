

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
			
			Log.debug('POPPIN', 'Poppin without options ' + this.id + '... Nothing to do!');
			return;
			
		}

		if(typeof this.app == 'string'){
			this.app = Pop.getApp(this.app);
		}else{
			this.app = Pop.getApp();
		}

		this.app.addPoppin(this);
		
		if( Pop.load ){
			this.load();
		}else{
			Pop.waiting_poppins.push(this);
		}
		
		
	}
	
	load(){
		
		if(this.data === undefined)
			this.data = {};
		
		DataObserver.data_parser(this.data);
		
		Log.debug('POPPIN', 'Poppin "' + this.id + '" loaded', this);
		
	}
	
	render(elem_cursor, data_ref){
		
		//se non viene passato l'elemento cursore lo creo
		if(elem_cursor == null){
			elem_cursor = document.createElement('pop');
			elem_cursor.setAttribute('id', this.id);
			this.app.e.appendChild(elem_cursor);
		}
		
		// Se non passati i dati ci appiccico quelli del pop
		if(data_ref == null){
			data_ref = this.data;
		}

		Log.debug('POPPIN', '### rendering Pop ' , this.id);
		Log.debug('POPPIN', 'Parent', parent);
		Log.debug('POPPIN', 'Data', data_ref);

		var html = ParserHTML.html_by_template(this.template, data_ref);
		
		var tmpElm = document.createElement('div');
		tmpElm.innerHTML = html;
		Log.debug('POPPIN', 'Tmpl elem', tmpElm);
		var node = tmpElm.firstChild;
		if(node == null) return;
		node.poppin = this;
		node.pop_data = data_ref;
		Log.debug('POPPIN', 'Node', node);

		elem_cursor.parentElement.insertBefore(node, elem_cursor.nextSibling);
		elem_cursor.remove();

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

			var p = this.app.getPoppin(id);
			var pop_data = elms[i].getAttribute('pop-data') != null ? elms[i].getAttribute('pop-data') : null;

			if(p == null) continue;
			
			var dt = p.data;
			if(pop_data != null)
				dt = Pop.getDataByString(pop_data, data_ref);

			Log.debug('POPPIN', 'go sub render', id, dt, pop_data)

			if(p != null){
				if( Array.isArray(dt) ){
					
					dt._addPoppin(p, elms[i].parentElement);
					
					for(var l = 0; l < dt.length; l++){
						var elm_cursor = elms[i];
						if(l < dt.length-1){
							elm_cursor = elms[i].cloneNode(true);
							elms[i].parentElement.appendChild(elm_cursor);
						}
						p.render(elm_cursor, dt[l]);
					}
				}else{
					p.render(elms[i], dt);
				}
			}
			
		}
		
	}

}
