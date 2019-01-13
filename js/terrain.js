"use strict"

class Terrain {

  constructor() {
    // Fill a raw elevation map with noise for each pixel in width
    // Sample the height every x pixels to form a new Array
    this.noise = new Perlin();
    this.seaLevel = 0.85*canvasGA.height;
    this.maxElevationDiff = 100;

    this.segmentLength = 20;
    this.noiseStep = 0.005;
    this.seed = Math.random()*256;

    this.rawElevationMap = [];
    this.elevationMap = [];

    for(let i = 0; i < canvasGA.width + this.segmentLength; i++) {
      this.rawElevationMap[i] = this.noise.getValue(this.seed + (i*this.noiseStep))*this.maxElevationDiff;
      if (i%this.segmentLength == 0) {
        this.elevationMap[i/this.segmentLength] = (Math.trunc(this.seaLevel + this.rawElevationMap[i]));
      }
    }

    console.log("Terrain Elevation Map: ", this.elevationMap);
  }

  showDev() {
    // show seaLevel
    contextGA.save();
    contextGA.strokeStyle = "brown";
    contextGA.beginPath();
    let y = this.seaLevel;
    contextGA.moveTo(0, y);
    contextGA.lineTo(canvasGA.width, y);
    contextGA.stroke();
    contextGA.restore();
  }

  draw() {
    let previousStrokeStyle = contextGA.strokeStyle;
    contextGA.strokeStyle = 'rgb(255, 255, 255)';

    contextGA.moveTo(0, this.elevationMap[0]);
    for (let i = 0; i < this.elevationMap.length; i++) {
      contextGA.lineTo(i*this.segmentLength, this.elevationMap[i]);
    }
    contextGA.stroke();

    contextGA.strokeStyle = previousStrokeStyle;
  }

  collisionDetection() {
    // Check vertices of lander polygon
  	vertexLoop: for(let i = 0; i < probe.shape.vertices.length; i++) {
  		let vertex = probe.shape.vertices[i];
  		if(this.isPointBelowSurface(vertex.x, vertex.y)) {
  			probe.touchingGround = true;
  			if(!probe.groundedVertexPositions.includes(i)) probe.groundedVertexPositions.push(i);
  			break vertexLoop;
  		}
  		else {
  			probe.touchingGround = false;
  		}
  	}
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

    for(let i = 0; i < canvasGA.width + this.segmentLength; i++) {
      this.rawElevationMap[i] = this.noise.getValue(this.seed+ (i*this.noiseStep))*this.maxElevationDiff;
      if (i%this.segmentLength == 0) {
        this.elevationMap[i/this.segmentLength] = (Math.trunc(this.seaLevel + this.rawElevationMap[i]));
      }
    }
  }
}
