"use strict"

class TrebleWave {

  constructor(x, y, color, screenCoordinates, screenDimensions) {
    // type of wave (1-blue, 2-green, 3-red)
    this.type = 0;
    if(typeof color == "number") this.type = color;
    else if(color == "blue") this.type = 1;
    else if(color == "green") this.type = 2;
    else if(color == "red") this.type = 3;

    // type-specific data
    let minSpeed = 0.2; //0.65
    let maxSpeed = 0.5; //0.90
    let change = (maxSpeed - minSpeed)/2;
    let speed;
    if(this.type == 1) {
      speed = MS_PER_FRAME * randomValue(minSpeed, minSpeed + change);
    }
    else if(this.type == 2) {
      speed = MS_PER_FRAME * randomValue(minSpeed + change, minSpeed + 2*change);
    }
    else if(this.type == 3) {
      this.clockwise = randomInt(0, 2);
      speed = MS_PER_FRAME * randomValue(minSpeed + 2*change, maxSpeed);
    }

    // image data
    this.waveSheet = new Image();
    if(this.type == 1) this.waveSheet.src = "images/blueTrebleWaveSheet.png";
    else if(this.type == 2) this.waveSheet.src = "images/greenTrebleWaveSheet.png";
    else if(this.type == 3) this.waveSheet.src = "images/redTrebleWaveSheet.png";
    this.spriteWidth = 64, this.spriteHeight = 20;

    // vector quantities
    this.coordinates = new Vector(x, y);
    this.screenCoordinates = new Vector(screenCoordinates.x, screenCoordinates.y);
    this.screenDimensions = new Vector(screenDimensions.x, screenDimensions.y);
    this.centerOfScreen = new Vector(this.screenCoordinates.x + this.screenDimensions.x/2, this.screenCoordinates.y + this.screenDimensions.y/2);
		let direction = new Vector(this.centerOfScreen.x, this.centerOfScreen.y);
		direction.sub(this.coordinates);
		this.velocity = new Vector(direction.x, direction.y);
		this.velocity.magnitude = speed;
    // console.log("coordinates and dimensions", screenCoordinates.toString(), screenDimensions.toString());
    // console.log("center of screen", this.centerOfScreen.toString());

    // dimensions
    this.width = 120;
    this.height = this.width * (this.spriteHeight / this.spriteWidth); // calculate height based on width and sprite size to not distort the image
    let vertices = [
      new Vector(this.x, this.y),
      new Vector(this.x + this.width, this.y),
      new Vector(this.x + this.width, this.y + this.height),
      new Vector(this.x, this.y + this.height)
    ]; //rectangle
    this.shape = new Polygon(vertices);

    // calculate angle based on velocity vector and rotate shape
    this.angle = this.velocity.angle;
    this.shape.rotate(this.angle);

    this.fillStyle = 'white';

    // sprite animation
    this.numImages = 2, this.currImage = 0;
    this.framesPerAnimation = 165 / MS_PER_FRAME; // change this to change the animation speed
    this.animationTimer = 0;

    // for calculating when to start dying
    this.distanceFromCenter = distance(this.x, this.y, canvasGA.width/2, canvasGA.height/2);
    this.dying = false;
    this.dyingTimerMax = 660 / MS_PER_FRAME;
    this.dyingTimer = this.dyingTimerMax;
    this.alive = true;
  }

  update() {
    // Translational motion
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);

    this.animate();

    // If dying, count down until alive is false
    if(this.dying) {
      this.dyingTimer--;
      let g = 10*(this.dyingTimerMax - this.dyingTimer);
      this.fillStyle = "rgb(255, " + g + ", 0)";
      // console.log("Wave dying " + this.dyingTimer);
      if(this.dyingTimer <= 0) {
        this.alive = false;
        return;
      }
    }

    // If off-screen,
    if(this.x < this.screenCoordinates.x - this.width || this.x > this.screenCoordinates.x + this.screenDimensions.x || this.y < this.screenCoordinates.y - this.height || this.y > this.screenCoordinates.y + this.screenDimensions.y) {
      // Calculate distance from center
      let newDistanceFromCenter = distance(this.x, this.y, this.screenCoordinates.x + this.screenDimensions.x/2, this.screenCoordinates.y + this.screenDimensions.y/2);
      if(newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
        return;
      }
      else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    }
  }

  showDeveloperStats(context) {
    context.save();

    // show shape
    this.shape.draw(context, this.fillStyle);

    // show center
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText("Wave Center", this.centerOfScreen.x, this.centerOfScreen.y - 30);
    context.fillText(this.centerOfScreen.toString(), this.centerOfScreen.x, this.centerOfScreen.y);

    context.restore();
  }

  draw(context) {
    context.save();
    context.translate(this.coordinates.x + this.width/2, this.coordinates.y + this.height/2);
    context.rotate(this.angle);
    context.globalAlpha = (this.dyingTimer/this.dyingTimerMax); //to have the image fade out as it's dying
    context.drawImage(this.waveSheet, this.currImage*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.width/2, -this.height/2, this.width, this.height);
    context.restore();
  }

  collisionDetection() {
    // preliminary checks
    if(!this.alive) {
      return;
    }

    // prime is next frame rectangles
    let probeRectPrime = {
      x: probe.x + probe.velocity.x,
      y: probe.y + probe.velocity.y,
      width: probe.width,
      height: probe.height,
    }
    let thisRectPrime = {
      x: this.x + this.velocity.x,
      y: this.y + this.velocity.y,
      width: this.width,
      height: this.height,
    }
    // simple and fast big box collision detection
    if( !rectanglesCollide(probeRectPrime, thisRectPrime) ) {
      return;
    }

    // translate to next frame
    this.translate(this.velocity);
    probe.translate(probe.velocity);
    // do more complex and slower polygon collision detection
    if(!this.shape.overlapsPolygon(probe.shape)) {
      // undo translation to next frame
      this.translate(new Vector(-this.velocity.x, -this.velocity.y));
      probe.translate(new Vector(-probe.velocity.x, -probe.velocity.y));
      return;
    }
    this.translate(new Vector(-this.velocity.x, -this.velocity.y));
    probe.translate(new Vector(-probe.velocity.x, -probe.velocity.y));

    // collision occurs:
    // blue wave
    if(this.type == 1) {
      let force = new Vector(this.velocity.x, this.velocity.y);
      force.mult(0.0015 * MS_PER_FRAME);
      probe.applyForce(force);
      this.dying = true;
    }
    //green wave
    else if(this.type == 2) {
      let force = new Vector(this.velocity.x, this.velocity.y);
      force.mult(0.0015 * MS_PER_FRAME);
      probe.applyForce(force);
      this.dying = true;
    }
    //red wave
    else if(this.type == 3) {
      let force = new Vector(this.velocity.x, this.velocity.y);
      force.mult(0.0015 * MS_PER_FRAME);
      probe.applyForce(force);
      probe.applyTorque(this.clockwise);
      this.dying = true;
    }
  }

  animate() {
    // count down animation timer
    this.animationTimer--;
    if(this.animationTimer > 0) {
      return;
    }
    this.animationTimer = this.framesPerAnimation;

    // change sprite
    this.currImage += 1;
    if(this.currImage >= this.numImages) this.currImage = 0;
  }

  translate(translationVector) {
    this.coordinates.add(translationVector);
    this.shape.translate(translationVector);
  }

  get x() {
    return this.coordinates.x;
  }
  get y() {
    return this.coordinates.y;
  }

  toString() {
    return (`Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);
  }
}
