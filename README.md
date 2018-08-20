# poppins
Funny coding



# Rules

 - Every Component goes into default app, if not specified

# HTML attributes

 - p-comp="name"
		Define a component by html
 - p-bind="event#method/variable"
		Make a binder for the element. When event fire
		- if exist method in Behavior, run it
		- else set the veriable... if not exist create it
 - p-data="data variable"
		Print data variable on html content
 - p-data-bind="data variable"
		Print data variable on html content and catch
 - p-loop="list#item_name"
		Loop content with "list" array name into "item_name" element

	
	
	var data = {
	get user(){
  	return this._value;
  },
  set user(v){
  	this._value = this._value + v
  }
}

console.log(data.user)
data.user = 'as'
console.log(data.user)
console.log(data.__lookupSetter__('user'))
data.user = 'uu'
console.log(data.user)
data.__defineSetter__('user', function(v){
	this._value = this._value + " - " + v
})
console.log(data.__lookupSetter__('user'))
data.user.setValue('aa')
console.log(data.user)