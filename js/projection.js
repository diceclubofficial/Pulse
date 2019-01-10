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

  getOverlap(otherProjection) {
    let pointA;
    let pointB;
    if(this.start > otherProjection.start) pointA = this.start;
    else pointA = otherProjection.start;
    if(this.end > otherProjection.end) pointB = otherProjection.end;
    else pointB = this.end;

    let overlap = pointB - pointA;
    return overlap;
  }

  toString(){
      return `start: ${this.start}, end: ${this.end}`;
  }
}
