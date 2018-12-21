"use strict"
class Lander {

  constructor(x, y){
    this.coordinates = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    this.mass = 1;
    this.width = 10;
    this.height = 20;

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.thrusters = 0.15;
    this.momentOfInertia = (.5 * this.mass * Math.pow(this.width/2, 2));
    this.fuel = 3000;
  }

  applyForce(force){ // force need be a vector
    this.acceleration.add(force);
  }

  applyTorque(clockwise){
    if (clockwise) {
      this.angularAcceleration += 0.01;
    } else {
      this.angularAcceleration -= 0.01;
    }

  }

  applyThrusters(){
    let thrustForce = new Vector(this.thrusters * Math.cos(this.angle-(Math.PI/2)), this.thrusters * Math.sin(this.angle-(Math.PI/2)));

    this.acceleration.add(thrustForce)
  }

  update() {
    // Translational motion
    this.velocity.add(this.acceleration);
    this.coordinates.add(this.velocity);

    this.acceleration.mult(0);

    // Rotational motion

    this.angularAcceleration += ((-this.angularVelocity*.9)/this.momentOfInertia);

    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;

    this.angularAcceleration *= 0;
  }

  show() {
    contextGA.fillStyle = "rgb(255, 255, 255)";

    contextGA.save();
    contextGA.translate(this.coordinates.x + this.width/2, this.coordinates.y + this.height/2);
    contextGA.rotate(this.angle);
    contextGA.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    contextGA.restore();

    contextGA.fillStyle = "#000000";
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
