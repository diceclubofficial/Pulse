"use strict"

let canvasGA = document.getElementById("game-area");
let contextGA = canvasGA.getContext("2d");
const WIDTH = window.innerWidth - 20;
const HEIGHT = window.innerHeight - 70;
canvasGA.width = WIDTH;
canvasGA.height = HEIGHT;

let canvasOffscreen = document.createElement("canvas");
let contextOffscreen = canvasOffscreen.getContext("2d");

let lore1Canvas = document.getElementById("lore1");
let lore1Context = lore1Canvas.getContext("2d");
let lore2Canvas = document.getElementById("lore2");
let lore2Context = lore2Canvas.getContext("2d");
let lore3Canvas = document.getElementById("lore3");
let lore3Context = lore3Canvas.getContext("2d");


let OFFSCREEN_WIDTH;
let OFFSCREEN_HEIGHT;
let bottomScreenY;
let totalScreens;
changeOffscreenDimensions(1, 2);
let gameAreaOrigin = new Vector(0, 0);

let sceneNames = [
  "titleScreen",
  "menuScreen",
  "lore1",
  "lore2",
  "lore3",
  "gameArea",
  "successScreen",
  "gameOverScreen",
];

const DEV_MODE = false; // change this to toggle showing developer stats

const FPS = 100;
const MS_PER_FRAME = 1000 / FPS;
console.log("Running at " + Math.round(FPS) + " frames/second and " + Math.round(MS_PER_FRAME) + " ms/frame.");
