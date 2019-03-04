"use strict"

class Asteroid {

  constructor(x, y, screenCoordinates, screenDimensions) {
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = MS_PER_FRAME * randomValue(0.18, 0.34);
    //random velocity
    this.velocity = new Vector(randomValue(-1, 1), randomValue(-1, 1));
    this.velocity.magnitude = this.speed;
    this.acceleration = new Vector(0, 0);

    // dimensions
    let radiusMin = 10;
    let radiusMax = 35;
    this.radius = randomValue(radiusMin, radiusMax);
    this.generateDimensions();

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.momentOfInertia = (.5 * this.mass * Math.pow(this.width / 2, 2));

    this.fillStyle = 'rgb(110, 110, 110)';

    this.onScreen = false;
    this.screenCoordinates = new Vector(screenCoordinates.x, screenCoordinates.y);
    this.screenDimensions = new Vector(screenDimensions.x, screenDimensions.y);
    this.centerOfScreen = new Vector(this.screenCoordinates.x + this.screenDimensions.x / 2, this.screenCoordinates.y + this.screenDimensions.y / 2);
    this.distanceFromCenter = distance(this.x, this.y, this.centerOfScreen.x, this.centerOfScreen.y);
    this.alive = true;

    this.collidingWithAsteroid = 0; // 1 when polygons intersect, 0.5 when big boxes intersect, 0 when no collision
    this.collidingWithProbe = 0;
    this.dwarf = 0; // 0 when not a dwarf asteroid, greater than 0 when recently spawned (counts down)
    this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity.magnitude, 2);
  }

  update() {
    // Translational motion
    this.velocity.add(this.acceleration);
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);
    this.acceleration.mult(0);

    // Rotational motion
    //this.angularAcceleration += ((-this.angularVelocity*.9)/this.momentOfInertia);
    this.angularAcceleration += (-this.angularVelocity * .005);
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.shape.rotate(this.angularVelocity);
    this.angularAcceleration *= 0;

    this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity.magnitude, 2);

    this.dwarf--;
    if (this.dwarf < 0) this.dwarf = 0;
    if (this.radius < 3) this.alive = false;

    // If offscreen and distanceFromCenter is increasing, alive is false
    if (this.x < this.screenCoordinates.x - this.width || this.x > this.screenCoordinates.x + this.screenDimensions.x || this.y < this.screenCoordinates.y - this.height || this.y > this.screenCoordinates.y + this.screenDimensions.y) {
      this.onScreen = false;
      let newDistanceFromCenter = distance(this.x, this.y, this.centerOfScreen.x, this.centerOfScreen.y);
      if (newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
      } else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    } else {
      this.onScreen = true;
    }
  }

  showDeveloperStats(context) {
    // fillStyle
    this.fillStyle = "rgb(255, 255, 255)";
    if (this.dwarf > 0) {
      this.fillStyle = "pink";
    }
    if (this.collidingWithAsteroid >= 1 || this.collidingWithProbe >= 1) {
      this.fillStyle = "rgb(255, 0, 0)";
    } else if (this.collidingWithAsteroid == 0.5 || this.collidingWithProbe == 0.5) {
      this.fillStyle = "orange";
    }

    // show asteroid shape with points
    this.shape.draw(context, this.fillStyle, true);

    // show radius
    context.save();
    context.strokeStyle = "Tomato";
    context.beginPath();
    context.moveTo(this.shape.centroid.x, this.shape.centroid.y);
    context.lineTo(this.shape.centroid.x + this.radius, this.shape.centroid.y);
    context.stroke();
    context.restore();

    // show width and height
    context.save();
    context.strokeStyle = "pink";
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();

    // print text
    context.save();
    let fontSize = this.height * 0.3;
    context.font = fontSize + "px Arial";
    context.textAlign = "center";
    context.fillStyle = this.fillStyle;
    let offset = this.height * 0.25;
    // velocity
    context.fillText(Math.round(this.velocity.x) + ", " + Math.round(this.velocity.y), this.shape.centroid.x, this.shape.centroid.y);
    // energy
    context.fillText(Math.round(this.energy), this.shape.centroid.x, this.shape.centroid.y + offset);
    // center
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Asteroid Center", this.centerOfScreen.x, this.centerOfScreen.y - 30);
    context.fillText(this.centerOfScreen.toString(), this.centerOfScreen.x, this.centerOfScreen.y);
    context.restore();
  }

  //taken from: https://stackoverflow.com/questions/25701798/a-reusable-function-to-clip-images-into-polygons-using-html5-canvas
  clippingPath(ctx, pathPoints, img, x, y) {

    // save the unclipped context
    ctx.save();

    // define the path that will be clipped to
    ctx.beginPath();
    //where it starts drawing the image ON THE CANVAS
    ctx.moveTo(pathPoints[0], pathPoints[1]);
    // this demo has a known number of polygon points
    // but include a loop of "lineTo's" if you have a variable number of points
    //ctx.lineTo(pathPoints[2],pathPoints[3]);
    //ctx.lineTo(pathPoints[4],pathPoints[5]);
    for (let i = 2; i < pathPoints.length; i += 2) {
      ctx.lineTo(pathPoints[i], pathPoints[i + 1]);
    }
    ctx.closePath();

    // stroke the path
    // half of the stroke is outside the path
    // the outside part of the stroke will survive the clipping that follows
    ctx.lineWidth = 2;
    ctx.stroke();

    // make the current path a clipping path
    ctx.clip();

    // draw the image which will be clipped except in the clipping path
    // and rotate
    ctx.translate(x, y);
    ctx.rotate(this.angle);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // restore the unclipped context (==undo the clipping path)
    ctx.restore();
  }

  draw(context) {
    // draw shape without points
    this.shape.draw(context, this.fillStyle, false);

    //draw the image
    let pathPoints = [];
    for (let vertex of this.shape.vertices) {
      pathPoints.push(vertex.x);
      pathPoints.push(vertex.y);
    }

    let asteroidImage = new Image();
    asteroidImage.src = "images/asteroidSurface.png";
    this.clippingPath(context, pathPoints, asteroidImage, this.shape.x, this.shape.y);
  }

  collisionDetection() {
    if (this.onScreen) {
      this.collisionDetectionWithAsteroid();
      this.collisionDetectionWithLander();
      this.collisionDetectionWithTerrain();
    }
  }

  collisionDetectionWithAsteroid() {
    let thisAsteroidColliding = 0;
    asteroidLoop: for (let other of asteroids) {
      // preliminary checks
      if (other == this || !other.onScreen || !this.onScreen) {
        continue asteroidLoop;
      }

      // next frame's rectangle
      let thisRectPrime = {
        x: this.x + this.velocity.x,
        y: this.y + this.velocity.y,
        width: this.width,
        height: this.height,
      }
      let otherRectPrime = {
        x: other.x + other.velocity.x,
        y: other.y + other.velocity.y,
        width: other.width,
        height: other.height,
      }

      // simple and fast big box collision detection
      if (!rectanglesCollide(thisRectPrime, otherRectPrime)) {
        continue asteroidLoop;
      }

      // more complex and slower polygon collision detection
      // translate to next frame
      this.translate(this.velocity);
      other.translate(other.velocity);
      let overlaps = this.shape.overlapsPolygon(other.shape, true);
      if (overlaps == false) {
        thisAsteroidColliding = 0.5;
        // reverse translation from next frame
        this.translate(new Vector(-this.velocity.x, -this.velocity.y));
        other.translate(new Vector(-other.velocity.x, -other.velocity.y));
        continue asteroidLoop;
      }

      // actual collision occurs
      thisAsteroidColliding = 1;

      // only do collision physics on one asteroid of the two
      if (this.collidingWithAsteroid == 1 || other.collidingWithAsteroid == 1) {
        continue asteroidLoop;
      }

      // translate asteroids out of each other
      let mtv = overlaps;
      other.coordinates.add(mtv);
      other.shape.translate(mtv);
      mtv.mult(-1);
      this.coordinates.add(mtv);
      this.shape.translate(mtv);

      // run velocity calculations and shattering
      let otherCopy = {
        mass: other.mass,
        velocity: new Vector(other.velocity.x, other.velocity.y)
      }
      other.collideAgainst(this);
      this.collideAgainst(otherCopy);
    }
    if (thisAsteroidColliding == 1) {
      this.collidingWithAsteroid = (this.collidingWithAsteroid == 0.5) ? 1 : this.collidingWithAsteroid + 1;
    } else this.collidingWithAsteroid = thisAsteroidColliding;
  }
  collisionDetectionWithLander() {

    // next frame's rectangles
    let probeRectPrime = {
      x: probe.x + probe.velocity.x,
      y: probe.y + probe.velocity.y,
      width: probe.width,
      height: probe.height,
    }
    let thisRectPrime = {
      x: this.x + this.velocity.x,
      y: this.y + this.velocity.y,
      width: this.width,
      height: this.height,
    }

    // simple and fast big box collision detection
    if (!rectanglesCollide(probeRectPrime, thisRectPrime)) {
      this.collidingWithProbe = 0;
      return;
    }

    // more complex and slower polygon collision detection
    probe.translate(probe.velocity);
    this.translate(this.velocity);
    let overlaps = probe.shape.overlapsPolygon(this.shape, true);
    if (overlaps == false) {
      this.collidingWithProbe = 0.5;
      probe.translate(new Vector(-probe.velocity.x, -probe.velocity.y));
      this.translate(new Vector(-this.velocity.x, -this.velocity.y));
      return;
    }

    // collision occurs:
    // translate asteroid out of lander
    let mtv = overlaps;
    mtv.mult(2);
    this.translate(mtv);

    // apply force on lander
    let velX = getFinalCollisionVelocity(probe.mass, probe.velocity.x, this.mass, this.velocity.x);
    let velY = getFinalCollisionVelocity(probe.mass, probe.velocity.y, this.mass, this.velocity.y);
    let newVelocity = new Vector(velX, velY);
    let forceX = probe.mass * (newVelocity.x - probe.velocity.x);
    let forceY = probe.mass * (newVelocity.y - probe.velocity.y);
    let force = new Vector(forceX, forceY);
    force.mult(0.7);
    probe.applyForce(force);

    // decrease health and show destruction
    probe.health -= 2 * force.magnitude;
    let randomVertexPos = randomInt(0, probe.shape.vertices.length);
    let randomVertex = probe.shape.vertices[randomVertexPos];
    spawnExplosion(randomVertex.x, randomVertex.y, 0.13);

    // run velocity calculations and shattering on asteroid
    this.collideAgainst(probe);
    this.collidingWithProbe = (this.collidingWithProbe == 0.5) ? 1 : this.collidingWithProbe + 1;
  }
  collisionDetectionWithTerrain() {
    // preliminary check
    if (this.y + this.height + this.velocity.y < terrain.seaLevel - terrain.maxElevationDiff) {
      return;
    }

    // check if each vertex is below the terrain
    vertexLoop: for (let vertex of this.shape.vertices) {
      if (terrain.isPointBelowSurface(vertex.x + this.velocity.x, vertex.y + this.velocity.y)) {
        spawnAsteroidCollisionDust(this.shape.x, this.shape.y, this.radius*0.08);
        this.alive = false;
        return;
      }
    }
  }

  collideAgainst(otherObject, shatter = false) {
    // calculate new velocity
    let velX = getFinalCollisionVelocity(this.mass, this.velocity.x, otherObject.mass, otherObject.velocity.x);
    let velY = getFinalCollisionVelocity(this.mass, this.velocity.y, otherObject.mass, otherObject.velocity.y);
    let newVelocity = new Vector(velX, velY);
    let newEnergy = 0.5 * this.mass * Math.pow(newVelocity.magnitude, 2);

    //spawn animation asteroid dust
    let animationPosition = new Vector(this.shape.centroid.x, this.shape.centroid.y);
    animationPosition.sub(newVelocity);
    spawnAsteroidCollisionDust(animationPosition.x, animationPosition.y, 0.05 * this.radius);

    // break into pieces
    if (shatter || (this.dwarf <= 0 && newEnergy > 20)) {
      this.shatter(newVelocity);
    } else { // or bounce elastically
      this.velocity = newVelocity;
      // apply a random torque because it looks cool
      let randomDir = randomInt(0, 2);
      this.applyTorque(randomDir);
    }
  }
  shatter(totalVelocity) {
    let fragments = 3;
    let totalEnergy = this.energy;
    let fragmentEnergy = totalEnergy / fragments;

    let minRadius = 5,
      maxRadius = this.radius;
    let velocitySum = new Vector(0, 0);

    for (let i = 0; i < fragments; i++) {
      // energy = 0.5*mass*speed^2
      // so speed = (2*energy/mass)^1/2
      let newAsteroid = new Asteroid(this.x, this.y, this.screenCoordinates, this.screenDimensions);
      let randomRadius = randomValue(minRadius, maxRadius);
      newAsteroid.radius = randomRadius;
      newAsteroid.generateDimensions();
      let speed = Math.pow((2 * fragmentEnergy) / newAsteroid.mass, 1 / 2);
      // last asteroid corrects the velocity direction
      if (i == fragments - 1) {
        totalVelocity.sub(velocitySum);
        newAsteroid.velocity = new Vector(totalVelocity.x, totalVelocity.y);
        newAsteroid.velocity.magnitude = speed;
      }
      // other asteroids spawn with random velocity directions
      else {
        newAsteroid.velocity = new Vector(randomValue(-1, 1), randomValue(-1, 1));
        newAsteroid.velocity.magnitude = speed;
        velocitySum.add(newAsteroid);
      }
      newAsteroid.dwarf = 100;
      asteroids.push(newAsteroid);
    }
    this.alive = false;
  }

  applyForce(force) { // force need be a vector
    let appliedForce = new Vector(force.x, force.y);
    appliedForce.div(this.mass);
    this.acceleration.add(appliedForce);
  }
  applyTorque(clockwise, multiplier) {
    if (multiplier == undefined) multiplier = 1;
    if (clockwise) {
      this.angularAcceleration += 0.01 * multiplier;
    } else {
      this.angularAcceleration -= 0.01 * multiplier;
    }
  }

  generateDimensions() {
    this.generateDimensionsPolygonConcave();
    // this.generateDimensionsPolygonRegular(6);
  }
  generateDimensionsPolygonRegular(numVertices) {
    let deltaTheta = 2 * Math.PI / numVertices;
    this.width = 2 * this.radius; // big box
    this.height = 2 * this.radius;

    let center = new Vector(this.x + this.width / 2, this.y + this.height / 2);
    let vertices = [];
    for (let i = 0; i < numVertices; i++) {
      let point = new Vector(center.x, center.y - this.radius);
      let rotatedPoint = rotatePoint(point, i * deltaTheta, center);
      vertices.push(rotatedPoint);
    }
    this.shape = new Polygon(vertices);
    this.mass = this.shape.area / MASS_CONSTANT;
    this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity.magnitude, 2);
  }
  generateDimensionsPolygonConcave() {
    let numVertices = 20; // change to depend on radius
    let deltaTheta = 2 * Math.PI / numVertices;

    let noise = new Perlin();
    let noiseStep = 0.2;
    let seed = 256 * Math.random();
    let maxDiff = 0.4 * this.radius; // maximum noise value (amplitude if noise was a wave)
    this.width = 2 * (this.radius + maxDiff); // make big box
    this.height = 2 * (this.radius + maxDiff);

    let center = new Vector(this.x + this.width / 2, this.y + this.height / 2);
    let vertices = [];
    for (let i = 0; i < numVertices; i++) {
      let randomDiff = maxDiff * noise.getValue(seed + (i * noiseStep));
      let point = new Vector(center.x, center.y - this.radius + randomDiff);
      let rotatedPoint = rotatePoint(point, deltaTheta * i, center);
      vertices.push(rotatedPoint);
    }
    this.shape = new Polygon(vertices);
    this.mass = this.shape.area / MASS_CONSTANT;
  }

  translate(translationVector) {
    this.coordinates.add(translationVector);
    this.shape.translate(translationVector);
  }

  get x() {
    return this.coordinates.x;
  }
  get y() {
    return this.coordinates.y;
  }
  get energy() {
    this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity.magnitude, 2);
    return this.kineticEnergy;
  }

  toString() {
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);
  }
}
