
const Match_MustacheEntry = /\{\{[A-Za-z][A-Za-z_\-:.#]*\}\}/gm;
const Match_MustacheOnly = /[\{\}]*/gm;

class PopLink{
	

    constructor(pop, parentElement){
		
		this.poppin = pop;
		this.parent = parentElement;
		
	}
	
	place(data){
		
		this.data = data;
		this.node = document.createElement('div');
		this.node.setAttribute('pop-comp', this.poppin.name);
		this.parse();
		this.binder();
		this.parent.appendChild(this.node);
		
	}
	
	parse(){
		
		var html = '';
		
		var m;
		var pointer = 0;
		
		do {
			m = Match_MustacheEntry.exec(this.poppin.template);
			if (m) {
				html += this.poppin.template.substring(pointer, m.index);
				var opt = null;
				var param = m[0].replace(Match_MustacheOnly, '');
				
				if( param.indexOf(':') > 0 ){
					var paramSplit = param.split(':');
					opt = paramSplit[0];
					param = paramSplit[1];
				}
				
				if(opt != null){
					// TODO manage option
				}
				
				// data
				var v = Pop.getValueByString(this.data, param);
				var withTag = true;
				var tmpPos = m.index - 1;
				console.log('#############')
				while(tmpPos >= 0){
					console.log('attenzioie', this.poppin.template.substr(tmpPos, 1));
					if( this.poppin.template.substr(tmpPos, 1) == "<" ){
						console.log('trovato, esco')
						withTag = false;
						break;
					}else if( this.poppin.template.substr(tmpPos, 1) == ">" ){
						withTag = true;
						break;
					}
					tmpPos--;
				}

				console.log('ok' , withTag)
				if(withTag) html += '<span pop-bind="'+m[0].replace(Match_MustacheOnly, '')+'">';
				html += v;
				if(withTag) html += '</span>';

				pointer += m.index + m[0].length;
			}
		} while (m);
		
		html += this.poppin.template.substring(pointer);
		
		this.node.innerHTML = html;
	}
	
	binder(){
		
		// POP-DATA-SET
		// pop-data-set="event:variable/method"
		// when event fire:
		// 		- variable: is setted with tag value. Only for INPUT, SELECT or TEXTAREA
		//		- method: run method as method(event, element, poppin)
		var elms = this.node.querySelectorAll('[pop-data-set]');
		
		for(var i=0; i< elms.length; i++){
			var paramVal = elms[i].getAttribute("pop-data-set").split(':');
			var eventType = paramVal[0];
			var dataParam = paramVal[1];
			elms[i].pop_data_set = dataParam;
			elms[i].pop_root = this;
			elms[i].addEventListener(eventType, function(ev){
				
				var pop = this.pop_root;
				var param = this.pop_data_set;
				
				Pop.setValueByString(pop.data, param, this.val());
				
			})

		}
		
		// POP-BIND
		// pop-bind="variable"
		// when variable change, inner
		var elms = this.node.querySelectorAll('[pop-bind]');
		
		if( typeof this.data_binder == 'undefined' )
			this.data_binder = [];
		
		for(var i=0; i< elms.length; i++){
		
			var dataToBind = elms[i].getAttribute('pop-bind');
			
			if( typeof this.data_binder[dataToBind] == 'undefined' )
				this.data_binder[dataToBind] = [];
			
			this.data_binder[dataToBind].push(elms[i]);
			
			var self = this.data_binder[dataToBind];
			
			var pathVar = this.data;
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
	
}