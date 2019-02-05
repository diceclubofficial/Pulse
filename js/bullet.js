"use strict"

class Bullet {

  constructor(x, y, direction) {
    // vector quantities
    this.coordinates = new Vector(x, y);
    this.speed = 30;
    this.velocity = new Vector(direction.x, direction.y);
    this.velocity.magnitude = this.speed;
    this.acceleration = new Vector(0, 0);

    // dimensions
    this.density = 13;
    this.generateDimensions();

    // rotate shape
    this.angle = this.velocity.angle;
    this.shape.rotate(this.angle);

    this.fillStyle = 'rgb(255, 255, 255)';

    this.alive = true;
  }

  update() {
    // Translational motion
    this.velocity.add(this.acceleration);
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);
    this.acceleration.mult(0);

    // If offscreen, alive is false
    if (this.shape.centroid.x + this.boxRadius < gameAreaOrigin.x || this.shape.centroid.x - this.boxRadius > gameAreaOrigin.x + WIDTH || this.shape.centroid.y + this.boxRadius < gameAreaOrigin.y || this.shape.centroid.y - this.boxRadius > gameAreaOrigin.y + HEIGHT) {
      this.alive = false;
    }
  }

  showDeveloperStats(context) {
    // show shape with points
    this.shape.draw(context, this.fillStyle, true);

    // show big box
    context.strokeStyle = "pink";
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  draw(context) {
    // draw shape without points
    this.shape.draw(context, this.fillStyle, false);
  }

  generateDimensions() {
    this.imageWidth = 2;
    this.imageHeight = 13;
    let vertices = [
      new Vector(0, 0),
      new Vector(this.imageWidth, 0),
      new Vector(this.imageWidth, this.imageHeight),
      new Vector(0, this.imageHeight)
    ];
    this.shape = new Polygon(vertices);

    // find maxDistance (kinda like radius)
    let maxDistance = 0;
    for (let vertex of this.shape.vertices) {
      let thisDistance = distance(vertex.x, vertex.y, this.shape.x, this.shape.y);
      if (thisDistance > maxDistance) {
        maxDistance = thisDistance;
      }
    }
    this.width = this.height = 2 * maxDistance;

    let translateVector = new Vector(this.x + this.width / 2 - this.imageWidth / 2, this.y + this.height / 2 - this.imageHeight / 2);
    this.shape.translate(translateVector);

    this.mass = this.density * (this.shape.area / MASS_CONSTANT);
  }

  collisionDetection() {
    this.collisionDetectionWithAsteroid();
  }

  collisionDetectionWithAsteroid() {
    asteroidLoop: for (let asteroid of asteroids) {
      // big box collision detection
      if (!rectanglesCollide(this, asteroid)) {
        continue asteroidLoop;
      }

      // more complex and slower polygon collision detection
      let overlaps = this.shape.overlapsPolygon(asteroid.shape, true);
      if (overlaps == false) {
        continue asteroidLoop;
      }

      // collision occurs

      this.alive = false;
      asteroid.collideAgainst(this);
      spawnExplosion(this.x, this.y);
    }
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

  toString() {
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);
  }
}
