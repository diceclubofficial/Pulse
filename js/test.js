"use strict"

// Syntax to initialize variables
const GRAVITY = 9.8;

let backtickString = `I can add ${1+2} numbers together`;

let isGreater = 4 > 1;

let help = 22,
    jonno = 8,
    lifeblood = 'no';


let fourToTheFifth =  4 ** 5;


// Class syntax
class User {

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    alert(this.name);
  }
}

let user = new User("John")


// Functions syntax
function agitate(){
  prompt("How many cups in a mile?")
}

function showMessage(from, text = "no text given") {
  alert( from + ": " + text );
}

// Object and Array syntax, loop syntax
let obj = {
  name:"jason",
  occupation:"unemployed",
  rating:"-12",
};

for (let key in obj) {
  console.log(key);
}

let arr = [1, 2, "three", false, function() {console.log("five");}];

for (let index of arr) {
  console.log(index);
}

/*

The simplest way to clear an array is: arr.length = 0;.


A function with an empty return or without it returns undefined


Modern code has few or no global variables

If a parameter is not given to a function, its value is undefined

Numeric conversion rules
undefined --> NaN
null --> 0
true/false --> 1/0
string --> the value after whitespaces removed, 0 if empty, and NaN if invalid number

+x does the same thing as Number(x)

'modal' windows are those that prevent all other interaction until resolved

Ternary operator syntax: let result = condition ? value1 : value2

there is a widely known agreement that properties starting with an underscore "_" are internal and should not be touched from outside the object.

Labels for break/continue!
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) break outer; // (*)

    // do something with the value...
  }
}
alert('Done!');



cheatsheet of array methods:

To add/remove elements:

push(...items) – adds items to the end,
pop() – extracts an item from the end,
shift() – extracts an item from the beginning,
unshift(...items) – adds items to the beginning.
splice(pos, deleteCount, ...items) – at index pos delete deleteCount elements and insert items.
slice(start, end) – creates a new array, copies elements from position start till end (not inclusive) into it.
concat(...items) – returns a new array: copies all members of the current one and adds items to it. If any of items is an array, then its elements are taken.
To search among elements:

indexOf/lastIndexOf(item, pos) – look for item starting from position pos, return the index or -1 if not found.
includes(value) – returns true if the array has value, otherwise false.
find/filter(func) – filter elements through the function, return first/all values that make it return true.
findIndex is like find, but returns the index instead of a value.
To transform the array:

map(func) – creates a new array from results of calling func for every element.
sort(func) – sorts the array in-place, then returns it.
reverse() – reverses the array in-place, then returns it.
split/join – convert a string to array and back.
reduce(func, initial) – calculate a single value over the array by calling func for each element and passing an intermediate result between the calls.
To iterate over elements:

forEach(func) – calls func for every element, does not return anything.
Additionally:

Array.isArray(arr) checks arr for being an array.
Please note that methods sort, reverse and splice modify the array itself.
*/
// prompt(help);

//agitate()

let loc = new Vector(0, 0);

console.log(location.x + "," + location.y);
