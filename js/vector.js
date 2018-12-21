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

  toString(){
      return `x: ${this.components[0]}, y: ${this.components[1]}`;
  }

}
