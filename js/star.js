"use strict"

class Star {

  constructor(x, y, r) {
    this.location = new Vector(x, y);
    this.radius = r;
  }

  show(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    context.fillStyle = "white";
    context.shadowColor = "#E3EAEF";
    context.shadowBlur = 20;
    context.fill();
    context.closePath();
    context.restore();
  }

  get x() {
    return this.location.x;
  }
  get y() {
    return this.location.y;
  }
}
