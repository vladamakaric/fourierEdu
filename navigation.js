var NAVIGATION = (function(){

	var interf = {};
	var contentBtnList = $(".contentBtn");

	interf.setup = function(){
		setHomePage();
		addEventHandlers();
		setTheoryNavigation();
	}

	function setTheoryNavigation(){
		var list = $("#theoryToggle li");
		var listCount = list.length;
		var theoryPageCallbacks = [];

		function addNextPrevToTheoryPage(index, page){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

			$(page).append("<hr>");

			var pager = $("<ul></ul>"); 
			pager.attr("class","pager");

			if(index!=listCount-1){
				var btn = $('<li>', {class: 'next'});
				btn.click(theoryPageCallbacks[index+1]);
				btn.append($('<a>', {href: 'javascript:void(0)', text: 'Next'}));
				pager.append(btn);
			}

			if(index>0){
				var btn = $('<li>', {class: 'previous'});
				btn.click(theoryPageCallbacks[index-1]);
				btn.append($('<a>', {href: 'javascript:void(0)', text: 'Previous'}));
				pager.append(btn);
			}

			$(page).append(pager);
		}

		function setUpTheoryPageLinks(index){

			var liid = $(this).attr("id");

			theoryPageCallbacks[index] = function(){
				activateSideBtn(liid);
				UI.getContentDiv().empty();
				UI.getContentDiv().load(liid + ".html", 
				function() {addNextPrevToTheoryPage(index,this);});
			}

			$(this).click( function() {
				theoryPageCallbacks[index]();
			});
		}

		$.each(list, setUpTheoryPageLinks);
	}

	function activateSideBtn(btnID){
		contentBtnList.removeClass('active');	
		contentBtnList.filter('#' + btnID).addClass('active');
	}

	function setHomePage(){
		activateSideBtn("home");
		UI.getContentDiv().empty();
		UI.getContentDiv().load("home.html", function(){
			UI.appendFooter();
		});
	}

	function addEventHandlers(){
		$("#home").click(setHomePage);

		$("#freqAdd").click(function(){
			activateSideBtn("freqAdd");
			UI.getContentDiv().empty();
			FREQUENCY_ADDER.loadInto(UI.getContentDiv());
		});

		$("#curveFitt").click(function(){
			UI.getContentDiv().empty();
			activateSideBtn("curveFitt");
			UI.getContentDiv().load("curveFitting.html");
		});
	}

	return interf;
})();

