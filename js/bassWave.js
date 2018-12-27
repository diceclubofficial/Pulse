"use strict"

class BassWave {

  constructor(x, y) {
    // vector quantities
    this.coordinates = new Vector(x, y);
    // this.speed = randomInt(5, 10);
    this.speed = 8;

    // basics
    this.radius = 1;
    this.fillStyle = 'white';

    // Calculate angle based on orientation towards the center of the screen
    let centerOfScreen = new Vector(canvasGA.width/2, canvasGA.height/2);
		this.towardsCenter = new Vector(centerOfScreen.x, centerOfScreen.y);
		this.towardsCenter.sub(this.coordinates);
    this.towardsCenter.magnitude = this.radius;
    let middleAngle = -1*(Math.PI/2 - this.towardsCenter.angle);
    let angleSpan = 45; // in degrees
    this.startAngle = middleAngle - toRadians(angleSpan/2);
    this.endAngle = middleAngle + toRadians(angleSpan/2);

    // Velocity
		this.velocity = new Vector(this.towardsCenter.x, this.towardsCenter.y);
		this.velocity.magnitude = this.speed;

    // shape
    this.shape = new Circle(new Vector(this.x, this.y), this.radius, this.startAngle, this.endAngle);

    // For calculating when to die
    this.circumPoint = new Vector(this.x, this.y);
    this.circumPoint.add(this.towardsCenter); // circumPoint is the point on the circumference of the circle closest to the center of the screen
    this.distanceFromCenter = distance(this.circumPoint.x, this.circumPoint.y, canvasGA.width/2, canvasGA.height/2);
    this.alive = true;
  }

  update() {
    // Move coordinates and increase radius
    this.coordinates.add(this.velocity);
    this.radius += this.speed*0.4;

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

  showDev() {
    contextGA.save();
    contextGA.strokeStyle = this.fillStyle;

    // center
    contextGA.beginPath();
    contextGA.arc(this.x, this.y, 5, 0, 2*Math.PI);
    contextGA.stroke();

    // radius
    contextGA.beginPath();
    contextGA.moveTo(this.x, this.y);
    contextGA.lineTo(this.circumPoint.x, this.circumPoint.y);
    contextGA.stroke();

    contextGA.restore();
  }

  draw() {
    contextGA.save();
    contextGA.strokeStyle = this.fillStyle;

    // arc
    contextGA.beginPath();
    contextGA.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    contextGA.stroke();

    contextGA.restore();
  }

  collisionDetection() {
    if(probe.shape.overlapsArc(this.shape, 30)) {
			console.log("overlaps with bass wave");
			let towardsLander = new Vector(probe.x, probe.y);
			towardsLander.sub(this.coordinates);
			let force = new Vector(towardsLander.x, towardsLander.y);
			force.magnitude = 3;
			probe.applyForce(force);

			this.alive = false;
		}
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
