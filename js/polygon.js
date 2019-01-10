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

  draw(context, color, drawPoints) {
    context.save();
    context.strokeStyle = color;
    // draw vertices and edges
    for(let i = 0; i < this.vertices.length; i++) {
      let currPoint = this.vertices[i];
      let nextPoint;
      if(i == this.vertices.length - 1) nextPoint = this.vertices[0];
      else nextPoint = this.vertices[i + 1];
      // vertex
      if(drawPoints) {
        context.beginPath();
        context.arc(currPoint.x, currPoint.y, 2, 0, 2*Math.PI);
        context.stroke();
      }
      // edges
      context.lineWidth = drawPoints ? 1 : 2;
      context.beginPath();
      context.moveTo(currPoint.x, currPoint.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
    }

    // centroid
    if(drawPoints) {
      context.beginPath();
      context.arc(this.centroid.x, this.centroid.y, 2, 0, 2*Math.PI);
      context.stroke();
    }
    context.restore();
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

  overlapsPolygon(polygon2, returnMTV) {
    let polygon1 = this;
    if(returnMTV == undefined) returnMTV = false;
    // Add normals to axes and remove parallel axes
    let minOverlap;
    let smallestAxis;
    if(returnMTV) {
      minOverlap = Number.MAX_SAFE_INTEGER;
    }
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
      else if(returnMTV) {
        let overlap = projection1.getOverlap(projection2);
        if(overlap < minOverlap) {
          minOverlap = overlap;
          smallestAxis = axis;
        }
      }
    }
    if(returnMTV) {
      let mtv = new Vector(smallestAxis.x, smallestAxis.y);
      mtv.magnitude = minOverlap;
      return mtv;
    }
    else return true;
  }

  overlapsCircle(circle) {
    let polygon = this;
    // Add normals (and circle axis) to axes and remove parallel axes
    let normals = polygon.normals;
    let closestVertex = circle.findClosestVertex(polygon);
    let circleAxis = new Vector(circle.x, circle.y);
    circleAxis.sub(closestVertex);
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

    // cycle through axes and evaluate if the polygons' projections overlap
    for(let axis of axes) {
      let polygonProj = polygon.project(axis);
      let circleProj = circle.project(axis);

      if(!polygonProj.overlaps(circleProj)) {
        return false;
      }
    }
    return true;
  }

  overlapsArc(circle, arcMargin) {
    let polygon = this;
    // Add normals (and circle axis) to axes and remove parallel axes
    let normals = polygon.normals;
    let closestVertex = circle.findClosestVertex(polygon);
    let circleAxis = new Vector(circle.x, circle.y);
    circleAxis.sub(closestVertex);
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

    // cycle through axes and evaluate if the polygons' projections overlap
    for(let axis of axes) {
      let polygonProj = polygon.project(axis);
      let circleProj = circle.project(axis);

      if(!polygonProj.overlaps(circleProj)) {
        return false;
      }
    }

    // Check if polygon is inside the angle range of the sector of the circle
    let towardsPolygon = new Vector(this.x, this.y);
    towardsPolygon.sub(new Vector(circle.x, circle.y));
    let middleAngle = -1*(Math.PI/2 - towardsPolygon.angle);

    if(middleAngle < circle.startAngle || middleAngle > circle.endAngle) {
      return false;
    }

    // Check if polygon is close to the actual sector rather than just inside but close to the center
    let polygonDistance = towardsPolygon.magnitude;
    console.log(polygonDistance, circle.radius);
    if(polygonDistance > circle.radius + arcMargin/2 || polygonDistance < circle.radius - arcMargin/2) {
      return false;
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

  get area() {
    let area = 0;
    let j = this.vertices.length - 1;  // The last vertex is the 'previous' one to the first

    for(let i = 0; i < this.vertices.length; i++) {
      area += (this.vertices[j].x + this.vertices[i].x) * (this.vertices[j].y - this.vertices[i].y);
      j = i;  //j is previous vertex to i
    }
    area /= 2;
    area = Math.abs(area);
    return area;
  }

  set centroid(newCentroid) {
    let difference = new Vector(newCentroid.x, newCentroid.y);
    difference.sub(this.x, this.y);
    this.translate(difference);
  }

  toString() {
    let returned = "Polygon with points: "
    for(let point of points) {
      returned += "(" + point.x + ", " + point.y + ") ";
    }
    return returned;
  }
}
