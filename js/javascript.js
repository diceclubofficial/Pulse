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
let titleScreenButtons = document.getElementsByClassName('titleScreenButton');
let levelSelectButtons = document.getElementsByClassName('levelSelectButton');
let playButtonFull = document.getElementById('playButtonFull');
let playButtonAsteroids = document.getElementById('playButtonAsteroids');
let playButtonWaves = document.getElementById('playButtonWaves');
let muteButton = document.getElementById('muteButton');
let nextLevelButton = document.getElementById('nextLevelButton');
window.onload = function() {
  Object.entries(menuButtons).map((button) => {
    button[1].addEventListener("click", function() {
      changeScene("menuScreen");
    });
  });
  Object.entries(titleScreenButtons).map((button) => {
    button[1].addEventListener("click", function() {
      changeScene("titleScreen");
    });
  });
  Object.entries(levelSelectButtons).map((button) => {
    button[1].addEventListener("click", function() {
      startLevelSelect();
    });
  });
  playButtonFull.addEventListener('click', function() {
    startFullGame();
  });
  muteButton.addEventListener('click', function() {
    audioElement.pause();
  });
  lore1Button.addEventListener('click', function() {
    startLore1();
  });
  nextLevelButton.addEventListener('click', function() {
    startFullGame();
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
  currentScene = newScene;
}

// keyboard input
function applyKeyboardInput() {

  // lore
  if(currentScene.includes("lore") && keys[SPACEBAR] && !loreKeyPressed){
    //make sure this code only runs once
    loreKeyPressed = true;
    let currentLoreNum = parseInt(currentScene.substring(4, 5));
    let newScene = 0;

    //if you are on the last lore page, redirect to menuScreen
    if(currentLoreNum == 3){
      newScene = "menuScreen";
    } else {
      newScene = currentLoreNum + 1;
    }

    if(newScene == 2){
      clearInterval(loop);
      startLore2();
    } else if(newScene == 3){
      clearInterval(loop);
      startLore3();
    } else {
      clearInterval(loop);
      changeScene(newScene);
    }


  } else if(currentScene.includes("lore") && keys[SPACEBAR] == false){
    loreKeyPressed = false;
  }

  // // level select screen
  // if(currentScene.equals("levelSelect") && keys[SPACEBAR]) {
  //
  // }


  // control probe
  if (keys[W] && probe.groundState == probe.OFF_GROUND && probe.health > 0) {
    probe.applyThrusters();
  } else {
    probe.thrustersOn = false;
  }
  if (keys[D] && probe.groundState == probe.OFF_GROUND && probe.health > 0) {
    probe.applyTorque(true);
  }
  if (keys[A] && probe.groundState == probe.OFF_GROUND && probe.health > 0) {
    probe.applyTorque(false);
  }
  // regenerate terrain
  if (keys[S]) {
    terrain.generate();
  }

  // fire gun
  if (currentScene == "gameArea" && keys[UP] && probe.bulletTimer <= 0 && probe.health > 0) {
    probe.fireBullet();
  }

  // dash
  if (keys[SPACEBAR] && probe.dashTimer <= 0 && probe.health > 0) {
    probe.dash("forward");
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
document.addEventListener('click', processMouseInput);
function processMouseInput(event) {
  var relX = (event.clientX - canvasGA.offsetLeft);
  var relY = (event.clientY - canvasGA.offsetTop);
  // console.log(relX + ", " + relY);
}
