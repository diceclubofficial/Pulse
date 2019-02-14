"use strict"

class Terrain {

  constructor() {
    // Fill a raw elevation map with noise for each pixel in width
    // Sample the height every x pixels to form a new Array
    this.noise = new Perlin();
    this.startPoint = 0;
    this.endPoint = OFFSCREEN_WIDTH;
    this.seaLevel = bottomScreenY + 0.85 * HEIGHT; // 85% down on the last screen height
    this.maxElevationDiff = 100;
    this.highestGround = this.seaLevel - this.maxElevationDiff;

    this.segmentLength = 20;
    this.noiseStep = 0.005;
    this.seed = Math.random()*256;

    this.generate();

    console.log("Terrain Elevation Map: ", this.elevationMap);
  }

  showDeveloperStats(context) {
    context.save();
    // show highestGround
    context.strokeStyle = "rgb(139,69,19)";
    context.beginPath();
    context.moveTo(0, this.highestGround);
    context.lineTo(OFFSCREEN_WIDTH, this.highestGround);
    context.stroke();
    // show seaLevel
    context.strokeStyle = "rgb(0, 0, 255)";
    context.beginPath();
    context.moveTo(0, this.seaLevel);
    context.lineTo(OFFSCREEN_WIDTH, this.seaLevel);
    context.stroke();
    context.restore();
  }

  draw(context) {
    context.save();
    context.strokeStyle = 'rgb(255, 255, 255)';

    context.moveTo(this.startPoint, this.elevationMap[0]);
    for (let i = 0; i < this.elevationMap.length; i++) {
      context.lineTo(this.startPoint + i * this.segmentLength, this.elevationMap[i]);
    }
    context.stroke();

    context.restore();
  }

  collisionDetection() {
    // preliminary check
    if(probe.y + probe.height < this.highestGround) {
      return;
    }

    // check vertices of lander polygon
  	vertexLoop: for(let i = 0; i < probe.shape.vertices.length; i++) {
  		let vertex = probe.shape.vertices[i];
  		if(this.isPointBelowSurface(vertex.x, vertex.y)) {
  			probe.groundState = probe.TOUCHING_GROUND;
  			if(!probe.groundedVertexPositions.includes(i)) probe.groundedVertexPositions.push(i);
  			break vertexLoop;
  		}
  		else {
  			probe.groundState = probe.OFF_GROUND;
  		}
  	}
  }

  getSlopeAt(x) {
    let index = Math.floor(x/this.segmentLength);
    let slope = (this.elevationMap[index+1]-this.elevationMap[index])/this.segmentLength;
    return slope;
  }

  isPointBelowSurface(x, y) {
    let surfaceY = this.elevationMap[Math.floor((x - this.startPoint) / this.segmentLength)] + (this.getSlopeAt(x) * (x % this.segmentLength));

    return y > surfaceY;
  }

  generate(newSeed) {
    // New seed
    if(newSeed == undefined) newSeed = Math.random() * 256;
    this.seed = newSeed;

    // Clear arrays
    this.rawElevationMap = [];
    this.elevationMap = [];

    // Fill arrays with random data
    for(let i = 0; i < this.endPoint + this.segmentLength; i++) {
      this.rawElevationMap[i] = this.noise.getValue(this.seed+ (i*this.noiseStep))*this.maxElevationDiff;
      if (i%this.segmentLength == 0) {
        this.elevationMap[i/this.segmentLength] = (Math.trunc(this.seaLevel + this.rawElevationMap[i]));
      }
    }
  }

  translate(translationVector) {
    this.seaLevel += translationVector.y;
    this.startPoint += translationVector.x;
    this.generate(this.seed);
  }
}
