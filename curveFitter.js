var CURVE_FITTER = (function(interf){

	interf.loadInto = function($insPoint){
		var cf = new CurveFitter();
		$insPoint.append(cf.get$());
		cf.addedToDOM();
	}

	function CurveFitter(){
		var state = {calculated: false, termNumInput:true};
		var sqErrorMax = 1000;
		var mousePressed = false;
		var fftCoefs = {};
		var displayFuncArr;
		var funcLen = 128;

		var termNum = 1;
		var funcArr = new Float64Array(new ArrayBuffer(funcLen*8));
		var prevMousePos = {x:-1, y:-1};

		var div$ = $('<div>', {class: 'row'});
		var $inputForm;
		var $calcInputDiv; 
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
				}
				else{

					var k = (rightP.y - leftP.y)/dx;
					var pointNum = Math.floor(dx/step)+1;

					for(var i=0; i<pointNum; i++){
						funcArr[leftIndx + i] = leftP.y + k*i*step;
					}
				}

				onChangeFuncData();
			}
		}

		this.get$ = function(){return div$;}


		function onChangeFuncData(){
			if(state.calculated)
				$calcInputDiv.remove();

			state.calculated = false;
			modeCb.bootstrapToggle('disable');
			responsiveCanvas.redraw();
		}


		function calcFFT(){
			fftCoefs.real =new Float64Array(funcArr);
			fftCoefs.imag =new Float64Array(new ArrayBuffer(funcLen*8));
			transform(fftCoefs.real, fftCoefs.imag);
		}

		function calcIFFTByMaxSqError(){

			$inputForm.hide();
			$controlsDiv.append($loadingDiv);
			var fftWorker = new Worker("webWorkers/sqErrIFFT.js");
		
			var sqIFFTObj = {
				funcArr: funcArr,
				fftCoefs: fftCoefs,
				sqErrorMax: sqErrorMax	
			};


			fftWorker.postMessage(sqIFFTObj); 


			fftWorker.onmessage = function(e){
				displayFuncArr = e.data.displayFuncArr;


				responsiveCanvas.redraw();
				$loadingDiv.remove();
				$inputForm.show();
				// termNumChange();
			}
		}

		function onResetBtnClick(){
			initFuncArr();
			onChangeFuncData();
		}

		function onCalcBtnClick(){
			calcFFT();

			if(!state.calculated){
				loadChosenCalcInputDiv();
			}

			state.calculated = true;
			modeCb.bootstrapToggle('enable');
			termNumChange();
		}

		function onChangeCalcModeClick(){
		
			state.termNumInput = $(this).prop('checked');

			$calcInputDiv.remove();
			loadChosenCalcInputDiv();


			if(state.termNumInput){
				termNumChange();
			}
			else calcIFFTByMaxSqError();
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
		
		function initFuncArr(){ 
			for(var i=0; i<funcLen; i++){
				funcArr[i] = 0;
			}
		}

		function loadChosenCalcInputDiv(){
			if(state.termNumInput){
				$calcInputDiv = createTermNumInputDiv();	
			}else
				$calcInputDiv = createSqErrorInputFieldAndTermOutputField();

			$inputForm.append($calcInputDiv);
		}

		function createTermNumInputDiv(){
			return createSliderInputDiv('Term number', termNumChange, termNum);
		}

		function createControlsDiv(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			$inputForm = $('<form>',{class:'form', role: 'form'});

			$inputForm.append(createOptionsDiv());
			div.append($inputForm);
			return div;
		}



		//slider change
		function termNumChange(val){
			var newFFTCoefs = FFTUtils.getFFTCoefsCopy(fftCoefs);
			if(val !== undefined) termNum = val;
		
			//realne fje imaju simetricne koeficijente X(k) = X*(n-k)
			if(termNum!==funcLen/2)
				FFTUtils.lowPassFreqFilter(newFFTCoefs, termNum);
			
				
			FFTUtils.IFFT(newFFTCoefs);
			displayFuncArr = newFFTCoefs.real;
			responsiveCanvas.redraw();
		}


		function createSqErrorInputFieldAndTermOutputField(){
			var div = $("<div>",{class:'row'}  ); 
			div.css({'margin-top': '20px'});

			var inputDiv = $('<div>', {class: 'form-group col-xs-6'});
			inputDiv.append($('<label>').text('Maximum square error:'));

			var input = $('<input>', {type: "text", class: 'form-control'});
			inputDiv.append(input);

			input.val(sqErrorMax.toFixed(2));

			input.attr('min', 0);
			input.on('change', function(){
				var flval = parseFloat(input.val());
				if(flval<0){
					input.val(0);
					flval = 0;
				}

				sqErrorMax = flval;
				calcIFFTByMaxSqError();
			});

			var textDiv = $('<div>', {class: 'form-group col-xs-6'});

			// var sqErrLabel = $('<label>').text('Number of terms: 45');
			// textDiv.append(sqErrLabel);

			div.append(inputDiv);
			// div.append(sqErrLabel);

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

			DATA_BINDING.sliderInput(input,slider,1,funcLen/2,initVal,valueChangeCallback,undefined,undefined,0,true);

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
				   'data-onstyle':'default',
				   'data-offstyle':'default',
				   'data-toggle':'toggle',
				   'data-on':'terms',
				   'data-off':'error'});

			modeCb.prop('checked', true);
			
			modeCb.change(onChangeCalcModeClick);
			
			resetBtn.click(onResetBtnClick);
			calcBtn.click(onCalcBtnClick);

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
