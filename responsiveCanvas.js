function ResponsiveCanvas(className, panelName){
	var $canvas = $('<canvas>');
	this.canvas = $canvas.get(0);
	this.context = this.canvas.getContext("2d");
	
	this.$ = $("<div>", {"class":className}); 
	var panel = UI.createPanel($canvas);
	this.$canvDiv = panel.children().first();

	if(panelName)
		panel.prepend($('<div>', {class: "panel-heading"}).text(panelName));

	this.$.append(panel);
}

ResponsiveCanvas.prototype.updateWidth = function(){
	this.canvas.width = this.$canvDiv.width();
}

ResponsiveCanvas.prototype.addedToDOM = function(){
	var that = this;
	$(window).resize(function(){that.redraw();});
	this.redraw();
}

