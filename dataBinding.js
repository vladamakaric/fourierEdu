var DATA_BINDING = (function(){

	var interf = {};

	//input and slider are jq DOM objs.
	interf.sliderInput = function(input, slider, min, max, initial,  changeCallback, f, finv){

		function identity(x) {return x;}

		function formatFloat(x) { return parseFloat(x).toFixed(2);}

		f = f || identity;
		finv = finv || identity;	
		changeCallback(f(initial));
		input.attr('min', f(min));
		input.attr('max', f(max));

		input.val(formatFloat(f(initial)));
		slider.attr('min', min);
		slider.attr('max', max);
		slider.val(initial);

		slider.on('input', function(){
    		input.val(formatFloat( f(slider.val()) ));
			changeCallback(f(slider.val()));
		});

		input.on('change', function(){
			slider.val(finv(input.val()));
			changeCallback(input.val());
		});
	}


	return interf;
})();
