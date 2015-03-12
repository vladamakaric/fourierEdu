$("#main-content").load("home.html");

var list = $("#theoryToggle li");
var listCount = list.length;
var theoryPageCallbacks = [];

$.each(list, function (index, data) {

	theoryPageCallbacks[index] = function(){

		var liid = $(list[index]).attr("id");

		 $("#main-content").load(liid + ".html", function() {
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

			$(this).append("<hr>");

			var pager = $("<ul></ul>"); 
			pager.attr("class","pager");

		
			if(index!=listCount-1){
				var btn = $('<li>', {class: 'next'});
				btn.click(theoryPageCallbacks[index+1]);
				btn.append($('<a>', {href: '#', text: 'Next'}));
				pager.append(btn);

			}

			if(index>0){
				var btn = $('<li>', {class: 'previous'});
				btn.click(theoryPageCallbacks[index-1]);
				btn.append($('<a>', {href: '#', text: 'Previous'}));
				pager.append(btn);
			}

			$(this).append(pager);

		 });
	}

    $(this).click(theoryPageCallbacks[index]);
});
