function ResponsiveCanvas(className){
	var $canvas = $('<canvas>');
	this.canvas = $canvas.get(0);
	this.context = this.canvas.getContext("2d");
	
	this.$ = $("<div>", {"class":className}); 
	var panel = UI.createPanel($canvas);
	//create canvDiv propery
	this.$canvDiv = panel.children().first();
	this.$.append(panel);
}

ResponsiveCanvas.prototype.updateWidth = function(){
	this.canvas.width = this.$canvDiv.width();
}

ResponsiveCanvas.prototype.addedToDOM = function(){
	$(window).resize(function(){this.redraw();});
	this.redraw();
}

