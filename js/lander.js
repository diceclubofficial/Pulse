
class Lander {

  constructor(x, y){
    this.coordinates = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    this.mass = 1;
    this.size = 10;

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.thrusters = 0.15;
    this.momentOfInertia = (.5 * this.mass * Math.pow(this.size/2, 2));
    this.fuel = 3000;
  }

  applyForce(force){ // force need be a vector
    this.acceleration.add(force);
  }

  update(){

    console.log("Before adding acceleration. vel: " + this.velocity + ", acc: " + this.acceleration);

    this.velocity.add(this.acceleration);

    console.log("After adding acceleration. " + this.velocity + ", accel: " + typeof this.acceleration)


    this.coordinates.add(this.velocity);


    this.acceleration.mult(0);



  }

  get x(){
    return this.coordinates.x;
  }

  get y(){
    return this.coordinates.y;
  }

  toString(){
    return (`Acceleration: ${this.acceleration.toString()} \n Velocity: ${this.velocity.toString()} \n Location: ${this.coordinates.toString()}`);

  }

}
