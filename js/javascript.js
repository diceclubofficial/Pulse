// Javascript File 03

contextGA.font = '10px Menlo';



let probe = new Lander(0, 0);
probe.applyForce(new Vector(0, -9.8));
probe.update()
//console.log(probe.toString())

//
// for (let i = 0; i < 5; i++) {
// 	probe.applyForce(new Vector(0, -9.8));
// 	probe.update();
// }



// CREATE AND RUN GAME

//var g = new game();

//setInterval(play, 33);
//
// function play(){
// 	//this.g.update();
// }


// PROCESSING USER INPUT
function processKeyDownInput(event) {
	var key = event.key;
  console.log(key)

}

function processKeyUpInput(event) {
	var key = event.key;
	console.log(key);
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
