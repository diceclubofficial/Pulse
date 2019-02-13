"use strict"

const UP = 38,
      RIGHT = 39,
      DOWN = 40,
      LEFT = 37;
const SPACEBAR = 32;
const W = 87,
      A = 65,
      S = 83,
      D = 68;
const I = 73,
      J = 74,
      K = 75,
      L = 76;
let keys = [];

// start at title screen
changeScene("titleScreen");

// buttons
let menuButtons = document.getElementsByClassName('menuButton');
let playButtonAsteroids = document.getElementById('playButtonAsteroids');
let playButtonWaves = document.getElementById('playButtonWaves');
let titleScreenButton = document.getElementById('titleScreenButton');
let muteButton = document.getElementById('muteButton');
window.onload = function() {
  Object.entries(menuButtons).map((button) => {
    button[1].addEventListener("click", function() {
      changeScene("menuScreen");
    });
  });
  playButtonAsteroids.addEventListener('click', function() {
    startAsteroidGame();
  });
  playButtonWaves.addEventListener('click', function() {
    startWaveGame();
  });
  titleScreenButton.addEventListener('click', function() {
    changeScene("titleScreen");
  });
  muteButton.addEventListener('click', function() {
    audioElement.pause();
  });
}

function changeScene(newScene) {
  for (let scene of sceneNames) {
    //set all elements with class of the scene in argument to remove "hidden" class
    if (scene == newScene) {
      let classList = document.getElementsByClassName("scene-" + scene);
      for (let tempElement of classList) {
        tempElement.classList.remove("hidden");
      }

      //get all elements withOUT class of the scene in argument to add "hidden" class
    } else {
      let classList = document.getElementsByClassName("scene-" + scene);
      for (let tempElement of classList) {
        tempElement.classList.add("hidden");
      }
    }
  }
  console.log("Changed scene to " + newScene);
}

// keyboard input
function applyKeyboardInput() {
  // control probe
  if (keys[W] && probe.groundState == probe.OFF_GROUND) {
    probe.applyThrusters();
  } else {
    probe.thrustersOn = false;
  }
  if (keys[D] && probe.groundState == probe.OFF_GROUND) {
    probe.applyTorque(true);
  }
  if (keys[A] && probe.groundState == probe.OFF_GROUND) {
    probe.applyTorque(false);
  }
  // regenerate terrain
  if (keys[S]) {
    terrain.generate();
  }

  // fire gun
  if (keys[SPACEBAR] && probe.bulletTimer <= 0) {
    probe.fireBullet();
  }

  // dash
  if (keys[UP] && probe.dashTimer <= 0) {
    probe.dash("forward");
  }
  if (keys[RIGHT] && probe.dashTimer <= 0) {
    probe.dash("right");
  }
  if (keys[LEFT] && probe.dashTimer <= 0) {
    probe.dash("left");
  }

  // control camera
  if (DEV_MODE) {
    let screenMovement = 10;
    if (keys[J]) {
      gameAreaOrigin.add(new Vector(-screenMovement, 0));
      console.log("new game origin", gameAreaOrigin.toString());
    }
    if (keys[L]) {
      gameAreaOrigin.add(new Vector(screenMovement, 0));
      console.log("new game origin", gameAreaOrigin.toString());
    }
    if (keys[I]) {
      gameAreaOrigin.add(new Vector(0, -screenMovement));
      console.log("new game origin", gameAreaOrigin.toString());
    }
    if (keys[K]) {
      gameAreaOrigin.add(new Vector(0, screenMovement));
      console.log("new game origin", gameAreaOrigin.toString());
    }
  }
}

// PROCESSING USER INPUT
document.addEventListener('keydown', processKeyDownInput);
function processKeyDownInput(event) {
  if (event.key == 'z') {
    console.log(keys);
  }
  keys[event.keyCode] = true;
}
document.addEventListener('keyup', processKeyUpInput);
function processKeyUpInput(event) {
  keys[event.keyCode] = false;
}
canvasGA.addEventListener('click', processMouseInput);
function processMouseInput(event) {
  var relX = (event.clientX - canvasGA.offsetLeft);
  var relY = (event.clientY - canvasGA.offsetTop);
  console.log(relX + ", " + relY);
}
