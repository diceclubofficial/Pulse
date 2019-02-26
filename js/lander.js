"use strict"

class Lander {

  constructor(x, y) {
    this.maxHealth = 20;
    this.health = this.maxHealth;

    // image data
    this.landerThrusterSheet = new Image();
    this.landerThrusterSheet.src = "images/landerThrusterSheetRed.png";
    this.landerStaticImage = new Image();
    this.landerStaticImage.src = "images/landerStaticImage.png";
    this.landerDashForwardSheet = new Image();
    this.landerDashForwardSheet.src = "images/landerDashForwardSheetRedExtended.png";
    this.spriteWidth = 42, this.spriteHeight = 50;

    // vector quantities
    this.coordinates = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    this.generateDimensions();

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.thrusterPower = 0.0045 * MS_PER_FRAME;
    this.momentOfInertia = (.5 * this.mass * Math.pow(this.width / 2, 2));
    this.fillStyle = 'rgb(255, 255, 255)';

    // collision detection with ground
    this.OFF_GROUND = 0; // completely off the ground
    this.TOUCHING_GROUND = 1; // at least one vertex is touching the ground
    this.IN_GROUND = 2; // two or more vertices are touching the ground
    this.groundState = this.OFF_GROUND;
    this.impactGround = false; // first frame of touching ground
    this.groundedVertexPositions = [];

    // sprite animation
    this.numImages = 4;
    this.currImage = 0;
    this.thrustersOn = false;
    this.framesPerAnimation = 165 / MS_PER_FRAME; // animation speed
    this.animationTimer = 0;
    this.fuel = 3000;

    // bullet firing
    this.framesPerBullet = 165 / MS_PER_FRAME;
    this.bulletTimer = 0;
    this.bulletSpread = 18; // total range of bullet directions in degrees
    this.recoilForce = 0.7; //1.5
    this.ammo = 1000;

    // dashing
    this.inDashingAnimation = false;
    this.dashingNumImages = 3;
    this.dashTimer = 0;
    this.dashCooldown = 660 / MS_PER_FRAME;
  }

  update() {
    if(this.health < 0) {
      badLanding = true;
    }

    // Cancel all motion if in ground
    if (this.groundState == this.IN_GROUND) {
      this.velocity.mult(0);
      this.acceleration.mult(0);
      this.angularVelocity = 0;
      this.angularAcceleration = 0;
    }

    // Translational motion
    this.velocity.add(this.acceleration);
    this.coordinates.add(this.velocity);
    this.shape.translate(this.velocity);
    this.acceleration.mult(0);

    // Rotational motion
    //this.angularAcceleration += ((-this.angularVelocity*.9)/this.momentOfInertia);
    this.angularAcceleration += (-this.angularVelocity * .05);
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.shape.rotate(this.angularVelocity);
    this.angularAcceleration *= 0;

    // Animation
    this.animate();

    // Timers
    this.bulletTimer--;
    this.dashTimer--;

    // Apply drag force
    let drag = new Vector(Math.cos(this.velocity.angle + (Math.PI / 2)), Math.sin(this.velocity.angle + (Math.PI / 2)));
    drag.magnitude = DRAG_CONSTANT * this.velocity.magnitude;
    this.applyForce(drag);

    // Ground collision detection
    if (this.groundState == this.TOUCHING_GROUND) {
      this.collideWithGround();
    } else {
      this.fillStyle = "rgb(0, 255, 0)";
      this.impactGround = true;
      this.groundedVertexPositions = [];
    }
    // if(this.groundState == this.IN_GROUND && !badLanding) {
    //   console.log("Grounded and safe");
    //   safeLanding = true;
    // }

    // if approaching the edge of the screen, move the screen
    let xDiff = 0.333 * WIDTH;
    let yDiff = 0.4 * HEIGHT;
    if (this.x < gameAreaOrigin.x + xDiff && this.velocity.x < 0 && gameAreaOrigin.x + this.velocity.x > 0) {
      moveCamera(this.velocity.x, 0);
    }
    if (this.x > gameAreaOrigin.x + WIDTH - xDiff && this.velocity.x > 0 && gameAreaOrigin.x + WIDTH + this.velocity.x < OFFSCREEN_WIDTH) {
      moveCamera(this.velocity.x, 0);
    }
    if (this.y < gameAreaOrigin.y + yDiff && this.velocity.y < 0 && gameAreaOrigin.y + this.velocity.y > 0) {
      moveCamera(0, this.velocity.y);
    }
    if (this.y > gameAreaOrigin.y + HEIGHT - yDiff && this.velocity.y > 0 && gameAreaOrigin.y + HEIGHT + this.velocity.y < OFFSCREEN_HEIGHT) {
      moveCamera(0, this.velocity.y);
    }

    // If offscreen, print coordinates
    if (this.x < -this.width || this.x > OFFSCREEN_WIDTH || this.y < -this.height || this.y > OFFSCREEN_HEIGHT) {
      console.log("Lander is offscreen at (" + Math.floor(this.x) + ", " + Math.floor(this.y) + ") with velocity x:" + Math.floor(this.velocity.x) + " y:" + Math.floor(this.velocity.y));
    }
  }

  showDeveloperStats(context) {
    context.save();

    // show shape
    this.shape.draw(context, this.fillStyle, true);

    // show big box
    context.strokeStyle = "pink";
    context.strokeRect(this.x, this.y, this.width, this.height);

    context.restore();
  }

  draw(context) {
    context.save();

    // draw lander image
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.angle);
    if (this.inDashingAnimation) {
      context.drawImage(this.landerDashForwardSheet, this.currImage * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.imageWidth / 2, -this.imageHeight / 2, this.imageWidth, this.imageHeight);
    } else if (this.thrustersOn) {
      context.drawImage(this.landerThrusterSheet, this.currImage * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.imageWidth / 2, -this.imageHeight / 2, this.imageWidth, this.imageHeight);
    } else {
      context.drawImage(this.landerStaticImage, -this.imageWidth / 2, -this.imageHeight / 2, this.imageWidth, this.imageHeight);
    }

    context.restore();
  }

  animate() {
    // Decrease timer
    this.animationTimer--;
    if (this.animationTimer > 0) {
      return;
    }
    this.animationTimer = this.framesPerAnimation;

    // Change sprite:
    // if thrusters are on, cycle through the images
    if (this.inDashingAnimation) {
      this.currImage++;
      if (this.currImage >= this.dashingNumImages) {
        this.inDashingAnimation = false;
        this.currImage = 2;
      }
    } else if (this.thrustersOn) {
      this.currImage++;
      this.currImage %= this.numImages;
    } else {
      this.currImage = 2; // when the thrusters first come on, the flame starts small
    }
  }

  collideWithGround() {
    this.fillStyle = "rgb(255, 0, 0)";
    // On first impact, bounce velocity
    if(this.impactGround) {
      if(this.velocity.magnitude >= DANGEROUS_SPEED && !safeLanding) {
        badLanding = true;
      }
      let velMult = -0.2;
      this.velocity = new Vector(this.velocity.x * velMult, this.velocity.y * velMult);
      if (Math.abs(this.velocity.y) < 1) {
        this.velocity.mult(0);
      }
    } else if (this.velocity.y > 0) {
      this.velocity.mult(0);
    }
    this.impactGround = false;
    // If two or more vertices are touching the ground, the lander is static
    console.log(this.groundedVertexPositions);

    if(this.groundedVertexPositions.includes(0) || this.groundedVertexPositions.includes(1) || this.groundedVertexPositions.includes(4)) {
      console.log("badLanding on vertices");
      badLanding = true;
    }
    if(this.groundedVertexPositions.includes(2) && this.groundedVertexPositions.includes(3)) {
      safeLanding = true;
    }
    if(this.groundedVertexPositions.length >= 2 || this.groundedVertexPositions.includes(0)) {
      this.groundState = this.IN_GROUND;
      return;
    }
    // Apply torque on vertices
    let totalTorque = 0;
    for (let i = 0; i < this.shape.vertices.length; i++) {
      let vertex = this.shape.vertices[i];

      // If the vertex is not grounded, add torque
      if (!this.groundedVertexPositions.includes(i)) {
        let direction = new Vector(vertex.x, vertex.y);
        direction.sub(this.shape.centroid);
        let angle = direction.angle;
        let torque = direction.magnitude * Math.sin(angle);
        totalTorque += torque;
      }
    }
    if (Math.abs(totalTorque) < 1) totalTorque = 0;
    let clockwise = totalTorque > 0 ? true : false;
    let torqueMultiplier = Math.abs(totalTorque) * 0.01;
    this.applyTorque(clockwise, torqueMultiplier);
  }

  generateDimensions() {
    this.imageWidth = 40;
    this.imageHeight = this.imageWidth * (this.spriteHeight / this.spriteWidth); // calculate height based on width and sprite size to not distort the image
    let xs = this.imageWidth * (3 / 42),
      xl = this.imageWidth * (11 / 42); //x-small and x-large
    let ys = this.imageHeight * (15 / 50),
      yl = this.imageHeight * (47 / 50); //y-small and y-large
    let vertices = [
      new Vector(this.imageWidth / 2, 0),
      new Vector(this.imageWidth - xl, ys),
      new Vector(this.imageWidth - xs, yl),
      new Vector(xs, yl),
      new Vector(xl, ys),
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

    this.mass = 1;
  }

  applyForce(force) { // force need be a vector
    let appliedForce = new Vector(force.x, force.y);
    appliedForce.div(this.mass);
    this.acceleration.add(appliedForce);
  }
  applyTorque(clockwise, multiplier = 1) {
    if (clockwise) {
      this.angularAcceleration += (0.000303 * MS_PER_FRAME) * multiplier;
    } else {
      this.angularAcceleration -= (0.000303 * MS_PER_FRAME) * multiplier;
    }
  }
  applyThrusters() {
    if (this.fuel <= 0) {
      this.thrustersOn = false;
      return;
    }

    let thrustForce = new Vector(Math.cos(this.angle - (Math.PI / 2)), Math.sin(this.angle - (Math.PI / 2)));
    thrustForce.mult(this.thrusterPower);

    this.thrustersOn = true;
    this.fuel--;

    this.applyForce(thrustForce);
  }

  fireBullet() {
    // Reset timer
    this.bulletTimer = this.framesPerBullet;

    // Check ammo
    if (this.ammo <= 0) {
      return;
    }

    // Spawn new bullet
    let noseVertex = this.shape.vertices[0];
    let coordinates = new Vector(noseVertex.x, noseVertex.y);
    let angleDiff = toRadians(this.bulletSpread);
    let randomAngle = this.angle + randomValue(-angleDiff / 2, angleDiff / 2);
    let direction = new Vector(Math.cos(randomAngle - (Math.PI / 2)), Math.sin(randomAngle - (Math.PI / 2)));
    let newBullet = new Bullet(coordinates.x, coordinates.y, direction);
    bullets.push(newBullet);
    this.ammo--;

    // Spawn bullet particle animations
    spawnBulletParticles(this.shape.vertices[0].x, this.shape.vertices[0].y, this.angle);


    // Apply recoil
    direction.mult(-this.recoilForce);
    this.applyForce(direction);
  }

  dash(direction) {
    // Reset timer
    this.dashTimer = this.dashCooldown;

    let dashMagnitude = 75;

    // Check fuel
    if (this.fuel <= dashMagnitude) {
      return;
    }

    // Dash forward

    if (direction == "forward") {
      let thrustForce = new Vector(Math.cos(this.angle - (Math.PI / 2)), Math.sin(this.angle - (Math.PI / 2)));
      thrustForce.mult(dashMagnitude * this.thrusterPower);
      this.applyForce(thrustForce);
    } else if (direction == "right") {
      let thrustForce = new Vector(Math.cos(this.angle), Math.sin(this.angle));
      thrustForce.mult(dashMagnitude * this.thrusterPower);
      this.applyForce(thrustForce);
    } else if (direction == "left") {
      let thrustForce = new Vector(Math.cos(this.angle - Math.PI), Math.sin(this.angle - Math.PI));
      thrustForce.mult(dashMagnitude * this.thrusterPower);
      this.applyForce(thrustForce);
    }

    this.fuel -= dashMagnitude;

    this.inDashingAnimation = true;
    this.currImage = 0;
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
