var DATA_BINDING = (function(){

	var interf = {};

	//input and slider are jq DOM objs.
	interf.sliderInput = function(input, slider, min, max, initial,  changeCallback, f, finv, decimalPoints){

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
    		input.val(formatFloat( f(slider.val()) ));
			changeCallback(f(slider.val()));
		});

		input.on('change', function(){
			var flval = parseFloat(input.val());
			slider.val(finv(flval));
			changeCallback(flval);
		});
	}
	return interf;
})();
