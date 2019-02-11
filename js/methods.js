
function changeOffscreenDimensions(horizontalScreens, verticalScreens) {
  OFFSCREEN_WIDTH = horizontalScreens * WIDTH;
  OFFSCREEN_HEIGHT = verticalScreens * HEIGHT;
  canvasOffscreen.width = OFFSCREEN_WIDTH;
  canvasOffscreen.height = OFFSCREEN_HEIGHT;

  bottomScreenY = OFFSCREEN_HEIGHT - HEIGHT;

  totalScreens = (OFFSCREEN_WIDTH / WIDTH) * (OFFSCREEN_HEIGHT / HEIGHT);
}

function rectanglesCollide(rect1, rect2) {
  return (rect1.x + rect1.width > rect2.x
    && rect1.x < rect2.x + rect2.width
    && rect1.y + rect1.height > rect2.y
    && rect1.y < rect2.y + rect2.width
  );
}

function getFinalCollisionVelocity(m1, v1, m2, v2) {
  let numerator = m1*v1 + m2*v2 + m2*(v2 - v1);
  let denomenator = m1 + m2;
  return numerator/denomenator;
}

function rotatePoint(vector, theta, origin) {
  let x0 = vector.x - origin.x;
  let y0 = vector.y - origin.y;
  let x1 = origin.x + (x0*Math.cos(theta) - y0*Math.sin(theta));
  let y1 = origin.y + (y0*Math.cos(theta) + x0*Math.sin(theta));
  let degrees = theta*(180/Math.PI);
  // console.log("Rotated point (" + vector.x + ", " + vector.y + ") by " + degrees + " degrees around (" + origin.x + ", " + origin.y + ") to (" + x1 + ", " + y1 + ")");
  return new Vector(x1, y1);
}

function map(value, li, hi, lt, ht) {
	return (value/(hi-li))*(ht-lt)+lt;
}

function randomValue(min, max) {
	return min + (Math.random() * (max - min));
}

function randomInt(min, max, excluding) {
	let value = Math.floor(min + (Math.random() * (max - min)));
	while(value == excluding) {
		value = Math.floor(min + (Math.random() * (max - min)));
	}
	return value;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

function toDegrees(radians) {
  return radians*(180/Math.PI);
}

function toRadians(degrees) {
  return degrees*(Math.PI/180);
}
