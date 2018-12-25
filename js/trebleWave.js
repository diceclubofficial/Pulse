"use strict"

class TrebleWave {

  constructor(x, y, color){
    // type of wave (1-blue, 2-green, 3-red)
    this.type = 0;
    if(typeof color == "number") this.type = color;
    else if(color == "blue") this.type = 1;
    else if(color == "green") this.type = 2;
    else if(color == "red") this.type = 3;

    // type-specific data
    let speed;
    if(this.type == 1) {
      speed = randomInt(3, 5);
    }
    else if(this.type == 2) {
      speed = randomInt(5, 7);
    }
    else if(this.type == 3) {
      this.clockwise = randomInt(0, 2);
      speed = randomInt(7, 9);
    }

    // image data
    this.waveSheet = new Image();
    if(this.type == 1) this.waveSheet.src = "images/blueTrebleWaveSheet.png";
    else if(this.type == 2) this.waveSheet.src = "images/greenTrebleWaveSheet.png";
    else if(this.type == 3) this.waveSheet.src = "images/redTrebleWaveSheet.png";
    this.spriteWidth = 64, this.spriteHeight = 20;

    // vector quantities
    this.coordinates = new Vector(x, y);
    let centerOfScreen = new Vector(canvasGA.width/2, canvasGA.height/2);
		let direction = new Vector(centerOfScreen.x, centerOfScreen.y);
		direction.sub(this.coordinates);
		this.velocity = new Vector(direction.x, direction.y);
		this.velocity.magnitude = speed;

    // dimensions
    this.width = 120;
    this.height = this.width * (this.spriteHeight / this.spriteWidth); // calculate height based on width and sprite size to not distort the image
    let verticesRect = [
      new Vector(this.x, this.y),
      new Vector(this.x + this.width, this.y),
      new Vector(this.x + this.width, this.y + this.height),
      new Vector(this.x, this.y + this.height)
    ]; //rectangle
    this.shape = new Polygon(verticesRect);

    // calculate angle based on velocity vector and rotate shape
    this.angle = this.velocity.angle;
    this.shape.rotate(this.angle);

    this.fillStyle = 'white';

    // sprite animation
    this.numImages = 2, this.currImage = 0;
    this.framesPerAnimation = 5; // change this to change the animation speed
    this.animationTimer = 0;

    // for calculating when to start dying
    this.distanceFromCenter = distance(this.x, this.y, canvasGA.width/2, canvasGA.height/2);;
    this.dying = false;
    this.dyingTimerMax = 20;
    this.dyingTimer = this.dyingTimerMax;
    this.alive = true;
  }

  update() {
    // Translational motion
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);

    // Animate through sprite sheets
    this.animationTimer--;
    if(this.animationTimer <= 0) {
      this.animationTimer = this.framesPerAnimation;
      this.animate();
    }

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

    // If off-screen and distanceFromCenter is increasing, alive is false
    if(this.x < -this.width || this.x > canvasGA.width || this.y < -this.height || this.y > canvasGA.height) {
      let newDistanceFromCenter = distance(this.x, this.y, canvasGA.width/2, canvasGA.height/2);
      if(newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
        return;
      }
      else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    }
  }

  showDev() {
    this.shape.draw(contextGA, this.fillStyle);
  }

  draw() {
    contextGA.save();
    contextGA.translate(this.coordinates.x + this.width/2, this.coordinates.y + this.height/2);
    contextGA.rotate(this.angle);
    contextGA.globalAlpha = (this.dyingTimer/this.dyingTimerMax); //to have the image fade out as it's dying
    contextGA.drawImage(this.waveSheet, this.currImage*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.width/2, -this.height/2, this.width, this.height);
    contextGA.restore();
  }

  animate() {
    this.currImage += 1;
    if(this.currImage >= this.numImages) this.currImage = 0;
  }

  get x(){
    return this.coordinates.x;
  }

  get y(){
    return this.coordinates.y;
  }

  toString(){
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);
  }

}
