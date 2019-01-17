"use strict"

class Star {

  constructor(x, y, r) {
    this.coordinates = new Vector(x, y);
    this.radius = r;
  }

  draw(context) {
    context.save();

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.closePath();

    context.restore();
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
    return "Star at x: " + Math.round(this.x) + " y: " + Math.round(this.y) + " with radius " + this.radius;
  }
}
