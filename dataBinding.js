var DATA_BINDING = (function(){

	var interf = {};

	//input and slider are jq DOM objs.
	interf.sliderInput = function(input, slider, min, max, initial,  changeCallback, f, finv, decimalPoints, enforceMax){

		decimalPoints = decimalPoints || 0;
		function identity(x) {return x;}

		function formatFloat(x) { return parseFloat(x).toFixed(decimalPoints);}

		f = f || identity;
		finv = finv || identity;	
		input.attr('min', f(min));
		input.attr('max', f(max));

		input.val(formatFloat(initial));
		slider.attr('min', min);
		slider.attr('max', max);
		slider.val(finv(initial));

		slider.on('input', function(){
			
			
			console.log('slval: '+slider.val());
			var flval = f(parseFloat(slider.val())); 
    		input.val(formatFloat(flval ));
			changeCallback(flval);
		});

		input.on('change', function(){
			var flval = parseFloat(input.val());
			slider.val(finv(flval));

			if(enforceMax){
				if(flval>f(max)){
					input.val((f(max)).toFixed(decimalPoints));
				}
			}
			changeCallback(flval);
		});
	}
	return interf;
})();
