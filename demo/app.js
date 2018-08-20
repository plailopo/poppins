
new PoppinsComp('#P-PrintName', {
	
	yourname : 'Gigi',
	
	changeName: function(element, event, component){
		component.e.querySelector('span').innerHTML = component.e.querySelector('input').val();
	}
	
});
