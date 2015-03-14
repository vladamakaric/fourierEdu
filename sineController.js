var SINE_CONTROLLER = (function(){
	var interf = {};

	interf.SineController = function(){
		var frequency = 1;
		var apmplitude = 1;
		var phaseShift = 0;

		var canvDiv;
		var jqcanvas = $("<canvas>");

		var canvas = jqcanvas.get(0); 

		var context = canvas.getContext("2d");

		function redraw(){
			canvas.height = 300;
			canvas.width = canvDiv.width();
			context.clearRect(0, 0, canvas.width, canvas.height);

			var halfHeight = canvas.height/2;

			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(0, canvas.height/2);
			context.lineTo(canvas.width, canvas.height/2);
			context.stroke();

			context.beginPath();
			context.moveTo(canvas.width/2,0 );
			context.lineTo(canvas.width/2, canvas.height);
			context.stroke();

			context.lineWidth = 3;
			context.strokeStyle = 'green';
			context.beginPath();
			var n = canvas.width/2;
		
			function equation(x){
				return Math.sin(x*frequency/100);
			}

			for(var x = 0; x < canvas.width; x += 2) {
				if(x===0)
					context.moveTo(x, halfHeight  + halfHeight*equation(x) );
				else
					context.lineTo(x, halfHeight  + halfHeight*equation(x));
			}
			context.stroke();
		}

		$(window).resize(redraw);

		this.draw = redraw;

		this.createCanvasDiv = function(){
			canvDiv  = $("<div>", {"class":"col-xs-12 col-lg-8"}); 
			canvDiv.append(jqcanvas);
			return canvDiv;
		}

		this.createControlsDiv = function(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});
			form.append(createSliderInputDiv('Frekvencija', 
			function(x) { frequency = x; redraw(); }, 1, f,finv));

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

		function f(x) {	return Math.exp(5*x/100);}

		function finv(x){
			return 100*(Math.log(x)/5);
		}
	}

	return interf;
})();
