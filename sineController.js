var FREQUENCY_ADDER = (function(interf){

	interf.SineController = function(changeCallback){
		var frequency = 1;
		var amplitude=1;
		var phaseShift=0;
		var enabled=true;

		var jqEl = $('<div>', {class: 'row'});

		var responsiveCanvas = new ResponsiveCanvas("col-xs-12 col-lg-8");
		jqEl.append(responsiveCanvas.$);
		jqEl.append(createControlsDiv());

		var that = this;

		this.addedToDOM = function(){
			responsiveCanvas.addedToDOM();
		}

		this.getJQEl = function(){return jqEl;}
		this.isEnabled =  function() {return enabled;}
		this.getFrequency = function() {return frequency;}
		this.getAmplitude = function() {return amplitude;}
		this.getPhaseShift = function() {return phaseShift;}

		function createControlsDiv(){
			function phaseF(x){ return 2*Math.PI*x/100;}
			function phaseFInv(x){ return x*100/(2*Math.PI);}
			function frequencyF(x) {	return Math.exp(5*x/100)*0.1;}
			function frequencyFInv(x){	return 100*(Math.log(x*10)/5);}
			function amplitudeF(x){return x/100;}
			function amplitudeFInv(x){return x*100;}
			function redraw(){ responsiveCanvas.redraw();}

			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});

			form.append(createSliderInputDiv('Frequency', 
						function(x) { frequency = x; redraw(); changeCallback(); }, 1, frequency, frequencyF, frequencyFInv));

			form.append(createSliderInputDiv('Phase', 
						function(x) { phaseShift = x; redraw();  changeCallback();}, 0, phaseShift, phaseF, phaseFInv));

			form.append(createSliderInputDiv('Amplitude', 
						function(x) { amplitude = x; redraw();  changeCallback();}, 0, amplitude, amplitudeF, amplitudeFInv));

			form.append(createOptionsDiv());
			div.append(form);
			return div;
		}

		function createSliderInputDiv(description, valueChangeCallback, min,initVal, f, finv ){

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

			DATA_BINDING.sliderInput(input,slider,min,100,initVal,valueChangeCallback,f,finv);

			return div;
		}

		function createOptionsDiv(){
			var div  = $("<div>",{class:'row'}  ); 
			var removeBtnDiv = $('<div>', {class: 'col-xs-6'});
			var enableCbDiv = $('<div>', {class: 'col-xs-6'});
			var removeBtn = $('<button>', {class: 'btn btn-danger', type: 'button', href: 'javascript:void(0)'}).text('Remove');
			var enableCb = $('<input>', {'type': 'checkbox', 
				value: "", 
				'data-toggle':'toggle'});
			// 'data-on':'enabled',
			// 'data-off':'disabled'});

			enableCb.prop('checked', true);
			enableCb.change(function(){
				enabled = this.checked;	
				changeCallback();
			});

			removeBtnDiv.on('click', function(){changeCallback(that);});

			enableCbDiv.append( enableCb);
			removeBtnDiv.append(removeBtn);

			div.append(removeBtnDiv);
			div.append(enableCbDiv);

			enableCb.bootstrapToggle();
			return div;
	}

	responsiveCanvas.redraw = function(){
		var canvas = this.canvas;
		var context = this.context;

		canvas.height = 200;
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
				return amplitude*Math.sin(x*frequency + phaseShift);
			}
			var maxSineH = ch/2-linew;
			var arg = x*(2*Math.PI/cw);
			return ch/2  + maxSineH*equation(arg);
		}

		CANVAS_DRAW.drawFunction(context, 0, cw, 3, f);
	}
}

	interf.SineController.prototype.getSineWave = function(){
		return new SineWave(this.getAmplitude(), this.getFrequency(), this.getPhaseShift());
	}
return interf;
})(FREQUENCY_ADDER || {});
