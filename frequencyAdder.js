var FREQUENCY_ADDER = (function(interf){
	var sineControllers;
	var sumController; 
	var $insPoint;

	interf.loadInto = function(jqPageEl){
		$insPoint = jqPageEl;
		var sc;
		sumController = createSumController();
		sineControllers =  createSineControllers();

		sineControllers.forEach(function(sc) {
			$insPoint.append(sc.getJQEl()).append('<hr>');
			sc.addedToDOM();
		});

		var sineView = new interf.SineSumView();
		$insPoint.append(createAddNewSCDiv());
		$insPoint.append('<hr>');
		// $insPoint.append($('<h2>').text("Sum:")); 
		$insPoint.append(sineView.get$());
// .css({'padding-top': '1cm'})
		sineView.addedToDOM();
	}
	
	interf.getSineWaves = function(){
		
		sineWaves = [];

		sineControllers.forEach(function(sc) {
			sineWaves.push(sc.getSineWave());
		});

		return sineWaves;
	}

	function createAddNewSCDiv(){
		var $div = $('<div>', {class: 'row'});

		var $innerDiv = $('<div>', {class: 'col-xs-12'});
		var $btn = $('<button>', {class: 'btn btn-success', type: 'button', href: 'javascript:void(0)'});
		$btn.append($('<span>', {class: "glyphicon glyphicon-plus"})).append(" Add new sine wave");

		$btn.on('click',addNewSC); 
		
		$innerDiv.append($btn);

		$div.append($innerDiv);

		return $div;
	}

	function createSumController(){
		return 1;
	}

	function createSineControllers(){
		var scArr = [];
		scArr.push(createNewSineController());
		return scArr;	
	}

	function addSCToDom(sc){
		var lastSC = sineControllers[sineControllers.length-1];

		sineControllers.push(sc);

		$sc = sc.getJQEl();

		if(!lastSC)
			$insPoint.prepend($sc);				
		else 
			$sc.insertAfter(lastSC.getJQEl().next()); //next() is the <hr>

		$('<hr>').insertAfter( $sc );
		sc.addedToDOM();
	}

	function addNewSC(){
		addSCToDom(createNewSineController());
	}
	function createNewSineController(){
		return new interf.SineController(scChange);
	}
	//elem is only sent when the element is remove
	function scChange(elemToBeDeleted){
		if(elemToBeDeleted){
			var index = sineControllers.indexOf(elemToBeDeleted);
			//erases the <hr>
			elemToBeDeleted.getJQEl().next().remove();
			elemToBeDeleted.getJQEl().remove();
			sineControllers.remove(index);
		}

	}

	return interf;

})(FREQUENCY_ADDER || {});
