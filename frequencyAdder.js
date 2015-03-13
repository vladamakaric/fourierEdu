var FREQUENCY_ADDER = (function(interf){

	interf.loadInto = function(jqPageEl){
		jqPageEl.html("FA");	
	}

	// var c = document.getElementById("canvas");
	// var ctx = c.getContext("2d");
    //
    //
    // $(window).resize(respondCanvas);
    //
    // function respondCanvas() {
    //     c.heigth = $("#daily").height();
    //     c.width = $("#daily").width();
    //     ctx = c.getContext("2d");
	// 	ctx.beginPath();
	// 	ctx.arc(95, 50, 40, 0, 2 * Math.PI);
	// 	ctx.stroke();
    // }
    //
    // //Initial call 
    // respondCanvas();
	return interf;

})(FREQUENCY_ADDER || {});
