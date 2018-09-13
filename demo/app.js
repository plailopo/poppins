

// Create APP
var app = new PopApp('demo');


// Helo world
new Poppin( 'HelloWorld', '<h2>Hello Horld</h2>');
app.loadPop('HelloWorld');


var d = {
	user : {
		nickname : 'Zio'
	}
}

// Hello your nickname
new Poppin('HelloZio', {
	
	app : 'demo',
	template : '<div>\
		<h2>Hello {{user.nickname}}</h2>\
		<input pop-fire="keyup:user.nickname" value="{{user.nickname}}" />\
	</div>',
	
	data : d

});
app.loadPop('HelloZio');


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
app.loadPop('HelloSub');


// TODO LIST


var List = {
	
	items : [
		{id: 1, content : 'Zio 1'},
		{id: 2, content : 'Zio 2'},
		{id: 3, content : 'Zio 3'}
	],
			
	add : function(element, event){
		console.log('Lista:', List.items)
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
					<pop name="Item" pop-data="items"></pop>\
				</ul></div>',
	
	data : List

});

new Poppin('Item','<li data-id="{{id}}">{{content}}</li>');

app.loadPop('List');
