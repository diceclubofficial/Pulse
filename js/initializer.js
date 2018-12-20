// Javascript File 00
"use strict"
var canvasGA = document.getElementById("game-area");
var gameWidth = 800;
var gameHeight = gameWidth;

var contextGA = canvasGA.getContext("2d");


contextGA.fillStyle = "#000000";

contextGA.fillRect(0,0,canvasGA.width,canvasGA.height);
