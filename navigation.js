var NAVIGATION = (function(){
	var interf = {};

	var contentBtnList = $(".contentBtn");

	interf.setup = function(){
		// setHomePage();


		// function icall(value){
		// }
        //
		// function f(x) {
		// 	return Math.exp(5*x/100);
		// }
        //
		// function finv(x){
		// 	return 100*(Math.log(x)/5);
		// }
        //
		// DATA_BINDING.sliderInput($("#ebox"),$("#slajd"),1,100,30,icall,f,finv);
		var sc =new SINE_CONTROLLER.SineController();	

		var rowDiv = $('<div>', {class: 'row'});
		rowDiv.append(sc.createCanvasDiv());
		rowDiv.append(sc.createControlsDiv());
		UI.getContentDiv().append(rowDiv);
		addEventHandlers();
		setTheoryNavigation();
	}

	
	function setTheoryNavigation(){

		var list = $("#theoryToggle li");
		var listCount = list.length;
		var theoryPageCallbacks = [];

		function addNextPrevToTheoryPage(index, page){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

			//$(this) is the mainContent div, where the current page
			//content is
			$(page).append("<hr>");

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

			$(page).append(pager);
		}

		function setUpTheoryPageLinks(index){

			var liid = $(this).attr("id");

			theoryPageCallbacks[index] = function(){

				activateSideBtn(liid);
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
		UI.getContentDiv().load("home.html");
	}

	function addEventHandlers(){
		$("#home").click(setHomePage);

		$("#freqAdd").click(function(){
			activateSideBtn("freqAdd");
			FREQUENCY_ADDER.loadInto(UI.getContentDiv());
		});

		$("#curveFitt").click(function(){
			activateSideBtn("curveFitt");
			$("#main-content").html("CurveFitt");
		});
	}

	return interf;
})();

