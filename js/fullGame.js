"use strict"

function startFullGame() {
  // change scene to game screen
  changeScene("gameArea");

  // Start playing audio
  audioContext.resume();
  audioElement.play();

  // initialize variables
  changeOffscreenDimensions(1, 2);
  let rockiness = 30 + 10*(currentLevel);
  terrain = new Terrain(rockiness);
  gameAreaOrigin = new Vector(0, 0);
  asteroidScreenCoordinates = new Vector(0, 0);
  asteroidScreenDimensions = new Vector(OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  probe = new Lander(gameAreaOrigin.x + WIDTH / 2, gameAreaOrigin.y + 0.03 * HEIGHT);
  trebleWaves = [];
  bassWaves = [];
  asteroids = [];
  bullets = [];
  animations = [];

  maxAsteroids = Math.round(map(currentLevel, 1, 8, 10, 50));
  maxTrebleWaves = Math.round(map(currentLevel, 1, 8, 0, 6));
  maxBassWaves = Math.round(map(currentLevel, 1, 8, 0, 3));
  console.log("Level " + currentLevel + " starting with maxAsteroids:", maxAsteroids, " maxTrebleWaves:", maxTrebleWaves, " maxBassWaves:", maxBassWaves);

  frameCounter = 0;

  // loop play
  clearInterval(loop);
  loop = setInterval(playFullGame, MS_PER_FRAME);
}

function playFullGame() {
  // Check array keys for input
  applyKeyboardInput();

  // Update everything
  frameCounter++;
  updateWaves();
  updateAsteroids();
  updateAnimations();
  updateBullets();
  if (probe.groundState != probe.IN_GROUND) probe.applyForce(GRAVITY);
  probe.update();

  audioAnalysis();

  collisionDetection();

  drawEverything();
  // show developer-intended hitboxes and additional stuff
  if (DEV_MODE) showDeveloperStats();

  // check end states
  if(safeLanding) {
    safeLandingTimer--;
    if(safeLandingTimer <= 0) {
      safeLanding = false;
      safeLandingTimer = safeLandingTimerMax;
      currentLevel++;
      clearInterval(loop);
      changeScene("successScreen");
    }
  }
  if(badLanding) {
    if(badLandingTimer == badLandingTimerMax) {
      spawnExplosion(probe.shape.centroid.x, probe.shape.centroid.y, 0.45);
      probe.groundState = probe.IN_GROUND;
    }
    badLandingTimer--;
    if(badLandingTimer <= 0) {
      badLanding = false;
      badLandingTimer = badLandingTimerMax;
      currentLevel = 1;
      clearInterval(loop);
      changeScene("gameOverScreen");
    }
  }
  if(probeDestroyed) {
    if(probeDestroyedTimer == probeDestroyedTimerMax) {
      spawnExplosion(probe.shape.centroid.x, probe.shape.centroid.y, 0.45);
    }
    probeDestroyedTimer--;
    if(probeDestroyedTimer <= 0) {
      probeDestroyed = false;
      probeDestroyedTimer = probeDestroyedTimerMax;
      clearInterval(loop);
      changeScene("gameOverScreen");
    }
  }

  // draw onto game area
  contextGA.fillStyle = "#555";
  contextGA.fillRect(0, 0, WIDTH, HEIGHT);
  contextGA.drawImage(canvasOffscreen, gameAreaOrigin.x, gameAreaOrigin.y, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}
