"use strict"

class Asteroid {

  constructor(x, y) {
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = randomValue(3, 8);
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

    this.momentOfInertia = (.5 * this.mass * Math.pow(this.width/2, 2));
    this.fillStyle = 'rgb(255, 255, 255)';

    this.onScreen = false;
    this.distanceFromCenter = distance(this.x, this.y, canvasGA.width/2, canvasGA.height/2);
    this.alive = true;

    this.collidingWithAsteroid = 0; // 1 when polygons intersect, 0.5 when big boxes intersect, 0 when no collision
    this.collidingWithProbe = 0;
    this.dwarf = 0; // 0 when not a dwarf asteroid, greater than 0 when recently spawned (counts down)
    this.kineticEnergy = 0.5*this.mass*Math.pow(this.velocity.magnitude, 2);
  }

  update() {
    // Translational motion
    this.velocity.add(this.acceleration);
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);

    this.acceleration.mult(0);

    // Rotational motion
    //this.angularAcceleration += ((-this.angularVelocity*.9)/this.momentOfInertia);
    this.angularAcceleration += (-this.angularVelocity*.005);
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.shape.rotate(this.angularVelocity);

    this.angularAcceleration *= 0;

    this.kineticEnergy = 0.5*this.mass*Math.pow(this.velocity.magnitude, 2);

    this.dwarf--;
    if(this.dwarf < 0) this.dwarf = 0;
    if(this.radius < 3) this.alive = false;

    // If offscreen and distanceFromCenter is increasing, alive is false
    if(this.x < -this.width || this.x > canvasGA.width || this.y < -this.height || this.y > canvasGA.height) {
      this.onScreen = false;
      let newDistanceFromCenter = distance(this.x, this.y, canvasGA.width/2, canvasGA.height/2);
      if(newDistanceFromCenter > this.distanceFromCenter) {
        this.alive = false;
      }
      else {
        this.distanceFromCenter = newDistanceFromCenter;
      }
    }
    else {
      this.onScreen = true;
    }
  }

  showDev() {
    // fillStyle
    this.fillStyle = "rgb(255, 255, 255)";
    if(this.dwarf > 0) {
      this.fillStyle = "pink";
    }
    if(this.collidingWithAsteroid >= 1 || this.collidingWithProbe >= 1) {
      this.fillStyle = "rgb(255, 0, 0)";
    }
    else if(this.collidingWithAsteroid == 0.5 || this.collidingWithProbe == 0.5) {
      this.fillStyle = "orange";
    }

    // show asteroid shape with points
    this.shape.draw(contextGA, this.fillStyle, true);

    // show radius
    contextGA.save();
    contextGA.strokeStyle = "Tomato";
    contextGA.beginPath();
    contextGA.moveTo(this.shape.centroid.x, this.shape.centroid.y);
    contextGA.lineTo(this.shape.centroid.x + this.radius, this.shape.centroid.y);
    contextGA.stroke();
    contextGA.restore();

    // show width and height
    contextGA.save();
    contextGA.strokeStyle = "pink";
    contextGA.strokeRect(this.x, this.y, this.width, this.height);
    contextGA.restore();

    // print text
    contextGA.save();
    let fontSize = this.height*0.3;
    contextGA.font = fontSize + "px Arial";
    contextGA.textAlign = "center";
    contextGA.fillStyle = this.fillStyle;
    let offset = this.height*0.25;
    // velocity
    contextGA.fillText(Math.round(this.velocity.x) + ", " + Math.round(this.velocity.y), this.shape.centroid.x, this.shape.centroid.y);
    // energy
    contextGA.fillText(Math.round(this.energy), this.shape.centroid.x, this.shape.centroid.y + offset);
    contextGA.restore();
  }

  draw() {
    // draw shape without points
    this.shape.draw(contextGA, this.fillStyle, false);
  }

  collisionDetection() {
    this.collisionDetectionWithAsteroid();
    this.collisionDetectionWithLander();
    this.collisionDetectionWithTerrain();
  }

  collisionDetectionWithAsteroid() {
    let thisAsteroidColliding = 0;
    asteroidLoop: for(let other of asteroids) {
      if(other != this && other.onScreen) {
        // simple and fast big box collision detection
        if(other.x + other.width > this.x && other.x < this.x + this.width && other.y + other.height > this.y && other.y < this.y + this.width) {
          // if it passes, do more complex and slower polygon collision detection
          let overlaps = this.shape.overlapsPolygon(other.shape, true);
          if(overlaps != false) {
            thisAsteroidColliding = 1;

            //only do post-collision physics on one asteroid of the two
            if(this.collidingWithAsteroid != 1 && other.collidingWithAsteroid != 1) {
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
          }
          else thisAsteroidColliding = 0.5;
        }
      }
    }
    if(thisAsteroidColliding == 1) {
      this.collidingWithAsteroid = (this.collidingWithAsteroid == 0.5) ? 1 : this.collidingWithAsteroid + 1;
    }
    else this.collidingWithAsteroid = thisAsteroidColliding;
  }

  collisionDetectionWithLander() {
    // simple and fast big box collision detection
    if(probe.x + probe.width > this.x && probe.x < this.x + this.width && probe.y + probe.height > this.y && probe.y < this.y + this.width) {
      // if it passes, do more complex and slower polygon collision detection
      let overlaps = probe.shape.overlapsPolygon(this.shape, true);
      if(overlaps != false) {
        // translate asteroid way out of lander
        let mtv = overlaps;
        mtv.mult(2);
        this.coordinates.add(mtv);
        this.shape.translate(mtv);

        // change lander's velocity
        let velX = getFinalCollisionVelocity(probe.mass, probe.velocity.x, this.mass, this.velocity.x);
        let velY = getFinalCollisionVelocity(probe.mass, probe.velocity.y, this.mass, this.velocity.y);
        let newVelocity = new Vector(velX, velY);
        let forceX = probe.mass*(newVelocity.x - probe.velocity.x);
        let forceY = probe.mass*(newVelocity.y - probe.velocity.y);
        let force = new Vector(forceX, forceY);
        force.mult(0.4);
        probe.applyForce(force);

        // run velocity calculations and shattering on asteroid
        this.collideAgainst(probe);
        this.collidingWithProbe = (this.collidingWithProbe == 0.5) ? 1 : this.collidingWithProbe + 1;
      }
      else this.collidingWithProbe = 0.5;
    }
    else this.collidingWithProbe = 0;
  }

  collisionDetectionWithTerrain() {
    // simple and fast
    if(this.y + this.height > terrain.seaLevel - terrain.maxElevationDiff) {
      // check if each vertex is below the terrain
      for(let vertex of this.shape.vertices) {
        if(terrain.isPointBelowSurface(vertex.x, vertex.y)) {
          this.alive = false;
          return;
        }
      }
    }
  }

  collideAgainst(otherObject, shatter) {
    // calculate new velocity
    let velX = getFinalCollisionVelocity(this.mass, this.velocity.x, otherObject.mass, otherObject.velocity.x);
    let velY = getFinalCollisionVelocity(this.mass, this.velocity.y, otherObject.mass, otherObject.velocity.y);
    let newVelocity = new Vector(velX, velY);

    // break into pieces
    let newEnergy = 0.5*this.mass*Math.pow(newVelocity.magnitude, 2);
    if(this.dwarf <= 0 && (shatter || newEnergy > 30)) {
      this.shatter(newVelocity);
    }
    // or bounce elastically
    else {
      this.velocity = newVelocity;
      this.coordinates.add(this.velocity);
      this.shape.translate(this.velocity);
      // apply a random torque because it looks cool
      let randomDir = randomInt(0, 2);
      this.applyTorque(randomDir);
    }
  }

  shatter(totalVelocity) {
    let fragments = 3;
    let totalEnergy = this.energy;
    let fragmentEnergy = totalEnergy/fragments;

    let minRadius = 5, maxRadius = 30;
    let velocitySum = new Vector(0, 0);

    for(let i = 0; i < fragments; i++) {
      // energy = 0.5*mass*speed^2
      // so speed = (2*energy/mass)^1/2
      let newAsteroid = new Asteroid(this.x, this.y);
      let randomRadius = randomValue(minRadius, maxRadius);
      newAsteroid.radius = randomRadius;
      newAsteroid.generateDimensions();
      let speed = Math.pow((2*fragmentEnergy)/newAsteroid.mass, 1/2);
      // last asteroid corrects the velocity direction
      if(i == fragments - 1) {
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
    force.div(this.mass);
    this.acceleration.add(force);
  }

  applyTorque(clockwise, multiplier) {
    if(multiplier == undefined) multiplier = 1;
    if(clockwise) {
      this.angularAcceleration += 0.01 * multiplier;
    }
    else {
      this.angularAcceleration -= 0.01 * multiplier;
    }
  }

  generateDimensions() {
    this.generateDimensionsPolygonConcave();
    // this.generateDimensionsPolygonRegular(6);
  }

  generateDimensionsPolygonRegular(numVertices) {
    let deltaTheta = 2*Math.PI/numVertices;
    this.width = 2 * this.radius; // big box
    this.height = 2 * this.radius;

    let center = new Vector(this.x + this.width/2, this.y + this.height/2);
    let vertices = [];
    for(let i = 0; i < numVertices; i++) {
      let point = new Vector(center.x, center.y - this.radius);
      let rotatedPoint = rotatePoint(point, i * deltaTheta, center);
      vertices.push(rotatedPoint);
    }
    this.shape = new Polygon(vertices);
    this.mass = this.shape.area / MASS_CONSTANT;
    this.kineticEnergy = 0.5*this.mass*Math.pow(this.velocity.magnitude, 2);
  }

  generateDimensionsPolygonConcave() {
    let numVertices = 20; // change to depend on radius
    let deltaTheta = 2*Math.PI/numVertices;

    let noise = new Perlin();
    let noiseStep = 0.2;
    let seed = 256 * Math.random();
    let maxDiff = 0.4*this.radius; // maximum noise value (amplitude if noise was a wave)
    this.width = 2 * (this.radius + maxDiff); // make big box
    this.height = 2 * (this.radius + maxDiff);

    let center = new Vector(this.x + this.width/2, this.y + this.height/2);
    let vertices = [];
    for(let i = 0; i < numVertices; i++) {
      let randomDiff = maxDiff * noise.getValue(seed + (i * noiseStep));
      let point = new Vector(center.x, center.y - this.radius + randomDiff);
      let rotatedPoint = rotatePoint(point, deltaTheta*i, center);
      vertices.push(rotatedPoint);
    }
    this.shape = new Polygon(vertices);
    this.mass = this.shape.area / MASS_CONSTANT;
  }

  get x() {
    return this.coordinates.x;
  }

  get y() {
    return this.coordinates.y;
  }

  get energy() {
    this.kineticEnergy = 0.5*this.mass*Math.pow(this.velocity.magnitude, 2);
    return this.kineticEnergy;
  }

  toString() {
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);
  }
}
