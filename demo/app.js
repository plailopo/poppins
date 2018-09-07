// Create APP
new PopApp('demo', ['HelloWorld', 'HelloZio', 'HelloSub', 'List']);


// Helo world
new Poppin( 'HelloWorld', '<h2>Hello Horld</h2>');


// Hello your nickname
new Poppin('HelloZio', {
	
	app : 'demo',
	template : '<div>\
		<h2>Hello {{user.nickname}}</h2>\
		<input pop-fire="keyup:user.nickname" value="{{user.nickname}}" />\
	</div>',
	
	data : {
		user : {
			nickname : 'Zio'
		}
	}

});

// Sub poppin
new Poppin('HelloSub', '<div>\
			<pop name="SubPop" pop-data="user"></pop>\
			<input pop-fire="keyup:user.nickname" value="{{user.nickname}}" />\
		</div>',
	{
		user : {
			nickname : 'Zio sub'
		}
	});
	
new Poppin('SubPop','<h2>Hello with sub Poppin: {{nickname}}</h2>');


// TODO LIST


var List = {
	
	items : [
		{id: 1, content : 'Zio 1'},
		{id: 2, content : 'Zio 2'},
		{id: 3, content : 'Zio 3'}
	],
			
	add : function(element, event){
		List.items.push({id: new Date().getTime(), content: element.val()});
		element.val('');
	},
	
	rem : function(element, event){
		for(i in this.data.list){
			if(this.data.list[i].id == element.dataset.id){
				this.data.list = this.data.list.slice(i, 1);
				break;
			}
		}
		
	}
}

new Poppin('List', {
	
	template : '<div><h2>Todo List</h2>\
				<input pop-fire="change:List.add" />\
				<ul>\
					<pop name="Item" pop-data="list"></pop>\
				</ul></div>',
	
	data : {
		list : List.items
	}

});

new Poppin('Item','<li data-id="{{id}}">{{content}}</li>');


