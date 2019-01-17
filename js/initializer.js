"use strict"

let canvasGA = document.getElementById("game-area");
let contextGA = canvasGA.getContext("2d");
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
canvasGA.width = WIDTH;
canvasGA.height = HEIGHT;

let canvasOffscreen = document.createElement("canvas");
let contextOffscreen = canvasOffscreen.getContext("2d");
const OFFSCREEN_WIDTH = 3 * WIDTH;
const OFFSCREEN_HEIGHT = 3 * HEIGHT;
canvasOffscreen.width = OFFSCREEN_WIDTH;
canvasOffscreen.height = OFFSCREEN_HEIGHT;

let gameAreaOrigin = new Vector(WIDTH, HEIGHT);
let bottomScreenY = OFFSCREEN_HEIGHT - HEIGHT;
