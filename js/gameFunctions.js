// drawing things
function drawEverything() {
  drawBackground(contextOffscreen, false);

  // asteroids
  for (let asteroid of asteroids) {
    asteroid.draw(contextOffscreen);
  }

  // waves
  for (let trebleWave of trebleWaves) {
    trebleWave.draw(contextOffscreen);
  }
  for (let bassWave of bassWaves) {
    bassWave.draw(contextOffscreen);
  }

  // bullets
  for (let bullet of bullets) {
    bullet.draw(contextOffscreen);
  }

  // terrain
  terrain.draw(contextOffscreen);

  // lander
  probe.draw(contextOffscreen);

  // animations
  for (let animation of animations) {
    animation.draw(contextOffscreen);
  }


  drawForeground(contextOffscreen);
}
function drawEverythingAsteroids() {
  drawBackground(contextOffscreen, false);

  // asteroids
  for (let asteroid of asteroids) {
    asteroid.draw(contextOffscreen);
  }

  // bullets
  for (let bullet of bullets) {
    bullet.draw(contextOffscreen);
  }

  // lander
  probe.draw(contextOffscreen);

  // animations
  for (let animation of animations) {
    animation.draw(contextOffscreen);
  }

  drawForeground(contextOffscreen);
}
function drawEverythingWaves() {
  drawBackground(contextOffscreen, true);

  // waves
  for (let trebleWave of trebleWaves) {
    trebleWave.draw(contextOffscreen);
  }
  for (let bassWave of bassWaves) {
    bassWave.draw(contextOffscreen);
  }

  // bullets
  for (let bullet of bullets) {
    bullet.draw(contextOffscreen);
  }

  // terrain
  terrain.draw(contextOffscreen);

  // lander
  probe.draw(contextOffscreen);

  // animations
  for (let animation of animations) {
    animation.draw(contextOffscreen);
  }

  drawForeground(contextOffscreen);
}
function showDeveloperStats() {
  // coordinate markers
  let context = contextOffscreen;
  context.fillStyle = "Tomato";
  context.font = "15px Courier";
  context.textAlign = "center";
  for (let x = 0; x < OFFSCREEN_WIDTH; x += 1) {
    // show coordinate text
    if (x % 200 == 0) {
      context.fillText(x, x, gameAreaOrigin.y + HEIGHT / 2);
    }
    // draw vertical bar every WIDTH
    if (x % WIDTH == 0) {
      let barWidth = 2,
        barHeight = 100;
      context.fillText(x / WIDTH, x, gameAreaOrigin.y + HEIGHT / 2 - barHeight / 2 - 10);
      context.fillRect(x, gameAreaOrigin.y + HEIGHT / 2 - barHeight / 2, barWidth, barHeight);
    }
  }
  for (let y = 0; y < OFFSCREEN_HEIGHT; y += 1) {
    // show coordinate text
    if (y % 200 == 0) {
      context.fillText(y, gameAreaOrigin.x + WIDTH / 2, y);
    }
    // draw vertical bar every HEIGHT
    if (y % HEIGHT == 0) {
      let barWidth = 100,
        barHeight = 2;
      context.fillText(y / HEIGHT, gameAreaOrigin.x + WIDTH / 2 - barWidth / 2 - 10, y);
      context.fillRect(gameAreaOrigin.x + WIDTH / 2 - barWidth / 2, y, barWidth, barHeight);
    }
  }

  for (let trebleWave of trebleWaves) {
    trebleWave.showDeveloperStats(contextOffscreen);
  }
  for (let bassWave of bassWaves) {
    bassWave.showDeveloperStats(contextOffscreen);
  }
  for (let asteroid of asteroids) {
    asteroid.showDeveloperStats(contextOffscreen);
  }
  for (let bullet of bullets) {
    bullet.showDeveloperStats(contextOffscreen);
  }
  terrain.showDeveloperStats(contextOffscreen);
  probe.showDeveloperStats(contextOffscreen);
}
function drawBackground(context, drawGradient = false) {
  context.save();

  // black background most everywhere
  context.fillStyle = "#000";
  if(drawGradient) context.fillRect(0, 0, OFFSCREEN_WIDTH, bottomScreenY);
  else context.fillRect(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // atmosphere background near terrain
  if(drawGradient) {
    const backgroundGradient = context.createLinearGradient(0, bottomScreenY, 0, OFFSCREEN_HEIGHT);
    backgroundGradient.addColorStop(0, "#000");
    backgroundGradient.addColorStop(0.7, "#171e26");
    // backgroundGradient.addColorStop(0.7, "#3f586b");
    backgroundGradient.addColorStop(1, "#000");
    context.fillStyle = backgroundGradient;
    context.fillRect(0, bottomScreenY, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  }

  // draw background images
  context.globalAlpha = 0.4;
  context.drawImage(starBackgroundImage0, 0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  context.globalAlpha = 0.2;
  context.drawImage(starBackgroundImage1, backgroundPos1.x, backgroundPos1.y, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  context.globalAlpha = 0.1;
  context.drawImage(starBackgroundImage2, backgroundPos2.x, backgroundPos2.y, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  context.globalAlpha = 1;

  context.restore();
}
function drawForeground(context) {
  context.save();

  let padding = 30;
  let fontSize = 20;
  context.font = fontSize + "px Courier New";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = "white";
  let xDiff = 30;
  let yDiff = 30;
  context.fillText("Fuel: " + probe.fuel, gameAreaOrigin.x + xDiff, gameAreaOrigin.y + yDiff);
  context.fillText("Ammo: " + probe.ammo, gameAreaOrigin.x + xDiff, gameAreaOrigin.y + yDiff + padding);
  // health
  context.fillStyle = "lightgreen";
  if(probe.health <= 0.5*probe.maxHealth) context.fillStyle = "orange";
  if(probe.health <= 0.25*probe.maxHealth) context.fillStyle = "red";
  context.fillText("Health: " + Math.round(probe.health), gameAreaOrigin.x + xDiff, gameAreaOrigin.y + yDiff + 2*padding);
  // speed
  if(probe.velocity.magnitude >= DANGEROUS_SPEED) context.fillStyle = "red";
  else context.fillStyle = "white";
  context.fillText("Speed: " + probe.velocity.magnitude.toFixed(2), gameAreaOrigin.x + xDiff, gameAreaOrigin.y + yDiff + 3*padding);

  context.restore();
}

// asteroids
function spawnAsteroidOffscreen() {
  let offsetX = 0.3125 * WIDTH;
  let offsetY = 0.3125 * HEIGHT;
  let randomSpawnPoint = randomInt(0, 4);
  let spawnPoint;
  switch (randomSpawnPoint) {
    case 0: // left
      spawnPoint = new Vector(asteroidScreenCoordinates.x - offsetX, asteroidScreenCoordinates.y + randomValue(0, asteroidScreenDimensions.y));
      break;
    case 1: // right
      spawnPoint = new Vector(asteroidScreenCoordinates.x + asteroidScreenDimensions.x + offsetX, asteroidScreenCoordinates.y + randomValue(0, asteroidScreenDimensions.y));
      break;
    case 2: // top
      spawnPoint = new Vector(asteroidScreenCoordinates.x + randomValue(0, asteroidScreenDimensions.x), asteroidScreenCoordinates.y - offsetY);
      break;
    case 3: // bottom
      spawnPoint = new Vector(asteroidScreenCoordinates.x + randomValue(0, asteroidScreenDimensions.x), asteroidScreenCoordinates.y + asteroidScreenDimensions.y + offsetY);
      break;
  }
  // console.log("asteroid spawn point", spawnPoint.toString(), randomSpawnPoint);
  let newAsteroid = new Asteroid(spawnPoint.x, spawnPoint.y, asteroidScreenCoordinates, asteroidScreenDimensions);
  asteroids.push(newAsteroid);
}
function updateAsteroids() {
  // Spawn asteroids
  if (asteroids.length < maxAsteroids) {
    spawnAsteroidOffscreen();
  }

  // Despawn asteroids
  let aliveAsteroids = [];
  for (let asteroid of asteroids) {
    if (asteroid.alive) {
      aliveAsteroids.push(asteroid);
    }
  }
  asteroids = aliveAsteroids;

  // Call update()
  for (let asteroid of asteroids) {
    asteroid.update();
  }
}
// waves
function spawnTrebleWave() {
  if(trebleWaves.length < maxTrebleWaves) {
    let randomIndex = randomInt(0, waveSpawnPoints.length);
    let spawnPoint = waveSpawnPoints[randomIndex];
    let color = randomInt(1, 4);
    trebleWaves.push(new TrebleWave(spawnPoint.x, spawnPoint.y, color, waveScreenCoordinates, waveScreenDimensions));
  }
}
function spawnBassWave() {
  if(bassWaves.length < maxBassWaves) {
    let spawnPoint = waveSpawnPoints[bassWaveSpawnPoint];
    bassWaveSpawnPoint++;
    bassWaveSpawnPoint %= waveSpawnPoints.length;
    bassWaves.push(new BassWave(spawnPoint.x, spawnPoint.y, waveScreenCoordinates, waveScreenDimensions));
  }
}
function updateWaves() {
  // spawn waves
  if(trebleWaves.length < maxTrebleWaves) {
    spawnTrebleWave();
  }
  if(bassWaves.length < maxBassWaves) {
    spawnBassWave();
  }

  // despawn waves
  let aliveTrebleWaves = [];
  for (let trebleWave of trebleWaves) {
    if (trebleWave.alive) {
      aliveTrebleWaves.push(trebleWave);
    }
  }
  trebleWaves = aliveTrebleWaves;
  let aliveBassWaves = [];
  for (let bassWave of bassWaves) {
    if (bassWave.alive) {
      aliveBassWaves.push(bassWave);
    }
  }
  bassWaves = aliveBassWaves;

  // call update()
  for (let trebleWave of trebleWaves) {
    trebleWave.update();
  }
  for (let bassWave of bassWaves) {
    bassWave.update();
  }
}
// other stuff
function updateBullets() {
  // Update bullets
  for (let bullet of bullets) {
    bullet.update();
  }

  // Despawn bullets
  let aliveBullets = [];
  for (let bullet of bullets) {
    if (bullet.alive) {
      aliveBullets.push(bullet);
    }
  }
  bullets = aliveBullets;
}
function updateAnimations() {

  let aliveAnimations = [];
  for (let animation of animations) {
    animation.update();

    if (animation.alive) {
      aliveAnimations.push(animation);
    }
  }

  animations = aliveAnimations;
}

// collision detection
function collisionDetection() {
  terrain.collisionDetection();

  for (let asteroid of asteroids) {
    asteroid.collisionDetection();
  }

  for (let bassWave of bassWaves) {
    bassWave.collisionDetection();
  }

  for (let trebleWave of trebleWaves) {
    trebleWave.collisionDetection();
  }

  for (let bullet of bullets) {
    bullet.collisionDetection();
  }
}
function collisionDetectionAsteroids() {
  for (let asteroid of asteroids) {
    asteroid.collisionDetection();
  }

  for (let bullet of bullets) {
    bullet.collisionDetection();
  }
}
function collisionDetectionWaves() {
  terrain.collisionDetection();

  for (let bassWave of bassWaves) {
    bassWave.collisionDetection();
  }

  for (let trebleWave of trebleWaves) {
    trebleWave.collisionDetection();
  }

  for (let bullet of bullets) {
    bullet.collisionDetection();
  }
}

// animations
function spawnBulletParticles(x, y, angle) {
  let position = new Vector(x, y);

  let information = {
    src: "images/shootingAnimationTest4.png",
    sheetWidth: 128,
    sheetHeight: 256,
    spriteWidth: 128,
    spriteHeight: 128,
    numSprites: 2,
  }

  let framesPerSprite = 99 / MS_PER_FRAME;
  let scale = 0.75;
  let rotationAngle = angle;
  let repeat = false;

  let animation = new Animation("bulletParticles", position, information, framesPerSprite, scale, rotationAngle, repeat);

  animations.push(animation);
}
function spawnExplosion(x, y, scale = 0.2) {
  let position = new Vector(x, y);

  let information = {
    src: "images/explosions.png",
    sheetWidth: 1600,
    sheetHeight: 2400,
    spriteWidth: 800,
    spriteHeight: 800,
    numSprites: 5
  }

  let framesPerSprite = 66 / MS_PER_FRAME;
  let rotationAngle = randomValue(0, 2 * Math.PI);
  let repeat = false;

  let animation = new Animation("explosion", position, information, framesPerSprite, scale, rotationAngle, repeat);

  animations.push(animation);
}
function spawnAsteroidCollisionDust(x, y, scale = 1) {
  let position = new Vector(x, y);

  let information = {
    src: "images/asteroidCollisionDust.png",
    sheetWidth: 256,
    sheetHeight: 256,
    spriteWidth: 128,
    spriteHeight: 128,
    numSprites: 4
  }

  let framesPerSprite = 33 / MS_PER_FRAME;
  let rotationAngle = randomValue(0, 2 * Math.PI);
  let repeat = false;

  let animation = new Animation("dust", position, information, framesPerSprite, scale, rotationAngle, repeat);

  animations.push(animation);
}

// move camera
function moveCamera(x, y) {
  gameAreaOrigin.add(new Vector(x, y));

  let parallaxScalar1 = 0.5;
  let parallaxScalar2 = 0.3;
  backgroundPos1.add(new Vector(parallaxScalar1*x, parallaxScalar1*y));
  backgroundPos2.add(new Vector(parallaxScalar2*x, parallaxScalar2*y));
}
