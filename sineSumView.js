var FREQUENCY_ADDER = (function(interf){

	interf.SineSumView = function(){
		var sineWaves=[];
		var responsiveCanvas = new ResponsiveCanvas("col-xs-12 col-lg-8", 'Sumation');

		var $div = $('<div>', {class: 'row'});
		$div.append(responsiveCanvas.$);

		this.get$ = function() { return $div;}

		this.refreshSineWaves = function(sws){
			sineWaves = sws;
			responsiveCanvas.redraw();
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
			CANVAS_DRAW.drawCoordSys(context, cw, ch);

			var linew = 3;
			context.lineWidth = linew;
			context.strokeStyle = '#5CB85C';



			function f(x){

				function equation(x){
					var val=0;

					sineWaves.forEach(function(sw) {
						val += sw.amplitude*Math.sin(x*sw.frequency + sw.phaseShift);
					});

					if(sineWaves.length)
						return val/sineWaves.length;
					else 
						return 0;

				}

				var maxSineH = ch/2-linew;
				var arg = x*(2*Math.PI/cw);
				return ch/2  + maxSineH*equation(arg);
			}

			CANVAS_DRAW.drawFunction(context, 0, cw, 3, f);
			var scale = sineWaves.length ? sineWaves.length : 1;
			context.font="20px Georgia";
			
			context.fillText(scale,cw/2 + 10,25);
			context.fillText(-scale,cw/2 + 10,ch-15);
		}
	}

	return interf;
})(FREQUENCY_ADDER || {});
