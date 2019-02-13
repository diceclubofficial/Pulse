"use strict"

let canvasGA = document.getElementById("game-area");
let contextGA = canvasGA.getContext("2d");
const WIDTH = window.innerWidth - 20;
const HEIGHT = window.innerHeight - 70;
canvasGA.width = WIDTH;
canvasGA.height = HEIGHT;

let canvasOffscreen = document.createElement("canvas");
let contextOffscreen = canvasOffscreen.getContext("2d");
let OFFSCREEN_WIDTH;
let OFFSCREEN_HEIGHT;
let bottomScreenY;
let totalScreens;
changeOffscreenDimensions(1, 2);
let gameAreaOrigin = new Vector(0, 0);

let sceneNames = [
  "titleScreen",
  "menuScreen",
  "gameArea",
  "successScreen",
  "gameOverScreen",
];

const DEV_MODE = false; // change this to toggle showing developer stats

const FPS = 100;
const MS_PER_FRAME = 1000 / FPS;
console.log("Running at " + Math.round(FPS) + " frames/second and " + Math.round(MS_PER_FRAME) + " ms/frame.");
