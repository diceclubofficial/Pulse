"use strict"

class BassWave {

  constructor(x, y, screenCoordinates, screenDimensions) {
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = 3.2;
    this.radius = 1;
    this.fillStyle = 'white';

    // Calculate angle based on orientation towards the center of the screen
    this.screenCoordinates = new Vector(screenCoordinates.x, screenCoordinates.y);
    this.screenDimensions = new Vector(screenDimensions.x, screenDimensions.y);
    this.centerOfScreen = new Vector(screenCoordinates.x + screenDimensions.x/2, screenCoordinates.y + screenDimensions.y/2);
		this.towardsCenter = new Vector(this.centerOfScreen.x, this.centerOfScreen.y);
		this.towardsCenter.sub(this.coordinates);
    this.towardsCenter.magnitude = this.radius;
    let middleAngle = -1*(Math.PI/2 - this.towardsCenter.angle);
    let angleSpan = 45; // in degrees
    this.startAngle = middleAngle - toRadians(angleSpan/2);
    this.endAngle = middleAngle + toRadians(angleSpan/2);

    // velocity
		this.velocity = new Vector(this.towardsCenter.x, this.towardsCenter.y);
		this.velocity.magnitude = this.speed;

    // shape
    this.shape = new Circle(new Vector(this.x, this.y), this.radius, this.startAngle, this.endAngle);

    // for calculating when to die
    this.circumPoint = new Vector(this.x, this.y);
    this.circumPoint.add(this.towardsCenter); // circumPoint is the point on the circumference of the circle closest to the center of the screen
    this.distanceFromCenter = distance(this.circumPoint.x, this.circumPoint.y, this.centerOfScreen.x, this.centerOfScreen.y);
    this.alive = true;
  }

  update() {
    // Move coordinates and increase radius
    this.coordinates.add(this.velocity);
    this.radius += this.speed;

    // Update circle shape
    this.shape = new Circle(new Vector(this.x, this.y), this.radius, this.startAngle, this.endAngle);

    // Update circumPoint
    this.towardsCenter.magnitude = this.radius;
    this.circumPoint = new Vector(this.x, this.y);
    this.circumPoint.add(this.towardsCenter);

    // If circumPoint is off-screen and distance from center is increasing, alive is false
    if(this.circumPoint.x < this.screenCoordinates.x || this.circumPoint.x > this.screenCoordinates.x + this.screenDimensions.x || this.circumPoint.y < this.screenCoordinates.y || this.circumPoint.y > this.screenCoordinates.y + this.screenDimensions.y) {
      let newDistanceFromCenter = distance(this.circumPoint.x, this.circumPoint.y, this.centerOfScreen.x, this.centerOfScreen.y);
      if(newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
        return;
      } else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    }
  }

  showDeveloperStats(context) {
    context.save();
    context.strokeStyle = "Tomato";

    // center
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, 2*Math.PI);
    context.stroke();

    // radius
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.circumPoint.x, this.circumPoint.y);
    context.stroke();

    // center
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText("Wave Center", this.centerOfScreen.x, this.centerOfScreen.y - 30);
    context.fillText(this.centerOfScreen.toString(), this.centerOfScreen.x, this.centerOfScreen.y);

    context.restore();
  }

  draw(context) {
    context.save();
    context.strokeStyle = this.fillStyle;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    context.stroke();

    context.restore();
  }

  collisionDetection() {
    if(probe.shape.overlapsArc(this.shape, 30)) {
			let towardsLander = new Vector(probe.x, probe.y);
			towardsLander.sub(this.coordinates);
			let force = new Vector(towardsLander.x, towardsLander.y);
			force.magnitude = 3;
			probe.applyForce(force);

			this.alive = false;
		}
  }

  translate(translationVector) {
    this.coordinates.add(translationVector);
  }

  get x() {
    return this.coordinates.x;
  }
  get y() {
    return this.coordinates.y;
  }

  toString() {
    return (`Radius: ${this.radius} \n Angle: ${this.endAngle - this.startAngle} \n Location: ${this.coordinates.toString()}`);
  }
}
