// basics
let audioContext = new AudioContext();
audioContext.suspend();
let trackID = 'drums';
let audioElement = document.getElementById(trackID);
let source = audioContext.createMediaElementSource(audioElement);

// filter
let filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 140;

// analyser
let analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.75;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
let historicalMaxAverage = 0;
let lastAverage = 0;

// Connect proper nodes
source
.connect(filter)
.connect(analyser)
.connect(audioContext.destination);

// Real-time audio analysis
function audioAnalysis() {
  analyser.getByteFrequencyData(dataArray);

  // calculate average
  let average = 0;
  for(let i = 0; i < bufferLength; i++) {
    average += dataArray[i] / bufferLength;
  }
  average /= bufferLength;

  if(average > historicalMaxAverage) historicalMaxAverage = average;
  let beatThreshold = 0.84 * historicalMaxAverage;
  if(average >= beatThreshold && lastAverage < beatThreshold) {
    console.log("BEAT!");
    spawnBassWave();
  }

  lastAverage = average;
}
