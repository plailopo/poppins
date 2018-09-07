# Poppins
Funny JS


## Definitions

new PopApp('name', [ ... poppins list onload ... ]);

new Poppin('name', 'DOM selector or HTML template')
new Poppin('name', {
	template : (mandatory) - DOM selector or HTML template,
	app		 : (optional)  - app name or app object reference
	data	 : (optional)  - JSON initial data
	method	 : (optional)  - callable methods
})


# Few of ideas

 - A Poppin is a big or small DOM piece
 - A Poppin can to contain more other Poppins, so it can be contained by another.
 - A Poppin has a behaviors with data and method
 - In a Poppin is possible bind a tag to a data and viceversa
 - A poppin template must have only a tag container. Other tags will be ignored
 
# HTML tag

 - <app name='xxx' />
	Define a App area. Poppins work only inside it
	
 - <pop name="yyy" />
	Define a poppin place, by name 
 
# HTML attributes
	
 - pop-fire="event:method/variable;event:....."
		Make a binder for the element. When event fire:
		- if exist method in Behavior, run it
		- else set the veriable. If not exist create it

 - pop-data="data variable"
		Print data variable on html content and keep refreshed onchange
 - pop-data-once="data variable"
		Print data variable on html content

# Mustaches entries

 - {{param}}
	Like p-data attribute, resolve this entry with the data value associated and bind with it. 
	When data param change, the entry also change
 - {{once:param}}
	Like p-data-once resolve this entry with the data value associated , only in rendering.. it not bind