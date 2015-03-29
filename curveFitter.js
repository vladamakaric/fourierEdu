var CURVE_FITTER = (function(interf){

	interf.loadInto = function($insPoint){
		var cf = new CurveFitter();
		$insPoint.append(cf.get$());
		cf.addedToDOM();
	}

	function CurveFitter(){
		//state
		var state = {calculated: false, sinNum:true};
		var sqErrorMax = 1000;
		var mousePressed = false;
		var fftCoefs = {};
		var displayFuncArr;
		var funcLen = 128;
		var termNum = 15;
		var funcArr = new Float64Array(new ArrayBuffer(funcLen*8));
		var prevMousePos = {x:-1, y:-1};

		var div$ = $('<div>', {class: 'row'});
		var $inputForm;
		var modeCb;

		/////////////////////////////////////////

		var $loadingDiv = $('<div>');
		loadLoadingAnimIntoNode($loadingDiv);
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

		function onCalc(){

			for(var i=0; i<funcLen; i++){
				console.log(funcArr[i]);
			}
			fftCoefs.real =new Float64Array(funcArr);
			fftCoefs.imag =new Float64Array(new ArrayBuffer(funcLen*8));

			$inputForm.hide();
			$controlsDiv.append($loadingDiv);

			var fftWorker = new Worker("webWorkers/realFuncFFT.js");
			fftWorker.postMessage(fftCoefs,
				[fftCoefs.real.buffer, fftCoefs.imag.buffer]);

			fftWorker.onmessage = function(e){
				var real = e.data.real;
				var imag = e.data.imag;

				fftCoefs = {};
				fftCoefs.real = real;
				fftCoefs.imag = imag;

				$loadingDiv.remove();
				$inputForm.show();

				state.calculated = true;
				termNumChange();
			}
		}


		function loadLoadingAnimIntoNode($node){

			$.get("spinLoader.svg", null,
				function(data) {
					var svgNode = $("svg", data);
					var docNode = document.adoptNode(svgNode[0]);

					$node.html(docNode);
					$node.prepend($('<p>').text('Loading').css(
							{'font-size': '200%',
							'text-align': 'center',
							'margin-top': '30px'}));
				},
				'xml');
		}

		function onReset(){
			initFuncArr();
			state.calculated = false;
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
			$inputForm.append(createSliderInputDiv('Term number', termNumChange, termNum));
			div.append($inputForm);
			// $inputForm.hide();
			return div;
		}

		function getFFTCoeffsCopy(){
			var fftCoefsCpy = {};
			fftCoefsCpy.real = new Float64Array(fftCoefs.real.buffer.slice()); 
			fftCoefsCpy.imag = new Float64Array(fftCoefs.imag.buffer.slice()); 

			return fftCoefsCpy;
		}

		function termNumChange(val){

			var fftcoefs = getFFTCoeffsCopy();

			console.log('copyed');

			for(var i=0; i<funcLen; i++){
				console.log(fftcoefs.real[i] + 'i: ' + fftcoefs.imag[i]);
			}
			
			console.log('smor: '+val);

			termNum =  val || termNum;

			if(val === 0)
				termNum=0;

			var coef = termNum;
			console.log('coef: ' + coef);
			
			if(termNum!==funcLen/2)
			for(i=termNum; i<funcLen-termNum+1; i++){
				fftcoefs.real[i] = fftcoefs.imag[i] = 0;
				console.log(fftcoefs.real[i] + 'i: ' + fftcoefs.imag[i]);
			}
				
			inverseTransform(fftcoefs.real, fftcoefs.imag);
			displayFuncArr = fftcoefs.real;
			
			for(i=0; i<funcLen; i++){
				displayFuncArr[i] /=funcLen;
			}

			responsiveCanvas.redraw();
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

			DATA_BINDING.sliderInput(input,slider,1,funcLen/2,initVal,valueChangeCallback);

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

			if(state.calculated){
				var linew = 3;
				context.lineWidth = linew;
				context.strokeStyle = '#5CB85C';
				CANVAS_DRAW.drawCenteredArray(context, cw, ch, displayFuncArr);
			}
		}
	}
	return interf;
})(CURVE_FITTER || {});
