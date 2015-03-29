importScripts('../fft/fft.js');

self.onmessage = function(objEvent)
{
    var real = objEvent.data.real;
    var imag = objEvent.data.imag;

	transform(real, imag);

	self.postMessage({real: real, imag:imag}, [real.buffer, imag.buffer]);
}
