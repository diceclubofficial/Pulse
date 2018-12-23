"use strict"

class Polygon {

  constructor(points) {
    // list of vertices (as Vectors)
    this.vertices = [];
    for(let i = 0; i < points.length; i++) {
      this.vertices[i] = points[i];
    }

    // list of edges (as Vectors)
    this.edges = [];
    for(let i = 0; i < this.vertices.length; i++) {
      let point1 = this.vertices[i];
      let point2;
      if(i == this.vertices.length - 1) point2 = this.vertices[0];
      else point2 = this.vertices[i + 1];

      let edge = new Vector(point2.x - point1.x, point2.y - point1.y);
      this.edges[i] = edge;
    }
  }

  draw(context) {
    // draw vertices and edges
    for(let i = 0; i < this.vertices.length; i++) {
      let currPoint = this.vertices[i];
      let nextPoint;
      if(i == this.vertices.length - 1) nextPoint = this.vertices[0];
      else nextPoint = this.vertices[i + 1];
      // vertex
      context.beginPath();
      context.arc(currPoint.x, currPoint.y, 2, 0, 2*Math.PI);
      context.stroke();
      // edges
      context.beginPath();
      context.moveTo(currPoint.x, currPoint.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
    }

    // draw centroid
    context.beginPath();
    context.arc(this.centroid.x, this.centroid.y, 2, 0, 2*Math.PI);
    context.stroke();
  }

  project(axis) {
    // get the projection/shadow of a polygon along a certain axis
    // P = B * ( A / |A| )
    // P - projection, A - axis vector, B - projected vector
    axis.normalize(); //get the unit vector
    // console.log("Normalized axis: " + axis);
    let min = axis.dot(this.vertices[0]);
    let max = min;

    // iterate through all points and project them to find the longest section
    for(let vertex of this.vertices) {
      let p = axis.dot(vertex);
      if(p < min) min = p;
      else if(p > max) max = p;
    }
    let projection = new Projection(min, max);
    return projection;
  }

  get centroid() {
    // very similar to center of mass calculation
    // just treat each vertex as a point mass worth equal weight
    let sumX = 0, sumY = 0;
    for(let vertex of this.vertices) {
      sumX += vertex.x;
      sumY += vertex.y;
    }
    let centroidX = sumX / this.vertices.length;
    let centroidY = sumY / this.vertices.length;
    let centroid = new Vector(centroidX, centroidY);
    return centroid;
  }

  // get all the vectors perpendicular to the polygon's edges
  get normals() {
    let normals = [];
    for(let i = 0; i < this.edges.length; i++) {
      normals[i] = this.edges[i].perp();
    }
    return normals;
  }

  get vertexVectors() {
    return this.vertices;
  }

  get edgeVectors() {
    return this.edges;
  }

  toString() {
    let returned = "Polygon with points: "
    for(let point of points) {
      returned += "(" + point.x + ", " + point.y + ") ";
    }
    return returned;
  }
}
