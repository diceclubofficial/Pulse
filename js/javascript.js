// Javascript File 03
"use strict"
contextGA.font = '10px Menlo';

const UP = 38,
			RIGHT = 39,
			DOWN = 40,
			LEFT = 37;

const W = 87,
			A = 65,
			S = 83,
			D = 68;

let keys = [];

let probe = new Lander(canvasGA.width/2, 20);
const MASS_CONSTANT = probe.shape.area; // 1 mass unit = the mass of the lander
const GRAVITY = new Vector(0, 0.05);

let terrain = new Terrain();
let stars = [];
// Randomly generate 15 stars
for(let i = 0; i < 15; i++) {
	let x = randomValue(0, canvasGA.width);
	let y = randomValue(0, terrain.seaLevel - canvasGA.height/5);
	let r = randomValue(1, 3);
	stars[i] = new Star(x, y, r);
}

// Spawn points for waves (offscreen bottom)
const w = canvasGA.width;
const h = canvasGA.height;
let waveSpawnPoints = [
	new Vector(-10, h - 50),
	new Vector(0, h + 20),
	new Vector(w/3, h + 10),
	new Vector(2*w/3, h + 10),
	new Vector(w, h + 20),
	new Vector(w + 10, h - 50),
];
let bassWaveSpawnPoint = 0;
let trebleWaves = [];
let bassWaves = [];

let asteroids = [];
const maxAsteroids = 8;
let offsetX = 250;
let offsetY = 250;
let asteroidSpawnPoints = [
	new Vector(-offsetX, randomValue(0, canvasGA.height)),
	new Vector(canvasGA.width + offsetX, randomValue(0, canvasGA.height)),
	new Vector(randomValue(0, terrain.seaLevel - offsetY), -offsetY),
];

let fps = 30;
setInterval(play, 1000/fps);

function play() {
	// Check array keys for input
	applyKeyboardInput();

	// Update everything
	updateWaves();
	updateAsteroids();
	if(!probe.inGround) probe.applyForce(GRAVITY);
	probe.update();

	collisionDetection();

	drawEverything();
	// show developer-intended hitboxes and additional stuff (comment out this line)
	showDeveloperMode();
}

function drawEverything() {
	drawBackground();

	// waves
	for(let trebleWave of trebleWaves) {
		trebleWave.draw();
	}
	for(let bassWave of bassWaves) {
		bassWave.draw();
	}

	// asteroids
	for(let asteroid of asteroids) {
		asteroid.draw();
	}

	// terrain
	terrain.draw();

	// lander
	probe.draw();
}

function showDeveloperMode() {
	for(let trebleWave of trebleWaves) {
		trebleWave.showDev();
	}
	for(let bassWave of bassWaves) {
		bassWave.showDev();
	}
	for(let asteroid of asteroids) {
		asteroid.showDev();
	}
	terrain.showDev();
	probe.showDev();
}

function spawnAsteroidOffscreen() {
	let randomIndex = randomInt(0, asteroidSpawnPoints.length);
	let spawnPoint = asteroidSpawnPoints[randomIndex];
	let newAsteroid = new Asteroid(spawnPoint.x, spawnPoint.y);
	asteroids.push(new Asteroid(spawnPoint.x, spawnPoint.y));
}

function updateAsteroids() {
	// Spawn asteroids
	if(asteroids.length < maxAsteroids) {
		spawnAsteroidOffscreen();
	}

	// Despawn asteroids
	let aliveAsteroids = [];
	for(let asteroid of asteroids) {
		if(asteroid.alive) {
			aliveAsteroids.push(asteroid);
		}
	}
	asteroids = aliveAsteroids;

	// Call update()
	for(let asteroid of asteroids) {
		asteroid.update();
	}
}

function updateWaves() {
	// spawn waves
	if(trebleWaves.length < 3) {
		let randomIndex = randomInt(0, waveSpawnPoints.length);
		let spawnPoint = waveSpawnPoints[randomIndex];
		let color = randomInt(1, 4);
		trebleWaves.push(new TrebleWave(spawnPoint.x, spawnPoint.y, color));
	}
	if(bassWaves.length < 1) {
		let spawnPoint = waveSpawnPoints[bassWaveSpawnPoint];
		bassWaveSpawnPoint++;
		bassWaveSpawnPoint %= waveSpawnPoints.length;
		bassWaves.push(new BassWave(spawnPoint.x, spawnPoint.y));
	}

	// despawn waves
	let aliveTrebleWaves = [];
	for(let trebleWave of trebleWaves) {
		if(trebleWave.alive) {
			aliveTrebleWaves.push(trebleWave);
		}
	}
	trebleWaves = aliveTrebleWaves;
	let aliveBassWaves = [];
	for(let bassWave of bassWaves) {
		if(bassWave.alive) {
			aliveBassWaves.push(bassWave);
		}
	}
	bassWaves = aliveBassWaves;

	// call update()
	for(let trebleWave of trebleWaves) {
		trebleWave.update();
	}
	for(let bassWave of bassWaves) {
		bassWave.update();
	}
}

function collisionDetection() {
	terrain.collisionDetection();

	for(let bassWave of bassWaves) {
		bassWave.collisionDetection();
	}

	for(let trebleWave of trebleWaves) {
		trebleWave.collisionDetection();
	}

	for(let asteroid of asteroids) {
		asteroid.collisionDetection();
	}
}

function applyKeyboardInput() {
	if ((keys[UP] || keys[W]) && !probe.inGround) {
		probe.applyThrusters();
	}
	else {
		probe.thrustersOn = false;
	}
	if ((keys[RIGHT] || keys[D]) && !probe.inGround) {
		probe.applyTorque(true);
	}

	if ((keys[LEFT] || keys[A]) && !probe.inGround) {
		probe.applyTorque(false);
	}

	if (keys[DOWN] || keys[S]) {
		terrain.regenerate();
	}
}

function drawBackground(){
	// background gradient
	const backgroundGradient = contextGA.createLinearGradient(0, 0, 0, canvasGA.height);
	backgroundGradient.addColorStop(0, "black");
	backgroundGradient.addColorStop(1, "#171e26");
	// backgroundGradient.addColorStop(1, "#3f586b");
	contextGA.fillStyle = backgroundGradient;
	contextGA.fillRect(0, 0, canvasGA.width, canvasGA.height);

	// stars
	for(let star of stars) {
		star.show(contextGA);
	}
}

// PROCESSING USER INPUT
function processKeyDownInput(event) {
	if(event.key == ' '){
		console.log(keys);
	}
	keys[event.keyCode] = true;
}

function processKeyUpInput(event) {
	//var key = event.key;
	keys[event.keyCode] = false;
}

function processMouseInput(event) {
	var relX = (event.clientX - canvasGA.offsetLeft);
	var relY = (event.clientY - canvasGA.offsetTop);
	console.log(relX + ", " + relY);
}

canvasGA.addEventListener('click',processMouseInput);
document.addEventListener('keydown', processKeyDownInput);
document.addEventListener('keyup', processKeyUpInput);
