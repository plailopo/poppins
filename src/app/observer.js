
var DataObserver = {
	
	object_handler : {
		
		get: function(target, property) {
			return Reflect.get(...arguments);
		},
		
		set(obj, prop, value) {
			if(typeof value === 'object'){
				value = DataObserver.data_parser(value);
			}
			return Reflect.set(...arguments);
		}	
	},
	
	data_parser : function(o){
	
	
		Object.defineProperty(o, "_addPoppin", {
			configurable : true,
			value: function(pop, elm){
				if ( this._poppins == undefined )
					this._poppins = [];
				this._poppins.push({p:pop, e:elm})
			}
		});
		
		Object.defineProperty(o, "_getPoppin", {
			configurable : true,
			value: function(){
				return this._poppins
			}
		});
		
		
		if(Array.isArray(o)){
			Object.defineProperty(o, "push", {
				configurable : true,
				value: function(o){
					[].push.call(this, o);
					for(var p in this._poppins)
						this._poppins[p].p.render(this._poppins[p].e, o);
				}
			});
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

