
Pop.getDataByString = function(s, obj) {

	if(obj == null) obj = window;

    var keys = s.split(".");

    for (var i = 0; i < keys.length; i++) {

        if (!(keys[i] in obj) || obj[keys[i]] === null || typeof obj[keys[i]] == 'undefined') {
            return null;
        }

        obj = obj[keys[i]];
    }

    return obj;
};

Pop.setDataByString = function(s, val, obj) {
	
	if(obj == null) obj = window;
	
	var str = '';
    var keys = s.split(".");
	var i;

    for (i = 0; i < keys.length; i++) {
	
		str += '{ "' + keys[i] + '" : ';
		
    }
	
	if(typeof val == 'string'){
		str += '"' + val + '"';
	}else{
		str += val;
	}
	
	for (i = 0; i < keys.length; i++) {
	
		str += '}';
		
    }
	
	obj = Pop.extend(obj, JSON.parse(str));
    
};

Pop.extend = function(){
	for(var i=1; i<arguments.length; i++)
		for(var key in arguments[i])
			if(arguments[i].hasOwnProperty(key)) { 
				if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
					Pop.extend(arguments[0][key], arguments[i][key]);
				else
				   arguments[0][key] = arguments[i][key];
			 }
	return arguments[0];
};