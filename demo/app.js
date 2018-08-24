
new PopApp('demo', ['HelloWorld', 'HelloZio']);

new Poppin({
	
	name : 'HelloWorld',
	app_name : 'demo',
	template : '<h2>Hello Horld</h2>',
	
});

new Poppin({
	
	name : 'HelloZio',
	app_name : 'demo',
	template : '<h2>Hello {{nickname}}</h2>\
	<input type="text" pop-data-set="keyup:nickname" />',
	
	data : {
		nickname : 'Zio'
	}
	
	
});


/*
new Poppin('PrintName', {
	
	selector : '#P-PrintName',
	
	yourname : 'Gigi',
	
	changeName: function(element, event, component){
		component.root_element.querySelector('span').innerHTML = component.root_element.querySelector('input').val();
	}
	
});
*/