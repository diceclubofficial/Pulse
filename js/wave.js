"use strict"
class Wave {

  constructor(x, y, vel){
    // image data
    this.waveSheet = new Image();
    this.waveSheet.src = "images/greenWaveSheet.png";
    this.spriteWidth = 64, this.spriteHeight = 20;

    // vector quantities
    this.coordinates = new Vector(x, y);
    this.velocity = vel;

    // scalar quantities
    this.width = 120;
    this.height = this.width * (this.spriteHeight / this.spriteWidth); // calculate height based on width and sprite size to not distort the image
    console.log(this.height);

    // calculate angle based on velocity vector
    this.angle = this.velocity.angle;

    this.fillStyle = 'rgb(30, 30, 30)';

    // sprite animation
    this.numImages = 2, this.currImage = 0;
    this.framesPerAnimation = 8; // change this to change the animation speed
    this.animationTimer = 0;

    this.alive = true;
  }

  update() {
    // Translational motion
    this.coordinates.add(this.velocity);

    // Animate through sprite sheets
    this.animationTimer--;
    if(this.animationTimer <= 0) {
      this.animationTimer = this.framesPerAnimation;
      this.animate();
    }

    // If off-screen, alive is false
    if(this.x < -this.width || this.x > canvasGA.width || this.y < -this.height || this.y > canvasGA.height) {
      this.alive = false;
    }

    // Collision detection with probe (square)
    let leftX = this.x;
    let rightX = this.x + this.width;
    let topY = this.y - this.width/2 + this.height/2;
    let bottomY = this.y + this.width;

    if(leftX < probe.x + probe.width && rightX > probe.x && topY < probe.y + probe.height && bottomY > probe.y) {
      this.alive = false;
      console.log("Wave collided!");
    }

  }

  showRect() {
    contextGA.fillStyle = this.fillStyle;

    contextGA.save();
    contextGA.translate(this.x + this.width/2, this.y + this.height/2);
    contextGA.rotate(this.angle);
    contextGA.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    contextGA.restore();

    // contextGA.fillStyle = "Tomato";
    // contextGA.fillRect(this.x, this.y - this.width/2 + this.height/2, this.width, this.width);

    contextGA.fillStyle = "pink";
    contextGA.fillRect(this.x, this.y - this.width/2 + this.height/2, 4, 4);
    contextGA.fillStyle = "lightblue";
    contextGA.fillRect(this.x + this.width, this.y + this.width, 4, 4);

    contextGA.fillStyle = "#000000";
  }

  showSprite() {
    contextGA.save();
    contextGA.translate(this.coordinates.x + this.width/2, this.coordinates.y + this.height/2);
    contextGA.rotate(this.angle);
    contextGA.drawImage(this.waveSheet, this.currImage*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.width/2, -this.height/2, this.width, this.height);
    contextGA.restore();
  }

  // private
  animate() {
    // console.log("animating wave; currImage: " + this.currImage + ", numImages: " + this.numImages);
    this.currImage += 1;

    // reset currImage to 0
    if(this.currImage >= this.numImages) this.currImage = 0;
  }

  get x(){
    return this.coordinates.x;
  }

  get y(){
    return this.coordinates.y;
  }

  get isAlive() {
    return this.alive;
  }

  toString(){
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);

  }

}
