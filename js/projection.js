"use strict"

class Projection {

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  overlaps(otherProjection) {
    if(this.startPoint < otherProjection.endPoint && otherProjection.startPoint < this.endPoint) return true;
    return false;
  }

  get startPoint() {
    return this.start;
  }

  get endPoint() {
    return this.end;
  }

  toString(){
      return `start: ${this.startPoint}, end: ${this.endPoint}`;
  }
}
