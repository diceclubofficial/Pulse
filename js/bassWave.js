"use strict"

class BassWave {

  constructor(x, y, spd){
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = spd;

    // dimensions
    this.radius = 1;

    // calculate angle based on orientation towards the center of the screen
    let centerOfScreen = new Vector(canvasGA.width/2, canvasGA.height/2);
		let towardsCenter = new Vector(centerOfScreen.x, centerOfScreen.y);
		towardsCenter.sub(this.coordinates);
    let middleAngle = -1*(Math.PI/2 - towardsCenter.angle);
    this.startAngle = middleAngle - toRadians(30);
    this.endAngle = middleAngle + toRadians(30);

    this.fillStyle = 'white';
  }

  update() {
    // Increase radius
    this.radius += this.speed;
  }

  showShape() {
    // Draw arc
    contextGA.strokeStyle = this.fillStyle;
    contextGA.beginPath();
    contextGA.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    contextGA.stroke();
  }

  get x(){
    return this.coordinates.x;
  }

  get y(){
    return this.coordinates.y;
  }

  toString(){
    return (`Radius: ${this.radius} \n Angle: ${this.endAngle - this.startAngle} \n Location: ${this.coordinates.toString()}`);
  }

}
