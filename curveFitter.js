var CURVE_FITTER = (function(interf){

	interf.loadInto = function($insPoint){
		var cf = new CurveFitter();
		$insPoint.append(cf.get$());
		cf.addedToDOM();
	}

	function CurveFitter(){
		//state
		var calculated = false;
		var sinNum = true;
		var mousePressed = false;
		var fftCoefs = {};
		var funcLen = 64;
		var funcArr = new Float64Array(new ArrayBuffer(funcLen*8));
		var prevMousePos = {x:-1,y:-1};

		var div$ = $('<div>', {class: 'row'});
		var $inputForm;
		var modeCb;

		/////////////////////////////////////////

		initFuncArr();
		
		var responsiveCanvas = new ResponsiveCanvas("col-xs-12 col-lg-8");
		var canvas = responsiveCanvas.canvas;
		var canvEvtMngr = CanvPtrEventMngr(canvas);
		div$.append(responsiveCanvas.$);

		var $controlsDiv =createControlsDiv(); 
		div$.append($controlsDiv);

		var that = this;

		this.addedToDOM = function(){
			responsiveCanvas.addedToDOM();
			modeCb.bootstrapToggle();
			modeCb.bootstrapToggle('disable');

			canvEvtMngr.attachEvents(); 

			canvEvtMngr.ptrMove = function(pos){
				if(!canvEvtMngr.ptrPressed) return;	
			
				var currNormPos = {x:pos.x, y:canvas.height/2-pos.y};

				if(prevMousePos.x === -1)
					modifyFArrLineSegment(currNormPos, currNormPos);	
				else {
					modifyFArrLineSegment(currNormPos, prevMousePos);	
				}

				prevMousePos = currNormPos;
				responsiveCanvas.redraw();
			}

			canvEvtMngr.ptrUp = function(pos){
				prevMousePos = {x:-1,y:-1};
			}

			function modifyFArrLineSegment(a,b){
				var step =canvas.width/(funcLen-1); 
				var leftP = a.x < b.x ? a : b;
				var rightP = a.x < b.x ? b : a;

				var dx = rightP.x - leftP.x;

				var leftIndx = Math.floor((leftP.x + step/2)/step);

				if(dx<step){
					funcArr[leftIndx] = leftP.y;
					return;
				}
				
				var k = (rightP.y - leftP.y)/dx;
				var pointNum = Math.floor(dx/step)+1;

				for(var i=0; i<pointNum; i++){
					funcArr[leftIndx + i] = leftP.y + k*i*step;
				}
			}
		}

		this.get$ = function(){return div$;}

		function offCalc(){
			calculated = false;
		}

		function onCalc(){
			calculated = true;

			fftCoefs.real =new Float64Array(funcArr);
			fftCoefs.imag =Array.apply(null, new Array(funcLen)).map(Number.prototype.valueOf,0);

			transform(fftCoefs.real, fftCoefs.imag);
			inverseTransform(fftCoefs.real, fftCoefs.imag);

			$.each(fftCoefs.real, function(i,val){
				console.log(val/funcLen);
			});

			$inputForm.hide();
			$controlsDiv.append("smor");
		}

		function onReset(){
			initFuncArr();
			responsiveCanvas.redraw();
		}
		
		function initFuncArr(){ 
			for(var i=0; i<funcLen; i++){
				funcArr[i] = 0;
			}
		}

		function createControlsDiv(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			$inputForm = $('<form>',{class:'form', role: 'form'});

			$inputForm.append(createOptionsDiv());
			$inputForm.append(createSliderInputDiv('Term number', function(){}, 50));
			div.append($inputForm);
			// $inputForm.hide();
			return div;
		}

		function createSliderInputDiv(description, valueChangeCallback, initVal){
			var div = $("<div>",{class:'row'}  ); 
			div.css({'margin-top': '20px'});

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

			DATA_BINDING.sliderInput(input,slider,0,funcLen,initVal,valueChangeCallback);

			return div;
		}

		function createOptionsDiv(){
			var div = $("<div>",{class:'row'}  ); 
			var calcBtnDiv = $('<div>', {class: 'col-xs-4'});
			var resetBtnDiv = $('<div>', {class: 'col-xs-4'});
			var modeCbDiv = $('<div>', {class: 'col-xs-4'});
			var calcBtn = $('<button>', {class: 'btn btn-success', type: 'button', href: 'javascript:void(0)'}).text('Calculate');
			var resetBtn = $('<button>', {class: 'btn btn-danger', type: 'button', href: 'javascript:void(0)'}).text('Reset');

			modeCb = $('<input>', {'type': 'checkbox', 
				value: "", 
				   'data-toggle':'toggle',
				   'data-on':'terms',
				   'data-off':'error'});

			modeCb.prop('checked', true);
			
			resetBtn.click(onReset);
			calcBtn.click(onCalc);

			calcBtnDiv.append(calcBtn);
			resetBtnDiv.append(resetBtn);
			modeCbDiv.append(modeCb);

			div.append(calcBtnDiv);
			div.append(resetBtnDiv);
			div.append(modeCbDiv);

			return div;
		}

		responsiveCanvas.redraw = function(){
			var canvas = this.canvas;
			var context = this.context;

			canvas.height = 300;
			responsiveCanvas.updateWidth();
			var ch = canvas.height;
			var cw = canvas.width;

			context.clearRect(0, 0, ch, cw);

			CANVAS_DRAW.drawCenteredArray(context, cw, ch, funcArr);
		}
	}
	return interf;
})(CURVE_FITTER || {});
