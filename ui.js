var UI = (function(){
	var interf = {};

	interf.getContentDiv = function(){
		return $("#main-content");
	}

	interf.createPanel = function(insideEl){

		var outerDiv = $("<div>", {"class":"panel panel-default"}); 
		var innerDiv = $("<div>", {"class":"panel-body"}); 
		innerDiv.append(insideEl);
		outerDiv.append(innerDiv);
		return outerDiv;
	}

	return interf;
})();
