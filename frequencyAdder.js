var FREQUENCY_ADDER = (function(interf){
	var sineControllers;
	var sumController; 
	var $insPoint;
	var sineSumView;

	interf.loadInto = function(jqPageEl){
		$insPoint = jqPageEl;
		var sc;
		sumController = createSumController();
		sineControllers =  createSineControllers();

		sineSumView = new interf.SineSumView();
		$insPoint.append(sineSumView.get$());
		sineSumView.refreshSineWaves(getSineWaves());

		$insPoint.append(createAddNewSCDiv());
		sineControllers.forEach(function(sc, i) {
			$insPoint.append(sc.getJQEl());
			if(i!=sineControllers.length-1)
				$insPoint.append('<hr>');

			
			sc.addedToDOM();
		});
		// $insPoint.append('<hr>');
		sineSumView.addedToDOM();
	}
	
	function getSineWaves(){

		sineWaves = [];

		sineControllers.forEach(function(sc) {
			if(sc.isEnabled())
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

		$btn.css({'margin-bottom': '20px'});
		
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
		var lastSC = sineControllers[0];

		sineControllers.push(sc);

		$sc = sc.getJQEl();


		$sc.insertAfter(sineSumView.get$().next());

		$('<hr>').insertAfter($sc);
		sc.addedToDOM();
	}

	function addNewSC(){
		addSCToDom(createNewSineController());
		sineSumView.refreshSineWaves(getSineWaves());
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

		sineSumView.refreshSineWaves(getSineWaves());
	}

	return interf;

})(FREQUENCY_ADDER || {});
