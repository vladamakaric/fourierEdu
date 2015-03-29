var CANVAS_DRAW = (function(){

	var interf = {};

	interf.drawCoordSys = function(c,w,h){
		c.lineWidth = 1;

		c.beginPath();
		c.moveTo(0, h/2);
		c.lineTo(w, h/2);
		c.stroke();

		c.beginPath();
		c.moveTo(w/2,0 );
		c.lineTo(w/2, h);
		c.stroke();
	}

	interf.drawCenteredArray = function(c,w,h,arr){
		c.beginPath();

		var step = w/(arr.length-1);
		var x=0;
		var drawf;
		var val;

		for(var i=0; i<arr.length; i++){
			drawf = x === 0 ? c.moveTo : c.lineTo; 
			drawf.call(c,x,-arr[i] + h/2);  
			x+=step;
		}

		c.stroke();
	}

	interf.drawFunction = function(c,start, end, step, func){
		c.beginPath();

		var drawf;
		for(var x = start; x < end; x += step) {
			drawf = x === 0 ? c.moveTo : c.lineTo; 
			drawf.call(c,x,func(x));  
		}

		c.lineTo(c,end,func(end));
		c.stroke();
	}

	return interf;
})();
