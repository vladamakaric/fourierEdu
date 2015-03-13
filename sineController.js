var SINE_CONTROLLER = (function(){
	var interf = {};

	interf.SineController = function(){
		this.frequency = 1;
		this.apmplitude = 1;
		this.phaseShift = 0;

		var jqcanvas = $("<canvas>");
		jqcanvas.css({"width": '100%', 'height':'300px'});

		var canvas = jqcanvas.get(); 

		function redraw(){
			// this.canvas...
		}

		this.createCanvasDiv = function(){
			var div  = $("<div>", {"class":"col-xs-12 col-lg-8"}); 
			div.append(jqcanvas);
			return div;
		}

		this.createControlsDiv = function(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});
			form.append(createSliderInputDiv('Frekvencija', 
			function(x) { this.frequency = x; redraw(); }, 1, f,finv));

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
