"use strict"

class Vector {

  constructor(x, y) {
    this.components = [x, y];
  }

  add(value) {
    if (typeof value == 'number') {
      this.components[0] += value;
      this.components[1] += value;
    } else if (typeof value === 'object') { // Conditional must check if the object is a vector
      this.components[0] += value.x;
      this.components[1] += value.y;
    }
  }

  sub(value) {
    if (typeof value == 'number') {
      this.components[0] -= value;
      this.components[1] -= value;
    } else if (typeof value === 'object') { // Conditional must check if the object is a vector
      this.components[0] -= value.x;
      this.components[1] -= value.y;
    }
  }

  div(value) {
    if (typeof value == 'number') {
      this.components[0] /= value;
      this.components[1] /= value;
    }
  }

  mult(value) {
    if (typeof value == 'number') {
      this.components[0] *= value;
      this.components[1] *= value;
    }
  }

  // dot product
  dot(otherVector) {
    return (this.x*otherVector.x) + (this.y*otherVector.y);
  }

  // set magnitude to 1 to become a unit vector
  normalize() {
    this.div(this.magnitude);
  }

  // return perpendicular vector
  perp() {
    let perpendicular = new Vector(this.components[1], -this.components[0]);
    return perpendicular;
  }

  isParallelTo(otherVector) {
    let thisSlope = this.y / this.x;
    let otherSlope = otherVector.y / otherVector.x;

    if(thisSlope == otherSlope) return true;
    if(Math.abs(thisSlope) == Infinity && Math.abs(otherSlope) == Infinity) return true;
    else return false;
  }

  // to draw a vector from a point and scaled up a certain value
  draw(context, origin, scalar, color) {
    context.save();
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(origin.x, origin.y);
    let distance = new Vector(this.x, this.y);
    distance.mult(scalar);
    let target = new Vector(origin.x + distance.x, origin.y + distance.y);
    context.lineTo(target.x, target.y);
    context.stroke();
    context.restore();
    console.log("Drawing from (" + origin.x + ", " + origin.y + ") to (" + target.x + ", " + target.y +")")
  }

  get x() {
    return this.components[0];
  }
  get y() {
    return this.components[1];
  }
  get magnitude() {
    return Math.sqrt(Math.pow(this.components[0], 2) + Math.pow(this.components[1], 2));
  }
  set magnitude(newMag) {
    let ratio = newMag / this.magnitude;
    this.components[0] = this.components[0] * ratio;
    this.components[1] = this.components[1] * ratio;
  }
  get angle() {
    // angle in radians measured from vertical (positive is clockwise)
    let angle = Math.PI/2 + Math.atan2(this.components[1], this.components[0]);
    if(angle > Math.PI) angle = -(2*Math.PI - angle);
    return angle;
  }

  toString(){
    return `x: ${this.components[0]}, y: ${this.components[1]}`;
  }
}
