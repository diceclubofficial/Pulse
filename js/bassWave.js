"use strict"

class BassWave {

  constructor(x, y){
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = randomInt(10, 15);

    // basics
    this.radius = 1;
    this.fillStyle = 'white';

    // calculate angle based on orientation towards the center of the screen
    let centerOfScreen = new Vector(canvasGA.width/2, canvasGA.height/2);
		this.towardsCenter = new Vector(centerOfScreen.x, centerOfScreen.y);
		this.towardsCenter.sub(this.coordinates);
    this.towardsCenter.magnitude = this.radius;
    let middleAngle = -1*(Math.PI/2 - this.towardsCenter.angle);
    let angleSpan = 20; // in degrees
    this.startAngle = middleAngle - toRadians(angleSpan/2);
    this.endAngle = middleAngle + toRadians(angleSpan/2);

    // shape
    this.shape = new Circle(new Vector(this.x, this.y), this.radius, this.startAngle, this.endAngle);

    // For calculating when to die
    this.circumPoint = new Vector(this.x, this.y);
    this.circumPoint.add(this.towardsCenter); // circumPoint is the point on the circumference of the circle closest to the center of the screen
    this.distanceFromCenter = distance(this.circumPoint.x, this.circumPoint.y, canvasGA.width/2, canvasGA.height/2);
    this.alive = true;
  }

  update() {
    // Increase radius
    this.radius += this.speed;

    // Update circle shape
    this.shape = new Circle(new Vector(this.x, this.y), this.radius, this.startAngle, this.endAngle);

    // Update circumPoint
    this.towardsCenter.magnitude = this.radius;
    this.circumPoint = new Vector(this.x, this.y);
    this.circumPoint.add(this.towardsCenter);

    // If circumPoint is off-screen and distance from center is increasing, alive is false
    if(this.circumPoint.x < 0 || this.circumPoint.x > canvasGA.width || this.circumPoint.y < 0 || this.circumPoint.y > canvasGA.height) {
      let newDistanceFromCenter = distance(this.circumPoint.x, this.circumPoint.y, canvasGA.width/2, canvasGA.height/2);
      if(newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
        return;
      }
      else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    }
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
