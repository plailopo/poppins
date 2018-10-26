
var DataObserver = {
	
	object_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set: function(obj, prop, value) {
			var i;
			if(typeof value === 'object'){
				value = DataObserver.data_parser(value);
				for(i in obj._pop_binders[prop]){
					// ... 
				}
			}else{
				for(i in obj._pop_binders[prop]){
					obj._pop_binders[prop][i].innerHTML = value;
				}
			}
			return Reflect.set(...arguments);
		}
		
	},
	
	array_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set: function(target, property, value, receiver) {
			var i;
			if( property != 'length' && typeof value === 'object'){
				value = DataObserver.data_parser(value);
				for(i in target._poppins){
					var elem_cursor = document.createElement('pop');
					elem_cursor.setAttribute('id', target._poppins[i].p.id);
					target._poppins[i].e.appendChild(elem_cursor);
					target._poppins[i].p.render(elem_cursor, value);
				}
			}else if( property == 'length' && typeof value === 'number'){
				for(i in target._poppins){
					var pointer = target._poppins[i].e.parentElement.children.length - value - 1;
					var many = pointer;
					for( many; many > 0; many--){
						target._poppins[i].e.parentElement.children[pointer].remove();
					}
				}
			}
			// you have to return true to accept the changes
			return Reflect.set(...arguments);
		}
		
	},
	
	data_parser : function(o){
		
		if( o._poppins !== undefined ) return o;
		
		// Defining POPPINS
		// Poppins list for data
		Object.defineProperty(o, "_poppins", {
			configurable : false,
			value: []
		});
	
		Object.defineProperty(o, "_addPoppin", {
			configurable : false,
			value: function(pop, elm){
				this._poppins.push({p:pop, e:elm});
			}
		});
		
		Object.defineProperty(o, "_getPoppin", {
			configurable : false,
			value: function(){
				return this._poppins;
			}
		});
		
		// Defining BINDER list
		Object.defineProperty(o, "_pop_binders", {
			configurable : false,
			value: []
		});
	
		Object.defineProperty(o, "_addBinder", {
			configurable : false,
			value: function(name, elm){
				if( this._pop_binders[name] === undefined )
					this._pop_binders[name] = [];
				
				this._pop_binders[name].push(elm);
			}
		});
		
		Object.defineProperty(o, "_getBinders", {
			configurable : false,
			value: function(){
				return this._pop_binders;
			}
		});
		
		if(Array.isArray(o)){
			
			o = new Proxy(o, DataObserver.array_handler);

		}else{
			o = new Proxy(o, DataObserver.object_handler);
			
		}

		for (var i in o) {
			if (o[i] !== null && typeof(o[i])=="object") {
				o[i] = DataObserver.data_parser(o[i]);
			}
		}
		
		return o;
	}
};

