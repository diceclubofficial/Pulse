// Pre-generate audio
let audioContext = new AudioContext();
let bufferPaths = [
  "/music/simpledrums.mp3", //0
  "/music/billvortexmizar.mp3",
  "/music/billvortexincendie.mp3",
  "/music/billvortextruffes.mp3", //3
  // "/music/wetandwild.mp3",
  // "/music/spacecop.mp3",
  // "/music/spacerhythm1.mp3", //6
  // "/music/starscreamspace.mp3",
  // "/music/sultryspaceshowers.mp3",
]
let bufferLoader = new BufferLoader(audioContext, bufferPaths, loadAudio);
bufferLoader.load();
let buffer;
let bufferPos = 3;
let bufferSource;
let loadingTasksMax = 3;
let loadingTasksCompleted = 0;
let finishedLoadingAudio = false;

let lastTime;
let secondsElapsed;

let bassPeakTimes;
let treblePeakTimes;
let bassPeaksElapsed;
let treblePeaksElapsed;

function loadAudio(bufferList) {
  console.log("Finished loading " + bufferList.length + " buffers.");
  buffer = bufferList[bufferPos];
  console.log("Current buffer located at " + bufferPaths[bufferPos]);

  // get average frequency data to determine where to put filters
  getAverageFrequencyData(buffer).then(
    function(result) {
      console.log("Frequency data processing completed.");

      impactfulFrequencies = getImpactfulFrequencies(result);
      console.log("Impactful Frequencies:", impactfulFrequencies);

      completeLoadingTask();
    }
  );
  // send track through lowpass filter to get bassPeakTimes
  getFilteredBuffer(buffer, "lowpass", 440).then(
    function(result) {
      console.log("Lowpass filter processing completed.");
      let filteredBuffer = result;
      // find significant peaks in the track
      bassPeakTimes = getPeaksAtThreshold(filteredBuffer.getChannelData(0), filteredBuffer.sampleRate, 0.6);
      console.log("Bass Peaks: ", bassPeakTimes.slice(0, 10));
      completeLoadingTask();
    }
  );
  // send track through highpass filter to get treblePeakTimes
  getFilteredBuffer(buffer, "highpass", 440).then(
    function(result) {
      console.log("Highpass filter processing completed.");
      let filteredBuffer = result;
      // find significant peaks in the track
      treblePeakTimes = getPeaksAtThreshold(filteredBuffer.getChannelData(0), filteredBuffer.sampleRate, 0.5);
      console.log("Treble Peaks: ", treblePeakTimes.slice(0, 10));
      completeLoadingTask();
    }
  );
}
function completeLoadingTask() {
  loadingTasksCompleted++;
  if(loadingTasksCompleted == loadingTasksMax) {
    finishedLoadingAudio = true;
    console.log("FINISHED PROCESSING AUDIO.");
  }
}

function startAudio() {
  bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(audioContext.destination);
  bufferSource.start(0);

  secondsElapsed = 0;
  bassPeaksElapsed = 0;
  treblePeaksElapsed = 0;

  lastTime = Date.now();
}

function analyseAudio() {
  secondsElapsed += (Date.now() - lastTime) / 1000;
  lastTime = Date.now();
  let samplesElapsed = secondsElapsed * buffer.sampleRate;

  if(samplesElapsed > bassPeakTimes[bassPeaksElapsed]) {
    console.log("BASS PEAK", bassPeaksElapsed);
    bassPeaksElapsed++;
    spawnBassWave();
  }
  if(samplesElapsed > treblePeakTimes[treblePeaksElapsed]) {
    console.log("TREBLE PEAK", treblePeaksElapsed);
    treblePeaksElapsed++;
    spawnTrebleWave();
  }
}

function getImpactfulFrequencies(data) {
  let frequencyData = [];
  for(let i in data) {
    frequencyData[i] = {
      frequency: i,
      volume: data[i],
    };
  }
  frequencyData.sort(function(a, b) {
    return b.volume - a.volume; // sort frequency data by volume but preserve the frequency
  });

  // let impactfulFrequencies = frequencyData.slice(0, 100); // to save time?
  let impactfulFrequencies = frequencyData.slice();
  for(let currEntry of impactfulFrequencies) {
    currEntry.impact = 0;
    innerLoop: for(let otherEntry of impactfulFrequencies) {
      if(otherEntry == currEntry) continue innerLoop;
      let frequencyDiff = Math.abs(parseInt(otherEntry.frequency) - parseInt(currEntry.frequency));
      if(frequencyDiff == 0) continue innerLoop;
      currEntry.impact += otherEntry.volume/(frequencyDiff**3);
    }
  }
  impactfulFrequencies.sort(function(a, b) {
    return b.impact - a.impact; // sort frequency data by volume but preserve the frequency
  });
  return impactfulFrequencies.slice(0, 10);
}
function getAverageFrequencyData(buffer) {
  return new Promise(function(resolve, reject) {
    // create offline context
    let offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

    let bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = buffer;

    let analyser = offlineContext.createAnalyser();
    let fftSize = 2048;
    analyser.fftSize = fftSize;

    let processor = offlineContext.createScriptProcessor(fftSize, 1, 1);

    bufferSource.connect(analyser);
    processor.connect(offlineContext.destination);

    let frequencyData = new Uint8Array(analyser.frequencyBinCount);
    let frequencySumData = new Uint8Array(analyser.frequencyBinCount);
    bufferSource.start(0);
    offlineContext.startRendering();

    processor.onaudioprocess = function(e) {
      analyser.getByteFrequencyData(frequencyData);
      for(let i in frequencyData) {
        let f = frequencyData[i];
        frequencySumData[i] += f;
      }
    }
    offlineContext.oncomplete = function() {
      let averageFrequencyData = [];
      for(let i in frequencySumData) {
        averageFrequencyData[i] = frequencySumData[i] / frequencySumData.length;
      }
      resolve(averageFrequencyData);
    }
  });
}
function getFilteredBuffer(buffer, filterType, frequency) {
  return new Promise(function(resolve, reject) {
    // create offline context
    let offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    // source
    let source = offlineContext.createBufferSource();
    source.buffer = buffer;
    // filter
    let filter = offlineContext.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;

    // connect nodes
    // Pipe the song into the filter, and the filter into the offline context
    source
    .connect(filter)
    .connect(offlineContext.destination);

    // Schedule the song to start playing at time:0 and render it
    source.start(0);
    offlineContext.startRendering();
    offlineContext.oncomplete = function(e) {
      // Filtered buffer!
      let filteredBuffer = e.renderedBuffer;
      resolve(filteredBuffer);
    };
  });
}

// from http://joesul.li/van/beat-detection-using-web-audio/
// returns an array of peak timestamps in sample index
function getPeaksAtThreshold(data, sampleRate, threshold) {
  let peaksArray = [];
  let length = data.length;
  for(let i = 0; i < length;) {
    if(data[i] > threshold && data[i + 1] < threshold && data[i + 2] < threshold) {
      peaksArray.push(i);
      // Skip forward ~ 1/4s to get past this peak.
      i += 0.25 * sampleRate;
    }
    i++;
  }
  return peaksArray;
}

function playSound(buffer, time = 0) {
  let bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(audioContext.destination);
  bufferSource.start(time);
}
