"use strict"

class Star {

  constructor(x, y, r) {
    this.coordinates = new Vector(x, y);
    this.radius = r;
  }

  draw() {
    contextGA.save();

    contextGA.beginPath();
    contextGA.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    contextGA.fillStyle = "white";
    contextGA.shadowColor = "#E3EAEF";
    contextGA.shadowBlur = 20;
    contextGA.fill();
    contextGA.closePath();

    contextGA.restore();
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
