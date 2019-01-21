"use strict"

let canvasGA = document.getElementById("game-area");
let contextGA = canvasGA.getContext("2d");
const WIDTH = window.innerWidth - 20;
const HEIGHT = window.innerHeight - 70;
canvasGA.width = WIDTH;
canvasGA.height = HEIGHT;

let canvasOffscreen = document.createElement("canvas");
let contextOffscreen = canvasOffscreen.getContext("2d");
const OFFSCREEN_WIDTH = WIDTH;
const OFFSCREEN_HEIGHT = 2 * HEIGHT;
canvasOffscreen.width = OFFSCREEN_WIDTH;
canvasOffscreen.height = OFFSCREEN_HEIGHT;

let gameAreaOrigin = new Vector(0, 0);
let bottomScreenY = OFFSCREEN_HEIGHT - HEIGHT;

let totalScreens = (OFFSCREEN_WIDTH/WIDTH) * (OFFSCREEN_HEIGHT/HEIGHT);
