var CanvPtrEventMngr = function(canvas){

	var that = {};

	function getMousePos(e) {
		if (e.touches !== undefined && e.touches.length == 1) {
			return {x: e.touches[0].pageX, y: e.touches[0].pageY};
		}
		else {
			return {x: e.pageX, y: e.pageY};
		}
	}

	function findPos(obj) {
		var curleft = 0, curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return { x: curleft, y: curtop };
		}
		return undefined;
	}

	function getCanvRelMPos(event){
		var mpos = getMousePos(event);
		var canvPos = findPos(canvas);
		var x = mpos.x-canvPos.x;
		var y = mpos.y-canvPos.y;
		return {x:x, y:y};
	}

	that.ptrPressed = false;

	that.ptrMove = function(pos){}
	that.ptrDown = function(pos){}
	that.ptrUp = function(pos){}

	that.attachEvents = function(){

		function ptrMove(event){
			that.ptrMove(getCanvRelMPos(event));
		}

		function ptrUp(event){
			that.ptrPressed = false;
			that.ptrUp(getCanvRelMPos(event));
		}

		function ptrDown(event){
			that.ptrPressed = true;
			that.ptrDown(getCanvRelMPos(event));
		}

		function touchMove(event){ 
			event.defaultPrevented();
			ptrMove(event);
		}

		canvas.addEventListener("touchmove", touchMove, false);
		canvas.addEventListener("touchstart", ptrDown,false);
		canvas.addEventListener("touchend", ptrUp,false);
		canvas.addEventListener("click", ptrMove, false);
		canvas.addEventListener("mousemove", ptrMove , false);
		canvas.addEventListener("mousedown", ptrDown, false);
		canvas.addEventListener("mouseup", ptrUp, false);
		canvas.addEventListener("mouseout", ptrUp, false);
	}

	return that;
}
