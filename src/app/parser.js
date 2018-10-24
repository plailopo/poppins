
const Match_MustacheEntry = /\{\{[A-Za-z][A-Za-z_\-:.#]*\}\}/gm;
const Match_MustacheOnly = /[\{\}]*/gm;

var ParserHTML = {
	
	
	html_by_template : function(tmpl, data){
			
		tmpl = tmpl.trim();
		
		var html = '';
		
		var m;
		var pointer = 0;
		
		do {
			m = Match_MustacheEntry.exec(tmpl);
			if (m) {
				html += tmpl.substring(pointer, m.index);
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
				var v = Pop.getDataByString(param, data);
				var withTag = true;
				var tmpPos = m.index - 1;
				
				while(tmpPos >= 0){
					if( tmpl.substr(tmpPos, 1) == "<" ){
						withTag = false;
						break;
					}else if( tmpl.substr(tmpPos, 1) == ">" ){
						withTag = true;
						break;
					}
					tmpPos--;
				}
				
				if(withTag) html += '<span pop-bind="'+m[0].replace(Match_MustacheOnly, '')+'">';
				html += v == null ? '' : v;
				if(withTag) html += '</span>';
				
				pointer = m.index + m[0].length;
			}
		} while (m);
		
		html += tmpl.substr(pointer);
		
		return html;
	}
};