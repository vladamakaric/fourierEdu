var UI = (function(){
	var interf = {};

	interf.getContentDiv = function(){
		return $("#main-content");
	}

	interf.appendFooter = function(){
		var outerDiv = $("<div>", {"class":"footer"}); 
		var heading = $('<p>').append(
			$('<a>', {'href':"https://github.com/vladamakaric"})
			.text('Vladimir Makarić')
			);

		heading.append(', 2015');
		outerDiv.append(heading);
		interf.getContentDiv().append(outerDiv);
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
