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

setInterval(play, 33);

function play() {
	// Check array keys for input
	applyKeyboardInput();

	// Do collision detection
	collisionDetection();

	// Update all the waves
	updateWaves();

	// Update the lander
	if(!probe.inGround) probe.applyForce(new Vector(0, 0.05));
	probe.update();

	// Draw everything
	displayEverything();
}

function displayEverything() {
	drawBackground();

	// waves
	for(let trebleWave of trebleWaves) {
		trebleWave.draw();
	}
	for(let bassWave of bassWaves) {
		bassWave.draw();
	}

	// terrain
	terrain.draw();

	// lander
	probe.draw();

	// show developer-intended hitboxes and additional stuff (comment out this line)
	// showDeveloperMode();
}

function showDeveloperMode() {
	for(let trebleWave of trebleWaves) {
		trebleWave.showDev();
	}
	for(let bassWave of bassWaves) {
		bassWave.showDev();
	}
	probe.showDev();
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
	// lander with terrain
	terrain.collisionDetection();

	// lander with bassWaves
	for(let bassWave of bassWaves) {
		bassWave.collisionDetection();
	}
	// lander with trebleWaves
	for(let trebleWave of trebleWaves) {
		trebleWave.collisionDetection();
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
window.addEventListener('keydown', processKeyDownInput);
window.addEventListener('keyup', processKeyUpInput);
