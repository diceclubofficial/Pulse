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
let probe = new Lander(canvasGA.width/2, 50);
let terrain = new Terrain();

let w = canvasGA.width;
let h = canvasGA.height;
let spawnPoints = [
	new Vector(-100, h - 100),
	new Vector(0, h + 100),
	new Vector(w/3, h + 100),
	new Vector(2*w/3, h + 100),
	new Vector(w, h + 100),
	new Vector(w + 100, h - 100),
];
let waves = [];
// CREATE AND RUN GAME

//var g = new game();

setInterval(play, 33);

function play(){
	// Check array keys for input
	applyKeyboardInput();
	collisionDetection();

	updateWaves();
	probe.applyForce(new Vector(0, 0.05));
	probe.update();

	// Draw
	displayEverything();
}

function displayEverything() {
	drawBackground();

	for(let wave of waves) {
		wave.showShape();
		wave.showSprite();
	}
	terrain.show();

	probe.showShape();
	probe.showSprite();
}

function updateWaves() {
	// spawn waves
	if(waves.length < 5) {
		let randomIndex = randomInt(0, spawnPoints.length);
		let spawnPoint = spawnPoints[randomIndex];

		let centerOfScreen = new Vector(canvasGA.width/2, canvasGA.height/2);
		let direction = new Vector(centerOfScreen.x, centerOfScreen.y);
		direction.sub(spawnPoint);
		let magnitude = randomInt(3, 7);
		let vel = new Vector(direction.x, direction.y);
		vel.magnitude = magnitude;

		waves.push(new WaveRect(spawnPoint.x, spawnPoint.y, vel));
		console.log("New wave spawned at " + spawnPoint + " with velocity " + vel);
	}
	// despawn waves
	let temp = [];
	for(let wave of waves) {
		if(wave.alive) {
			temp.push(wave);
		}
	}
	waves = temp;
	// update all waves
	for(let wave of waves) {
		wave.update();
	}
}

function applyKeyboardInput() {
	if (keys[UP] || keys[W]) {
		probe.applyThrusters();
	}
	else {
		probe.thrustersOn = false;
	}
	if (keys[RIGHT] || keys[D]) {
		probe.applyTorque(true);
	}

	if (keys[LEFT] || keys[A]) {
		probe.applyTorque(false);
	}

	if (keys[DOWN] || keys[S]) {
		terrain.regenerate();
	}
}

function collisionDetection(){
	// lander with terrain
	if (terrain.isPointBelowSurface(probe.x, probe.y) || terrain.isPointBelowSurface(probe.x + probe.width, probe.y) || terrain.isPointBelowSurface(probe.x + probe.width, probe.y + probe.height) || terrain.isPointBelowSurface(probe.x, probe.y + probe.height)) {
		probe.fillStyle = "rgb(255, 0, 0)";
	} else {
		probe.fillStyle = "rgb(0, 255, 0)";
	}

	// waves with lander
	for(let wave of waves) {
		// simple and fast big box collision detection
		if(probe.x + probe.width > wave.x && probe.x < wave.x + wave.width && probe.y + probe.height > wave.y - wave.width/2 + wave.height/2 && probe.y < wave.y + wave.width) {
			// if it passes, do more complex and slower polygon collision detection
			if(wave.shape.overlaps(probe.shape) && wave.alive) {
				let force = new Vector(wave.velocity.x, wave.velocity.y);
				force.mult(0.03);
				probe.applyForce(force);
				wave.dying = true;
			}
		}
	}
}

function drawBackground(){
	contextGA.fillStyle = "rgb(0, 0, 0)";
	contextGA.fillRect(0, 0 , canvasGA.width,canvasGA.height);
}

// PROCESSING USER INPUT
function processKeyDownInput(event) {
	// var key = event.key;
	// if (key == 'ArrowUp' || key == 'w') {
	// 	probe.applyThrusters();
	// } else if (key == 'ArrowLeft' || key == 'a') {
	// 	probe.applyTorque(false);
	// } else if (key == 'ArrowRight' || key == 'd') {
	// 	probe.applyTorque(true);
	// }
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
