var SINE_CONTROLLER = (function(){
	var interf = {};

	interf.SineController = function(id,changeCallback){
		var frequency;
		var amplitude;
		var phaseShift;

		var enabled=true;
		var canvDiv;
		var jqcanvas = $("<canvas>");
		var canvas = jqcanvas.get(0); 
		var context = canvas.getContext("2d");
	
		var once = 1;
		var bootstrapT;

		var redrawF = function(){}
	
		this.addedToDOM = function(){
			redrawF = redraw;
			$(window).resize(redraw);
			redraw();
		}
			
		this.getJQEl = function(){
			return jqEl;
		}

	 	this.getID = function() {return id;}
	 	this.isEnabled =  function() {return enabled;}
		this.getFrequency = function() {return frequency;}
		this.getAmplitude = function() {return amplitude;}
		this.getPhaseShift = function() {return phaseShift;}



		var jqEl = $('<div>', {class: 'row'});
		jqEl.append(createCanvasDiv());
		jqEl.append(createControlsDiv());

		this.detach = function(){
			var jqEl = jqEl.detach();
		}
		function createCanvasDiv(){
			var outerDiv = $("<div>", {"class":"col-xs-12 col-lg-8"}); 
			var panel = UI.createPanel(jqcanvas);
			canvDiv = panel.children().first();
			outerDiv.append(panel);
			return outerDiv;
		}

		function createControlsDiv(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});
			form.append(createSliderInputDiv('Frequency', 
			function(x) { frequency = x; redrawF(); }, 1, frequencyFInv(1), frequencyF, frequencyFInv));

			form.append(createSliderInputDiv('Phase', 
			function(x) { phaseShift = x; redrawF(); }, 0,phaseFInv(0), phaseF, phaseFInv));

			form.append(createSliderInputDiv('Amplitude', 
			function(x) { amplitude = x; redrawF(); }, 0, amplitudeFInv(1), amplitudeF, amplitudeFInv));

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
			var removeBtn = $('<button>', {class: 'btn btn-danger', type: 'button'}).text('Remove');
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

			enableCbDiv.append( enableCb);
			removeBtnDiv.append(removeBtn);

			div.append(removeBtnDiv);
			div.append(enableCbDiv);
			bootstrapT = enableCb;

			bootstrapT.bootstrapToggle();
					// <div class ="row">
					// 	<div class="col-xs-6">
					// 		<button type="button" class="btn btn-danger">Remove</button>
					// 	</div>
					// 	<div class="col-xs-6">
					// 		<div class="checkbox">
					// 			<label><input type="checkbox" value="">Option 2</label>
					// 		</div>
					// 	</div>
					// </div>
			return div;
		}




		function phaseF(x){ return 2*Math.PI*x/100;}
		function phaseFInv(x){ return x*100/(2*Math.PI);}

		function frequencyF(x) {	return Math.exp(5*x/100)*0.1;}

		function frequencyFInv(x){
			return 100*(Math.log(x*10)/5);
		}

		function amplitudeF(x){
			return x/100;
		}

		function amplitudeFInv(x){
			return x*100;
		}

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
			context.strokeStyle = '#5CB85C';
			context.beginPath();

			function equation(x){
				return amplitude*Math.sin(x*frequency + phaseShift);
			}

			var arg;
			var drawf;

			var maxSineH = ch/2-linew;
			for(var x = 0; x < cw; x += 3) {
				drawf = x === 0 ? context.moveTo : context.lineTo; 
				arg = x*(2*Math.PI/cw);
				drawf.call(context,x,ch/2  + maxSineH*equation(arg));  
			}
			context.stroke();
		}
	}

	return interf;
})();
