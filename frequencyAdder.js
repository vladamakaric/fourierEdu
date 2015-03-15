var FREQUENCY_ADDER = (function(interf){
	var sineControllers;
	var sumController; 

	interf.loadInto = function(jqPageEl){
		var sc;
		sumController = createSumController();
		sineControllers =  createSineControllers();

		sineControllers.forEach(function(sc) {
			jqPageEl.append(sc.getJQEl()).append('<hr>');
			sc.addedToDOM();
		});
	}

	function createSumController(){
		return 1;
	}

	function createSineControllers(){
		var scArr = [];
		addSineController(scArr);
		return scArr;	
	}

	function addSineController(scArr){
		function onSCChange(){alert('scchange');}
		var sc = new SINE_CONTROLLER.SineController(1,onSCChange );
		scArr.push(sc);
	}

	return interf;

})(FREQUENCY_ADDER || {});
