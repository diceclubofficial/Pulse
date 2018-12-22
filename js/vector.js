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
    return Math.PI/2 + Math.atan2(this.components[1], this.components[0]);
  }

  toString(){
      return `x: ${Math.floor(this.components[0])}, y: ${Math.floor(this.components[1])}`;
  }

}
