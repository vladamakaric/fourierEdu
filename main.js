$("#main-content").load("home.html");

$("#home").click(function(){
	activateSideBtn("home");
	$("#main-content").load("home.html");
});

var list = $("#theoryToggle li");
var listCount = list.length;
var theoryPageCallbacks = [];
var contentBtnList = $(".contentBtn");

function activateSideBtn(btnID){
	contentBtnList.removeClass('active');	
	contentBtnList.filter('#' + btnID).addClass('active');
}

activateSideBtn("home");

$.each(list, function (index, data) {

	var liid = $(this).attr("id");

	theoryPageCallbacks[index] = function(){

		activateSideBtn(liid);

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

    $(this).click( function() {
		theoryPageCallbacks[index]();
	});
});
