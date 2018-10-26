
Log.add_category('APP', Log.LEVEL_DEBUG, true, true);
Log.add_category('POPPIN', Log.LEVEL_INFO, true, true);

// Create APP
var app = new PopApp('demo');


// Helo world
new Poppin( 'CiaoWorld', '<div><h2>Ciao mondo</h2><hr /></div>');
app.loadPop('CiaoWorld');


var d = {
	user : {
		nickname : 'Zio'
	}
};

// Ciao your nickname
new Poppin('CiaoZio', {
	
	app : 'demo',
	template : '<div>\
		<h2>Ciao {{user.nickname}}</h2>\
		<input pop-fire="keyup:user.nickname" value="{{user.nickname}}" />\
		<hr />\
	</div>',
	
	data : d

});
app.loadPop('CiaoZio');


// Sub poppin
new Poppin('CiaoSub', '<div>\
			<pop id="SubPop" pop-data="user"></pop>\
			<input pop-fire="keyup:user.nickname" value="{{user.nickname}}" />\
			<hr />\
		</div>',
	{
		user : {
			nickname : 'Zio sub'
		}
	});
	
new Poppin('SubPop','<h2>Ciao con sub Poppin: {{nickname}}</h2>');
app.loadPop('CiaoSub');


// TODO LIST


var List = {
	
	items : [
		{id: 1, content : 'Zio 1'},
		{id: 2, content : 'Zio 2'},
		{id: 3, content : 'Zio 3'}
	],
			
	add : function(poppin, data, element, event){
		
		if(true) // By data
			data.items.push(  {id: new Date().getTime(), content: element.val()}  );
		else // By List
			List.items.push(  {id: new Date().getTime(), content: element.val()}  );
		element.val('');
	},
	
	rem : function(poppin, data, element, event){
		
		if(true){
			// Remove by element
			element.closest('li').remove();
		}else{
			// Remove by data
			var id = data.id;
			for(var i in List.items){
				if(List.items[i].id == id){
					List.items.splice(i, 1);
					break;
				}
			}
		}
		Log.debug('APP', 'Items list', List.items.length);
	},
	
	change_class : function(poppin, data, element, event){
		element.closest('li').toggleClass('ciccio');
	}
};

new Poppin('List', {
	
	template : '<div><h2>Todo List</h2>\
				<input pop-fire="change:List.add" />\
				<ul>\
					<pop id="Item" pop-data="items"></pop>\
				</ul><hr /></div>',
	
	data : List

});

new Poppin('Item','<li data-id="{{id}}">{{content}} (<a href="javascript:void(0);" pop-fire="click:List.rem;mouseenter:List.change_class;mouseout:List.change_class">x</a>)</li>');

app.loadPop('List');

