"use strict"

let starBackground = new Image();
starBackground.src = "images/lore2Close.png";
let currentLevel = 20;

function startLevelSelect() {
  changeScene("levelSelect");

  clearInterval(loop);
  loop = setInterval(playLevelSelect, MS_PER_FRAME)
}

function playLevelSelect() {
  applyKeyboardInput();

  // Background
  levelSelectContext.fillStyle = "black";
  levelSelectContext.fillRect(0, 0, WIDTH, HEIGHT);
  levelSelectContext.drawImage(starBackground, 0, 0, WIDTH, HEIGHT);

  // Level Select
  let fontSize = 30;
  levelSelectContext.font = fontSize + "px Courier New";
  levelSelectContext.textAlign = "center";
  levelSelectContext.textBaseline = "top";
  levelSelectContext.fillStyle = "white";
  levelSelectContext.fillText("Level " + currentLevel, levelSelectCanvas.width/2, 30);
}
