"use strict"

// probe
let probe = new Lander(gameAreaOrigin.x + WIDTH / 2, gameAreaOrigin.y + 0.03 * HEIGHT);
const MASS_CONSTANT = probe.shape.area; // 1 mass unit = the mass of the lander
const GRAVITY = new Vector(0, 0.0015 * MS_PER_FRAME);
const TERMINAL_VELOCITY = 5;
const DRAG_CONSTANT = GRAVITY.y / TERMINAL_VELOCITY;
console.log("Gravity is " + GRAVITY.y/MS_PER_FRAME + " N/ms and "+ GRAVITY.y + " N/frame");

// background
let terrain = new Terrain();
let stars = [];
// Randomly generate stars
const starsPerScreen = 20;
for (let i = 0; i < starsPerScreen * totalScreens; i++) {
  let x = randomValue(0, OFFSCREEN_WIDTH);
  let y = randomValue(0, terrain.highestGround);
  let r = randomValue(0.1, 5);
  stars[i] = new Star(x, y, r);
}

// waves
let trebleWaves = [];
let maxTrebleWaves;
let bassWaves = [];
let maxBassWaves;
let waveScreenCoordinates = new Vector(0, 0);
let waveScreenDimensions = new Vector(WIDTH, 2*HEIGHT);
let waveSpawnPoints = [
  new Vector(waveScreenCoordinates.x - 10, waveScreenCoordinates.y + waveScreenDimensions.y - 50),
  new Vector(waveScreenCoordinates.x, waveScreenCoordinates.y + waveScreenDimensions.y + 20),
  new Vector(waveScreenCoordinates.x + waveScreenDimensions.x / 3, waveScreenCoordinates.y + waveScreenDimensions.y + 10),
  new Vector(waveScreenCoordinates.x + 2 * waveScreenDimensions.x / 3, waveScreenCoordinates.y + waveScreenDimensions.y + 10),
  new Vector(waveScreenCoordinates.x + waveScreenDimensions.x, waveScreenCoordinates.y + waveScreenDimensions.y + 20),
  new Vector(waveScreenCoordinates.x + waveScreenDimensions.x + 10, waveScreenCoordinates.y + waveScreenDimensions.y - 50),
];
let bassWaveSpawnPoint = 0;

// asteroids
let asteroids = [];
let maxAsteroids;
let asteroidScreenCoordinates = new Vector(0, 0);
let asteroidScreenDimensions = new Vector(WIDTH, 2 * HEIGHT);

let bullets = [];
let animations = [];

// scene things
let safeLanding = false;
let safeLandingTimerMax = 1000 / MS_PER_FRAME
let safeLandingTimer = safeLandingTimerMax;
let badLanding = false;
let badLandingTimerMax = 500 / MS_PER_FRAME
let badLandingTimer = badLandingTimerMax;

let loop;
