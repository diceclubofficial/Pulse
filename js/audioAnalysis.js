// Pre-generate audio
let audioContext = new AudioContext();
let bufferLoader = new BufferLoader(audioContext,
[
"/music/simpledrums.mp3",
"/music/billvortexmizar.mp3",
"/music/billvortexincendie.mp3",
"/music/billvortextruffes.mp3",
],
loadAudio);
bufferLoader.load();
let buffer;
let bufferSource;
let loadingTasksMax = 2;
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
  buffer = bufferList[1];

  // send track through lowpass filter to get bassPeakTimes
  getFilteredBuffer(buffer, "lowpass", 440).then(
    function(result) {
      console.log("Lowpass filter processing completed.");
      let filteredBuffer = result;
      // find significant peaks in the track
      bassPeakTimes = getPeaksAtThreshold(filteredBuffer.getChannelData(0), filteredBuffer.sampleRate, 0.6);
      console.log("Bass Peaks: ", bassPeakTimes);
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
      console.log("Treble Peaks: ", treblePeakTimes);
      completeLoadingTask();
    }
  );
}
function completeLoadingTask() {
  loadingTasksCompleted++;
  if(loadingTasksCompleted == loadingTasksMax) {
    finishedLoadingAudio = true;
    console.log("FINISHED LOADING AUDIO.");
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
