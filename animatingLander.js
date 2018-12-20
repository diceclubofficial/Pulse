var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var spriteSheet = new Image();
spriteSheet.src = "images/spritesheet.png";
var landerImage = new Image();
landerImage.src = "images/lander.png";

var numbImages = 3;
var currImage = 0;
var animationDirection = 1;
var imageX = 50, imageY = 50;
var spriteWidth = 42, spriteHeight = 50;
var imageWidth = spriteWidth*3, imageHeight = spriteHeight*3;

var theta = 0;
var rotationDirection = 0;

var thruster = false;

setInterval(animate, 100);
setInterval(draw, 60);

function draw() {
  clearBackground();
  theta+= 0.1 * rotationDirection;
  theta %= 2 * Math.PI;
  drawCurrSprite(imageX, imageY);
}

function animate() {
  clearBackground();
  if(thruster) {
    currImage += animationDirection;
    if(currImage >= numbImages-1) animationDirection = -1;
    else if(currImage <= 0) animationDirection = 1;
  }
  drawCurrSprite(imageX, imageY);
}

function clearBackground() {
  context.fillStyle = "lightblue";
  context.fillRect( 0, 0, canvas.width, canvas.height);
}

function drawCurrSprite(x, y) {
  context.save();
  context.translate(x + imageWidth/2, y + imageHeight/2);
  context.rotate(theta);
  if(thruster) context.drawImage(spriteSheet, currImage*spriteWidth, 0, spriteWidth, spriteHeight, -imageWidth/2, -imageHeight/2, imageWidth, imageHeight);
  else context.drawImage(landerImage, -imageWidth/2, -imageHeight/2, imageWidth, imageHeight);
  context.restore();
}

function keyDown(event) {
  var keyCode = event.keyCode;
  var keyValue = String.fromCharCode(keyCode);
  console.log("key is down " + keyCode + " " + keyValue);

  if(keyCode == 37) {
    console.log("left");
    rotationDirection = -1;
  }
  else if(keyCode == 38) {
    console.log("up");
    thruster = true;
  }
  else if(keyCode == 39) {
    console.log("right");
    rotationDirection = 1;
  }
  else rotationDirection = 0;
}

function keyUp(event) {
  var keyCode = event.keyCode;
  var keyValue = String.fromCharCode(keyCode);
  console.log("key is released " + keyCode + " " + keyValue);

  if(keyCode == 37) {
    console.log("left");
    rotationDirection = 0;
  }
  else if(keyCode == 38) {
    console.log("up");
    thruster = false;
  }
  else if(keyCode == 39) {
    console.log("right");
    rotationDirection = 0;
  }
}
