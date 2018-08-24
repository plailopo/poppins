# Poppins
Funny JS



# Few rules

 - A Poppin is a big or small DOM piece
 - A Poppin can to contain more other Poppins, so it can be contained by another.
 - A Poppin has a behaviors by JS with data and method
 - In a Poppin is possible bind a tag to a data or viceversa

# Javascript side

new Poppin('HelloWorld', {
	
	template 	: HTML String,
	dom_link	: Root Dom Element
	
	// Method
	place(DOM element, data)	: place rendered HTML poppin on DOM. If dom element is place on top of app (remove all others)
								  if data is an array, place N of it
	

	// custom data
	firstname : 'Gigi',
	lastname  : 'Smith',
	  ...
	
	// custom methods
	doSomething: function(...){
		...
	},
	
});

new PoppinLink(poppin, dom element, data){
}
 
# HTML attributes

 - app='name'
	Define a App area. Poppins work only inside it
	
 - pop="name"
	Define a poppin place, by name
	
	
 - p-bind="event#method/variable"
		Make a binder for the element. When event fire
		- if exist method in Behavior, run it
		- else set the veriable... if not exist create it

 - p-data="data variable"
		Print data variable on html content
 - p-data-once="data variable"
		Print data variable on html content

# NON HTML entries

 - {{param}}
	resolve this entry with the data value associated and bind with it. When data param change, the entry also change
 - {{once:param}}
	resolve this entry with the data value associated , one time.. it not bind