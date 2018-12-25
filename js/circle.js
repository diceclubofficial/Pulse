"use strict"

class Circle {

  constructor(c, r, start, end) {
    this.center = c;
    this.radius = r;

    this.startAngle = start;
    this.endAngle = end;
  }

  draw(context, color) {
    context.save();
    context.strokeStyle = color;
    context.beginPath();
    let start = 0;
    let end = 2*Math.PI;
    if(circle.startAngle != undefined && circle.endAngle != undefined) {
      start = circle.startAngle;
      end = circle.endAngle;
    }
    context.arc(this.x, this.y, this.radius, start, end);
    context.stroke();
    context.restore();
  }

  project(axis) {
    // get the projection/shadow of the circle along a certain axis
    // P = B * ( A / |A| )
    // P - projection, A - axis vector, B - projected vector
    axis.normalize(); //get the unit vector
    let centerProj = axis.dot(this.center);
    let min = centerProj - this.radius;
    let max = centerProj + this.radius;

    let projection = new Projection(min, max);
    return projection;
  }

  findClosestVertex(polygon) {
    let circle = this;
    //find closest vertex and return that axis
    let minDistancePos = 0;
    let minDistance = distance(polygon.vertices[0].x, polygon.vertices[0].y, circle.x, circle.y);
    for(let pos = 1; pos < polygon.vertices.length; pos++) {
      let vertex = polygon.vertices[pos];
      let d = distance(vertex.x, vertex.y, circle.x, circle.y);
      if(d < minDistance) {
        minDistance = d;
        minDistancePos = pos;
      }
    }

    let closestVertex = polygon.vertices[minDistancePos];
    return closestVertex;
  }

  get x() {
    return this.center.x;
  }
  get y() {
    return this.center.y;
  }
}
