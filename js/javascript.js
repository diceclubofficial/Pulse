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





//console.log(probe.toString())

//
// for (let i = 0; i < 5; i++) {
// 	probe.applyForce(new Vector(0, -9.8));
// 	probe.update();
// }



// CREATE AND RUN GAME

//var g = new game();

setInterval(play, 33);

function play(){
	// Check array keys for input
	applyKeyboardInput();

	drawBackground();

	probe.applyForce(new Vector(0, 0.1));
	probe.update();
	probe.show();
}

function applyKeyboardInput(){
	if (keys[UP] || keys[W]) {
		probe.applyThrusters();
	}
	if (keys[RIGHT] || keys[D]) {
		probe.applyTorque(true);
	}

	if (keys[LEFT] || keys[A]) {
		probe.applyTorque(false);
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

function map(value, li, hi, lt, ht){
	return (value/(hi-li))*(ht-lt)+lt;
}


canvasGA.addEventListener('click',processMouseInput);
window.addEventListener('keydown', processKeyDownInput);
window.addEventListener('keyup', processKeyUpInput);
