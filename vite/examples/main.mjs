// index.mjs - 'main' JavaScript file

// Import the two functions from the module. 
// Note the './' before 'mymaths.mjs'. This means 'the current folder'
//import { square, cube } from './mymaths.mjs';
import MyDefaultObject from './mymaths.mjs';

/*const a = square(3);
console.log(`The square of 3 is : ${a}`);

const b = cube(2);
console.log(`The cube of 2 is : ${b}`);*/

const a = MyDefaultObject.cube(4);
const b = MyDefaultObject.square(9);
console.log(MyDefaultObject.PI);