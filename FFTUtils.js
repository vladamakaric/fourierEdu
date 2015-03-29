var FFTUtils = (function(){

	var interf={};

	interf.getFFTCoefsCopy = function(fftCoefs){
		var fftCoefsCpy = {};
		fftCoefsCpy.real = new Float64Array(fftCoefs.real.buffer.slice()); 
		fftCoefsCpy.imag = new Float64Array(fftCoefs.imag.buffer.slice()); 

		return fftCoefsCpy;
	}

	interf.lowPassFreqFilter = function(fftcoefs, freqNum){
		var	coefNum = fftcoefs.real.length;
		for(i=freqNum; i<coefNum-freqNum+1; i++)
			fftcoefs.real[i] = fftcoefs.imag[i] = 0;
	}

	interf.IFFT = function(fftcoefs){
		inverseTransform(fftcoefs.real, fftcoefs.imag);
		displayFuncArr = fftcoefs.real;

		var	coefNum = fftcoefs.real.length;
		for(i=0; i<coefNum; i++)
			displayFuncArr[i] /=coefNum;
	}

	return interf;
})();
