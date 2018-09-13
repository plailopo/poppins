
var DataObserver = {
	
	object_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set: function(obj, prop, value) {
			console.log('set', prop, value, obj._pop_binders)
			if(typeof value === 'object'){
				value = DataObserver.data_parser(value);
				console.log(obj._pop_binders)
				for(var i in obj._pop_binders[prop]){
					console.log(i)
				}
			}else{
				for(var i in obj._pop_binders[prop]){
					obj._pop_binders[prop][i].innerHTML = value;
				}
			}
			return Reflect.set(...arguments);
		}
		
	},
	
	array_handler : {
		
		get: function(target, property) {
			//console.log('getting array ' + property + ' for ' + target);
			// property is index in this case
			return target[property];
		},
		
		set: function(target, property, value, receiver) {
			console.log('setting array ' + property + ' for ' + target + ' with value ' + value);
			target[property] = value;
			// you have to return true to accept the changes
			return true;
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
				this._poppins.push({p:pop, e:elm})
			}
		});
		
		Object.defineProperty(o, "_getPoppin", {
			configurable : false,
			value: function(){
				return this._poppins
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
				console.log(name, elm)
				if( this._pop_binders[name] === undefined )
					this._pop_binders[name] = [];
				
				this._pop_binders[name].push(elm);
			}
		});
		
		Object.defineProperty(o, "_getBinders", {
			configurable : false,
			value: function(){
				return this._pop_binders
			}
		});
		
		if(Array.isArray(o)){
			
			o = new Proxy(o, DataObserver.object_handler);
			/*
			Object.defineProperty(o, "push", {
				configurable : true,
				value: function(o){
					[].push.call(this, o);
					if ( typeof(o) == "object") {
						o = DataObserver.data_parser(o);
					}
				}
			});
			*/
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
}

