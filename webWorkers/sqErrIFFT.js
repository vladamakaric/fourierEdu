importScripts('../fft/fft.js', '../FFTUtils.js');

self.onmessage = function(objEvent)
{
	var fftCoefs = objEvent.data.fftCoefs; 
	var funcArr = objEvent.data.funcArr;
	var sqErrorMax = objEvent.data.sqErrorMax;
	var coefNum = funcArr.length;
	
	console.log(sqErrorMax + 'RRRR');
	var fftCoefsCopy;
	var displayFuncArr;

	for(var freqNum = 1; freqNum < coefNum/2+1; freqNum++){
		fftCoefsCopy = FFTUtils.getFFTCoefsCopy(fftCoefs);	

		if(freqNum !== coefNum/2)
			FFTUtils.lowPassFreqFilter(fftCoefsCopy, freqNum);

		FFTUtils.IFFT(fftCoefsCopy);
		displayFuncArr = fftCoefsCopy.real;

		var sqe = getSqError(displayFuncArr,funcArr);

		if(sqe<sqErrorMax)
			break;
	}

	self.postMessage({displayFuncArr: displayFuncArr}, [displayFuncArr.buffer]);
	
	
	function getSqError(arr1, arr2){
		var sqerr = 0;
		var diff;

		for(var i=0; i< arr1.length; i++){
			diff = arr1[i]-arr2[i];
			sqerr+=diff*diff;
		}
		return sqerr;
	}
}
