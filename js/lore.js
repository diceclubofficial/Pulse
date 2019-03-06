"use strict"

//boolean to tell if the spacebar has been pressed, so it only fires once per press
let loreKeyPressed = false;

//generic lander animation information which I use in all lore scenes
let landerAnimationInformation = {
  src: "images/landerThrusterSheetRedLarge.png",
  sheetWidth: 672,
  sheetHeight: 200,
  spriteWidth: 168,
  spriteHeight: 200,
  numSprites: 4,
}


////////////
// Lore 1 //
////////////


let lore1AnimationInformation = {
  src: "images/flyingAwayFromEarthBackground.png",
  sheetWidth: 2048,
  sheetHeight: 2400,
  spriteWidth: 1024,
  spriteHeight: 800,
  numSprites: 5,
}
let lore1FramesPerSprite = 20;
let lore1Scale = 1;
let lore1Animation = new Animation("origin", new Vector(0, 0), lore1AnimationInformation, lore1FramesPerSprite, lore1Scale, 0, true);

let lore1LanderFramesPerSprite = 20;
let lore1LanderScale = 1;
let lore1LanderRotation = toRadians(55);
let lore1LanderAnimation = new Animation("lander", new Vector(600, 200), landerAnimationInformation, lore1LanderFramesPerSprite, lore1LanderScale, lore1LanderRotation, true);



function startLore1() {
  changeScene("lore1");
  loop = setInterval(playLore1, MS_PER_FRAME);
}

function playLore1() {
  applyKeyboardInput();
  lore1Animation.update();
  lore1Animation.draw(lore1Context);
  lore1LanderAnimation.update();
  lore1LanderAnimation.draw(lore1Context);
}





////////////
// Lore 2 //
////////////

let lore2Close = new Image();
lore2Close.src = "images/lore2Close.png";
let lore2Far = new Image();
lore2Far.src = "images/lore2Far.png"

let backgroundXClose = 0;
let backgroundSpeedClose = 0.7;
let backgroundXFar = 0;
let backgroundSpeedFar = 0.4;

let lore2LanderFramesPerSprite = 20;
let lore2LanderScale = 0.5;
let lore2LanderRotation = toRadians(90);

let lore2LanderAnimation = new Animation("lander", new Vector(lore2Canvas.width/2, lore2Canvas.height/2), landerAnimationInformation, lore2LanderFramesPerSprite, lore2LanderScale, lore2LanderRotation, true);



function startLore2(){
  changeScene("lore2");
  loop = setInterval(playLore2, MS_PER_FRAME);
}

function playLore2(){
  applyKeyboardInput();

  lore2Context.save();

  lore2Context.fillStyle = "#000";
  lore2Context.fillRect(0, 0, lore2Canvas.width, lore2Canvas.height);

  lore2Context.globalAlpha = 0.4;
  lore2Context.drawImage(lore2Far, backgroundXFar, 0);
  lore2Context.drawImage(lore2Far, backgroundXFar + lore2Far.width, 0);

  lore2Context.globalAlpha = 1;
  lore2Context.drawImage(lore2Close, backgroundXClose, 0);
  lore2Context.drawImage(lore2Close, backgroundXClose + lore2Close.width, 0);

  lore2Context.restore();

  //lander
  lore2LanderAnimation.update();
  lore2LanderAnimation.draw(lore2Context);

  //loop background img
  backgroundXClose -= backgroundSpeedClose;
  backgroundXFar -= backgroundSpeedFar;
  if(backgroundXClose <= -lore2Canvas.width){
    backgroundXClose = 0;
  }

  if(backgroundXFar <= -lore2Canvas.width){
    backgroundXFar = 0;
  }
}





////////////
// Lore 3 //
////////////

let lore3Img = new Image();
let lore3Asteroids = new Image();
let asteroidAngle = 0;
let asteroidAngularVel = toRadians(15) / FPS; // 15 degrees per second

let lore3LanderFramesPerSprite = 15;
let lore3LanderScale = 0.5;
let lore3LanderRotation = toRadians(100);

let lore3LanderAnimation = new Animation("lander", new Vector(300, 200), landerAnimationInformation, lore3LanderFramesPerSprite, lore3LanderScale, lore3LanderRotation, true);



function startLore3() {
  changeScene("lore3");
  lore3Img.src = "images/lore3.png";
  lore3Asteroids.src = "images/lore3Asteroids.png";
  loop = setInterval(playLore3, MS_PER_FRAME);
}

function playLore3() {
  applyKeyboardInput();
  //draw planet and stars in background
  lore3Context.drawImage(lore3Img, 0, 0);

  //draw asteroids orbiting planet
  lore3Context.save();
  lore3Context.translate(lore3Canvas.width, lore3Canvas.height);
  lore3Context.rotate(asteroidAngle);
  lore3Context.scale(2.1, 2.1);
  lore3Context.drawImage(lore3Asteroids, -lore3Asteroids.width/2, -lore3Asteroids.height/2);
  lore3Context.restore();
  asteroidAngle += asteroidAngularVel;

  //draw lander
  lore3LanderAnimation.update();
  lore3LanderAnimation.draw(lore3Context);
}
