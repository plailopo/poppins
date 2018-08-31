
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
				html += '<span pop-bind="'+m[0].replace(Match_MustacheOnly, '')+'">' + v + '</span>';
				pointer += m.index + m[0].length;
			}
		} while (m);
		
		html += this.poppin.template.substring(pointer);
		
		this.node.innerHTML = html;
	}
	
	binder(){
		
		// pop-data-set
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
		
		// pop-bind
		var elms = this.node.querySelectorAll('[pop-bind]');
		
		if( typeof this.data_binder == 'undefined' )
			this.data_binder = [];
		
		for(var i=0; i< elms.length; i++){
		
			var dataToBind = elms[i].getAttribute('pop-bind');
			
			if( typeof this.data_binder[dataToBind] == 'undefined' )
				this.data_binder[dataToBind] = [];
			
			this.data_binder[dataToBind].push(elms[i]);
			
			var self = this.data_binder[dataToBind];
			console.log(self)
			Object.defineProperty(this.data, elms[i].getAttribute('pop-bind'), {
				configurable: true,
				
				set: function(v) {
					this.value = v;
					console.log('aloa',  self)
					for(i in self){
						console.log(self[i])
						self[i].innerHTML = v;
					}
					
				}
			});
		}
		
		
	}
	
}