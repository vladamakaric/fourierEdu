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
		var funcArr = [];
		var funcLen = 100;
		var prevMousePos = {x:-1,y:-1};

		var div$ = $('<div>', {class: 'row'});
		var modeCb;
		/////////////////////////////////////////

		initFuncArr();
		
		var responsiveCanvas = new ResponsiveCanvas("col-xs-12 col-lg-8");
		var canvas = responsiveCanvas.canvas;
		div$.append(responsiveCanvas.$);
		div$.append(createControlsDiv());

		

		var that = this;

		this.addedToDOM = function(){
			responsiveCanvas.addedToDOM();
			modeCb.bootstrapToggle();
			modeCb.bootstrapToggle('disable');

			function getMousePos(e) {
				if (e.touches !== undefined && e.touches.length == 1) {
					return {x: e.touches[0].pageX, y: e.touches[0].pageY};
				}
				else {
					return {x: e.pageX, y: e.pageY};
				}
			}

			function findPos(obj) {
				var curleft = 0, curtop = 0;
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
					} while (obj = obj.offsetParent);
					return { x: curleft, y: curtop };
				}
				return undefined;
			}

			function mouseMove(event){
				var mpos = getMousePos(event);
				var canvPos = findPos(responsiveCanvas.canvas);
				var x = mpos.x-canvPos.x;
				var y = mpos.y-canvPos.y;

				if(mousePressed){
					var hh = responsiveCanvas.canvas.height/2;

					if(prevMousePos.x === -1)
						addLineSegment({x:x,y:hh-y}, {x:x,y:hh-y});	
					else {
						addLineSegment({x:x,y:hh-y}, prevMousePos);	
					}

					prevMousePos = {x:x,y:hh-y};
					responsiveCanvas.redraw();
				}

			}

			function mouseDown(event){
				mousePressed = true;
				mouseMove(event);
			}

			function touchStart(event){
				mouseDown(event);
			}

			function mouseUp(event){
				prevMousePos = {x:-1,y:-1};
				mousePressed = false;
			}

			function mouseOut(event){
				prevMousePos = {x:-1,y:-1};
				mousePressed = false;
			}

			function mouseClickEH(event){
				mouseMove(event);
			}

			canvas.addEventListener("touchmove", function(event) { event.preventDefault(); mouseMove(event);},false);
			canvas.addEventListener("touchstart",touchStart,false);
			canvas.addEventListener("touchend",mouseUp,false);
			canvas.addEventListener("click", mouseClickEH, false);
			canvas.addEventListener("mousemove", mouseMove, false);
			canvas.addEventListener("mousedown", mouseDown, false);
			canvas.addEventListener("mouseup", mouseUp, false);
			canvas.addEventListener ("mouseout", mouseOut, false);

			
			function addLineSegment(a,b){
				var step =canvas.width/funcLen; 
				var leftP = a.x < b.x ? a : b;
				var rightP = a.x < b.x ? b : a;

				var dx = rightP.x - leftP.x;

				if(dx<step){
					addNewPoint(leftP.x, leftP.y);
					return;
				}

				var k = (rightP.y - leftP.y)/dx;

				var curdx = 0;

				while(dx>=curdx){
					addNewPoint(leftP.x + curdx, leftP.y + k*curdx); 
					curdx+=step;
				}
			}

			function addNewPoint(x,y){
				var step =canvas.width/funcLen; 
				arrLoc = Math.floor(x/step);
				funcArr[arrLoc] = y;
			}
		}

		this.get$ = function(){return div$;}


		function initFuncArr(){ 
			for(var i=0; i<funcLen; i++){
				funcArr[i] = 0;
			}
		}

		function createControlsDiv(){
			var div  = $("<div>",{class:'col-xs-12 col-lg-8 col-md-6 col-lg-4'}  ); 
			var form = $('<form>',{class:'form', role: 'form'});

			form.append(createOptionsDiv());
			div.append(form);
			return div;
		}

		function createSliderInputDiv(description, valueChangeCallback, min,initVal, f, finv ){
			var div = $("<div>",{class:'row'}  ); 

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


			// enableCb.change(function(){
			// 	changeCallback();
			// });

			calcBtnDiv.append(calcBtn);
			resetBtnDiv.append(resetBtn);
			modeCbDiv.append(modeCb);

			div.append(calcBtnDiv);
			div.append(resetBtnDiv);
			div.append(modeCbDiv);


			// enableCb.bootstrapToggle();
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
