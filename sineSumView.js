var FREQUENCY_ADDER = (function(interf){

	interf.SineSumView = function(){
		var sineWaves;
		var responsiveCanvas = new ResponsiveCanvas("col-xs-12 col-lg-8", 'Sumation');

		var $div = $('<div>', {class: 'row'});
		$div.append(responsiveCanvas.$);

		this.get$ = function() { return $div;}
		this.refreshSines = function(sws){
			sineWaves = sws;
		}

		this.addedToDOM = function(){
			responsiveCanvas.addedToDOM();
		}

		responsiveCanvas.redraw = function(){
			var canvas = this.canvas;
			var context = this.context;

			canvas.height = 300;
			responsiveCanvas.updateWidth();
			var ch = canvas.height;
			var cw = canvas.width;

			context.clearRect(0, 0, ch, cw);
			context.lineWidth = 1;

			context.beginPath();
			context.moveTo(0, ch/2);
			context.lineTo(cw, ch/2);
			context.stroke();

			context.beginPath();
			context.moveTo(cw/2,0 );
			context.lineTo(cw/2, ch);
			context.stroke();

			// var linew = 3;
			// context.lineWidth = linew;
			// context.strokeStyle = '#5CB85C';
			// context.beginPath();
            //
			// function equation(x){
			// 	return amplitude*Math.sin(x*frequency + phaseShift);
			// }
            //
			// var arg;
			// var drawf;
			// var maxSineH = ch/2-linew;
			// for(var x = 0; x < cw; x += 3) {
			// 	drawf = x === 0 ? context.moveTo : context.lineTo; 
			// 	arg = x*(2*Math.PI/cw);
			// 	drawf.call(context,x,ch/2  + maxSineH*equation(arg));  
			// }
			// context.stroke();
		}
	}

	return interf;
})(FREQUENCY_ADDER || {});
