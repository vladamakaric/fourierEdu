importScripts('../fft/fft.js');

self.onmessage = function(objEvent)
{
    var real = objEvent.data.real;
    var imag = objEvent.data.imag;

	transform(real, imag);

	// inverseTransform(real, imag);

	// for(var i=0; i<real.length; i++){
	// 	console.log(real[i]/real.length);
	// }

	self.postMessage({real: real, imag:imag}, [real.buffer, imag.buffer]);
}
