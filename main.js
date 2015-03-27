var real = [1, 2, 3, 4, 5, 6, 7, 8];
var imag = Array.apply(null, new Array(8)).map(Number.prototype.valueOf,0);

transform(real, imag);

real.forEach(function(val){
	console.log(val);
});

inverseTransform(real, imag);

real.forEach(function(val){
	console.log(val/8);
});

NAVIGATION.setup();
