# Pulse
###### A rhythm-game-inspired lunar lander with custom audio analysis and a pixel art aesthetic.
Pulse is a game about landing a spaceship on a planet's surface - using the Web Audio API to interpret music into game obstacles. This is our twist to the lunar lander genre; as opposed to the slow, calculated gameplay of traditional lunar landers, Pulse speeds up gameplay with added maneuverability to play like a rhythm game.

## Executing the Program

1. Clone this repository
2. Navigate to the Pulse directory on your command line
3. Run the following on your command line
```
node index.js
```
4. Using your web browser, go to localhost:8080
5. You're all set!

## How to Play

### Controls
To rotate the lander, use the A and D keys. To activate the thruster, hold the W key. Using the thruster consumes a small amount of fuel. To use a load of fuel to dash forward, press the spacebar. Dashing propels the lander forward quickly, but it consumes a large amount of fuel. Your fuel is limited and replenishes after every level.

### Objectives
The goal of the game is to land safely on the planet's surface. The lander will crash if the landing is too fast or not using both the lander's legs. If the lander sits safely on the planet's surface for a couple seconds, success is declared. To get to the ground, however, you must also avoid **asteroids**. If an asteroid collides with the lander, the lander takes damage proportional to the asteroid's kinetic energy. And if the lander's health reaches zero, the lander explodes and failure is declared.

### Musical Waves
Music is the core idea of Pulse. As such, Pulse uses the Web Audio API to interpret music files and spawn additional obstacles in sync with the rhythm of the music. We call these obstacles **waves**. Waves do not deal damage to the lander's health; they only push the lander, affecting a change in the lander's speed proportional to the wave's speed. There are two types of waves. **Bass waves** are larger and spawn on lower notes within the song. **Treble waves** are smaller, more variant, and spawn on higher notes within the song. **Red** treble waves go the fastest, followed by **green** and **blue** waves, respectively. Red waves also slightly rotate the lander on impact.

### Progression
There are multiple levels of Pulse, increasing in difficulty. Difficulty increases as the terrain gets rockier and the obstacles (asteroids and waves) get more numerous, all scaled linearly. In this sense, Pulse has an endless amount of levels, but play is intended only up until level 8 or so.

## Help?

Sometimes the music takes a while to load after reaching the title screen. Don't worry, it should only take around 30 seconds max. Also, in our experience, Pulse can sometimes lag the web browser.

## Contributors

* Colin Spiridonov - design and programming
* Jason Dykstra - [art](https://www.piskelapp.com/user/5726259057786880/public), design, and programming
* Zachary Braner - design and programming
* Ethan Tift - art
* Davis Kedrosky - writing


## Notes

All art is made by us. All music is in the public domain. Code for the Perlin class (noise used to generate terrain) taken from https://github.com/SRombauts/SimplexNoise/blob/master/src/SimplexNoise.cpp#L166. This project uses the Web Audio API.
