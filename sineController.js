var SINE_CONTROLLER = (function(){
	var interf = {};

	interf.SineController = function(){
		var frequency;
		var amplitude;
		var phaseShift;

		var canvDiv;
		var jqcanvas = $("<canvas>");

		var canvas = jqcanvas.get(0); 

		var context = canvas.getContext("2d");

		function redraw(){
			canvas.height = 200;
			canvas.width = canvDiv.width();
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

			var linew = 3;
			context.lineWidth = linew;
			context.strokeStyle = 'green';
			context.beginPath();

			function equation(x){
				return amplitude*Math.sin(x*frequency + phaseShift);
			}

			var arg;

			var maxSineH = ch/2-linew;
			for(var x = 0; x < canvas.width; x += 3) {
				var drawf = x === 0 ? context.moveTo : context.lineTo; 
				arg = x*(2*Math.PI/canvas.width);
				drawf.call(context,x,ch/2  + maxSineH*equation(arg));  
			}
			context.stroke();
		}

		$(window).resize(redraw);

		this.draw = redraw;

		this.createCanvasDiv = function(){
			var outerDiv = $("<div>", {"class":"col-xs-12 col-lg-8"}); 
			var panel = UI.createPanel(jqcanvas);
			canvDiv = panel.children().first();
			outerDiv.append(panel);
			return outerDiv;
		}

		this.createControlsDiv = function(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});
			form.append(createSliderInputDiv('Frequency', 
			function(x) { frequency = x; redraw(); }, 1, f,finv));

			form.append(createSliderInputDiv('Phase', 
			function(x) { phaseShift = x; redraw(); }, 1, f,finv));

			form.append(createSliderInputDiv('Amplitude', 
			function(x) { amplitude = x; redraw(); }, 1, f,finv));

			div.append(form);
			return div;
		}

		function createSliderInputDiv(description, valueChangeCallback, start, f, finv ){
			var div  = $("<div>",{class:'row'}  ); 

			var inputDiv = $('<div>', {class: 'form-group col-xs-6'});
			inputDiv.append($('<label>').text(description));

			var input = $('<input>', {type: "text", class: 'form-control'});
			inputDiv.append(input);

			var sliderDiv = $('<div>', {class: 'form-group col-xs-6'});
			sliderDiv.css({'padding-top': '30px'});

			var slider = $('<input>', {type: "range"});
			sliderDiv.append(slider);

			div.append(inputDiv);
			div.append(sliderDiv);

			DATA_BINDING.sliderInput(input,slider,1,100,30,valueChangeCallback,f,finv);

			return div;
		}

		function f(x) {	return Math.exp(5*x/100)*0.1;}

		function finv(x){
			return 100*(Math.log(x)/5)*10;
		}
	}

	return interf;
})();
