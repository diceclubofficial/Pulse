"use strict"

// probe
let probe = new Lander(gameAreaOrigin.x + WIDTH / 2, gameAreaOrigin.y + 0.03 * HEIGHT);
const MASS_CONSTANT = probe.shape.area; // 1 mass unit = the mass of the lander
const GRAVITY = new Vector(0, 0.0015 * MS_PER_FRAME);
const TERMINAL_VELOCITY = 5;
const DRAG_CONSTANT = GRAVITY.y / TERMINAL_VELOCITY;
console.log("Gravity is " + GRAVITY.y/MS_PER_FRAME + " N/ms and "+ GRAVITY.y + " N/frame");
const DANGEROUS_SPEED = 1.4;

// background
let terrain = new Terrain();
const starBackgroundImage0 = new Image();
starBackgroundImage0.src = "images/starBackground3.png";
const starBackgroundImage1 = new Image();
starBackgroundImage1.src = "images/starBackground1.png";
const starBackgroundImage2 = new Image();
starBackgroundImage2.src = "images/starBackground2.png";
let backgroundPos1 = new Vector(0, 0);
let backgroundPos2 = new Vector(0, 0);

//Lore
let currentScene = "titleScreen";

//Speedometer
let speedBar = new Image();
speedBar.src = "images/healthBarGradient.png";
//1080 x 1920
let speedBarWidth = 1080;
let speedBarHeight = 1920;

// waves
let trebleWaves = [];
let maxTrebleWaves;
let bassWaves = [];
let maxBassWaves;
let waveScreenCoordinates = new Vector(0, 0);
let waveScreenDimensions = new Vector(WIDTH, 2 * HEIGHT);
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
let badLandingTimerMax = 300 / MS_PER_FRAME
let badLandingTimer = badLandingTimerMax;
let probeDestroyed = false;
let probeDestroyedTimerMax = 300 / MS_PER_FRAME;
let probeDestroyedTimer = probeDestroyedTimerMax;

let frameCounter = 0;
let loop;
