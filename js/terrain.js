class Terrain {
  constructor() {
    // Fill a raw elevation map with noise for each pixel in width
    // Sample the height every x pixels to form a new Array
    this.noise = new Perlin();
    this.seaLevel = 650;

    this.segmentLength = 20;
    this.noiseStep = 0.005;
    this.seed = Math.random()*256;

    this.rawElevationMap = [];
    this.elevationMap = [];

    for (var i = 0; i < canvasGA.width + this.segmentLength; i++) {
      this.rawElevationMap[i] = this.noise.getValue(this.seed + (i*this.noiseStep))*100;
      if (i%this.segmentLength == 0) {
        this.elevationMap[i/this.segmentLength] = (Math.trunc(this.seaLevel + this.rawElevationMap[i]));
      }
    }

    console.log(this.elevationMap);
  }

  show() {
    let previousStrokeStyle = contextGA.strokeStyle;
    contextGA.strokeStyle = 'rgb(255, 255, 255)';

    contextGA.moveTo(0, this.elevationMap[0]);
    for (var i = 0; i < this.elevationMap.length; i++) {
      contextGA.lineTo(i*this.segmentLength, this.elevationMap[i]);
    }
    contextGA.stroke();


    contextGA.strokeStyle = previousStrokeStyle;
  }

  getSlopeAt(x) {
    let index = Math.floor(x/this.segmentLength);
    let slope = (this.elevationMap[index+1]-this.elevationMap[index])/this.segmentLength;
    return slope;
  }


  isPointBelowSurface(x, y) {
    let slope = this.getSlopeAt(x);
    let surfaceY = this.elevationMap[Math.floor(x/this.segmentLength)] + (slope * (x % this.segmentLength));

    if (y > surfaceY) {
      return true;
    } else {
      return false;
    }
  }



  regenerate() {
    // New seed
    this.seed = Math.random()*256;
    // Clear arrays
    this.rawElevationMap.length = 0;
    this.elevationMap.length = 0;

    for (var i = 0; i < canvasGA.width + this.segmentLength; i++) {
      this.rawElevationMap[i] = this.noise.getValue(this.seed+ (i*this.noiseStep))*100;
      if (i%this.segmentLength == 0) {
        this.elevationMap[i/this.segmentLength] = (Math.trunc(this.seaLevel + this.rawElevationMap[i]));
      }
    }
  }



}
