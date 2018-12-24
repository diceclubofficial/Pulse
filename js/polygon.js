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
    this.updateEdges();
  }

  updateEdges() {
    for(let i = 0; i < this.vertices.length; i++) {
      let point1 = this.vertices[i];
      let point2;
      if(i == this.vertices.length - 1) point2 = this.vertices[0];
      else point2 = this.vertices[i + 1];

      let edge = new Vector(point2.x - point1.x, point2.y - point1.y);
      this.edges[i] = edge;
    }
  }

  draw(context, color) {
    context.strokeStyle = color;
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

  rotate(theta) {
    // theta in radians
    let fixedCentroid = this.centroid;
    for(let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = rotatePoint(this.vertices[i], theta, fixedCentroid);
    }
    this.updateEdges();
  }

  translate(vector) {
    for(let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(vector);
    }
  }

  overlapsPolygon(polygon2) {
    let polygon1 = this;
    // Add normals to axes and remove parallel axes
    let normals1 = polygon1.normals;
    let normals2 = polygon2.normals;
    let normals = normals1.concat(normals2);
    let axes = [];
    outer: for(let normal of normals) {
      for(let axis of axes) {
        if(axis.isParallelTo(normal)) {
          continue outer;
        }
      }
      axes.push(normal);
    }

    // cycle through axes and evaluate if the polygons' projections overlap
    for(let axis of axes) {
      let projection1 = polygon1.project(axis);
      let projection2 = polygon2.project(axis);

      if(!projection1.overlaps(projection2)) {
        return false;
      }
    }
    return true;
  }

  overlapsCircle(circle) {
    let polygon = this;
    // Add normals (and circle axis) to axes and remove parallel axes
    let normals = polygon.normals;
    let closestVertex = circle.findClosestVertex(polygon);
    let circleAxis = new Vector(circle.x, circle.y);
    circleAxis.sub(closestVertex);
    console.log(circleAxis);
    circleAxis.draw(context, new Vector(canvas.width/2, canvas.height/2), 10);

    normals.push(circleAxis);
    let axes = [];
    outer: for(let normal of normals) {
      for(let axis of axes) {
        if(axis.isParallelTo(normal)) {
          continue outer;
        }
      }
      axes.push(normal);
    }

    console.log("axes: ");
    console.log(axes);

    // cycle through axes and evaluate if the polygons' projections overlap
    for(let axis of axes) {
      let polygonProj = polygon.project(axis);
      let circleProj = circle.project(axis);

      console.log("polygon proj: " + polygonProj);
      console.log("circle proj: " + circleProj);

      if(!polygonProj.overlaps(circleProj)) {
        return false;
      }
    }

    //if circle has start and end angle specified, only return true if the polygon is inside that range
    if(circle.startAngle != undefined && circle.endAngle != undefined) {
  		let towardsPolygon = new Vector(this.x, this.y);
  		towardsPolygon.sub(new Vector(circle.x, circle.y));
      towardsPolygon.draw(context, new Vector(circle.x, circle.y), 1);
      let middleAngle = Math.PI/2 - towardsPolygon.angle;
      console.log("middle angle: " + toDegrees(middleAngle));
      console.log(toDegrees(circle.startAngle), toDegrees(circle.endAngle));
      if(middleAngle < circle.startAngle || middleAngle > circle.endAngle) {
        return false;
      }
    }
    return true;
  }

  get x() {
    return this.centroid.x;
  }
  get y() {
    return this.centroid.y;
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

  toString() {
    let returned = "Polygon with points: "
    for(let point of points) {
      returned += "(" + point.x + ", " + point.y + ") ";
    }
    return returned;
  }
}
