"use strict"

class GameArea {

  constructor(objs) {
    this.objects = [];
    if(objs != undefined) {
      for(let i = 0; i < objs.length; i++) {
        this.objects[i] = objs[i];
      }
    }
  }

  moveScope(scopeMovement) {
    let translationVector = new Vector(-scopeMovement.x, -scopeMovement.y);
    for(let object of this.objects) {
      object.translate(translationVector);
    }
  }

  get numObjects() {
    return this.objects.length;
  }

  toString() {
    let returnedString = this.numObjects + " Game Objects:\n";
    for(let object of this.objects) {
      returnedString += object.toString() + "\n";
    }
    return returnedString;
  }
}
