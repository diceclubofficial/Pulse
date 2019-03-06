// Pre-generate audio
let audioContext = new AudioContext();
let bufferPaths = [
  "/music/billvortexmizar.mp3",
  // "/music/billvortextruffes.mp3", //3
  // "/music/wetandwild.mp3", // great but difficult
  // "/music/spacecop.mp3", // great
  // "/music/spacerhythm1.mp3", //6 // fast
  // "/music/starscreamspace.mp3", // love this song but volume is inconsistent
  // "/music/sultryspaceshowers.mp3", // very difficult
];
let bufferLoader = new BufferLoader(audioContext, bufferPaths, loadAudio);
bufferLoader.load();
let buffer;
let bufferPos = 0;
let bufferSource;
let loadingTasksMax = 3;
let loadingTasksCompleted = 0;
let finishedLoadingAudio = false;

let lastTime;
let secondsElapsed;

let filterQ = 20;
let filterGain = -100;

let bassFrequency;
let bassBuffer;
let bassPeakTimes;
let bassPeaksElapsed;

let trebleFrequency;
let trebleBuffer;
let treblePeakTimes;
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
      console.log("Impactful Frequencies:", impactfulFrequencies.slice(0, 10));

      // determine which frequencies to use as bass and treble
      trebleFrequency = impactfulFrequencies[0].frequency;
      bassFrequency = impactfulFrequencies[0].frequency;
      let maxFrequencyDiff = 350;
      for(let f of impactfulFrequencies) {
        let currFrequency = f.frequency;
        if(currFrequency > trebleFrequency) trebleFrequency = currFrequency;
        if(currFrequency < bassFrequency) bassFrequency = currFrequency;
        let freqDiff = Math.abs(trebleFrequency - bassFrequency);
        if(freqDiff > maxFrequencyDiff) break;
      }
      console.log("Bass:", bassFrequency);
      console.log("Treble:", trebleFrequency);
      completeLoadingTask();

      // send track through bandpass filter to get bassPeakTimes
      getFilteredBuffer(buffer, "peaking", trebleFrequency, filterQ, filterGain).then(
        function(attenuatedBuffer) {
          getFilteredBuffer(attenuatedBuffer, "bandpass", bassFrequency, filterQ).then(
            function(filteredBuffer) {
              console.log("Bass filter processing completed.");
              bassBuffer = filteredBuffer;
              // find significant peaks in the track
              bassPeakTimes = getPeaksAtThreshold(filteredBuffer.getChannelData(0), filteredBuffer.sampleRate, 0.6);
              console.log("Bass Peaks: ", bassPeakTimes.slice());
              completeLoadingTask();
            }
          );
        }
      );

      // send track through bandpass filter to get treblePeakTimes
      getFilteredBuffer(buffer, "peaking", bassFrequency, filterQ, filterGain).then(
        function(attenuatedBuffer) {
          getFilteredBuffer(attenuatedBuffer, "bandpass", trebleFrequency, filterQ).then(
            function(filteredBuffer) {
              console.log("Treble filter processing completed.");
              trebleBuffer = filteredBuffer;
              // find significant peaks in the track
              treblePeakTimes = getPeaksAtThreshold(filteredBuffer.getChannelData(0), filteredBuffer.sampleRate, 0.6);
              console.log("Treble Peaks: ", treblePeakTimes.slice());
              completeLoadingTask();
            }
          );
        }
      );
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
    console.log("BASS ", bassPeaksElapsed);
    bassPeaksElapsed++;
    spawnBassWave();
  }
  if(samplesElapsed > treblePeakTimes[treblePeaksElapsed]) {
    console.log("TREBLE ", treblePeaksElapsed);
    treblePeaksElapsed++;
    spawnTrebleWave();
  }
}

function getImpactfulFrequencies(data) {
  let frequencyData = [];
  for(let i in data) {
    frequencyData[i] = {
      frequency: parseInt(i),
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
      let frequencyDiff = Math.abs(otherEntry.frequency - currEntry.frequency);
      if(frequencyDiff == 0) continue innerLoop;
      currEntry.impact += otherEntry.volume/(frequencyDiff**3);
    }
  }
  impactfulFrequencies.sort(function(a, b) {
    return b.impact - a.impact; // sort frequency data by volume but preserve the frequency
  });
  return impactfulFrequencies;
}
function getAverageFrequencyData(buffer) {
  return new Promise(function(resolve, reject) {
    // create offline context
    let offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

    let bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = buffer;

    let analyser = offlineContext.createAnalyser();
    let fftSize = 16384;
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
function getFilteredBuffer(buffer, filterType, frequency, q = 1, gain = 0) {
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
    filter.Q.value = q;
    filter.gain.value = gain;

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
function getPeaksAtThreshold(data, sampleRate, thresholdRatio) {
  let maxValue = 0;
  for(let f of data) {
    if(f > maxValue) maxValue = f;
  }
  let threshold = thresholdRatio*maxValue;
  let peaksArray = [];
  let length = data.length;
  for(let i = 0; i < length;) {
    if(data[i] > threshold) {
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
