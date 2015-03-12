$("#main-content").load("home.html");


$("#home").click(function(){
	 $("#main-content").load("home.html");
});

$("#theory1").click(function(){
	 $("#main-content").load("theory1.html");
});

$("#theory2").click(function(){
	 $("#main-content").load("theory2.html");
});

$("#theory3").click(function(){
	 $("#main-content").load("theory3.html", function() {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	 });
});
