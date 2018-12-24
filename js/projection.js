"use strict"

class Projection {

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  overlaps(otherProjection) {
    if(this.start < otherProjection.end && otherProjection.start < this.end) return true;
    return false;
  }

  toString(){
      return `start: ${this.start}, end: ${this.end}`;
  }
}
