import { solvePart1, solvePart2 } from './day15-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 15;
const { part, path } = setup.args(day);
setup.banner(day, part);

// Hard-coded input
// Disc #1 has 13 positions; at time=0, it is at position 11.
// Disc #2 has 5 positions; at time=0, it is at position 0.
// Disc #3 has 17 positions; at time=0, it is at position 11.
// Disc #4 has 3 positions; at time=0, it is at position 0.
// Disc #5 has 7 positions; at time=0, it is at position 2.
// Disc #6 has 19 positions; at time=0, it is at position 17.

const input = [[13, 11], [5, 0], [17, 11], [3, 0], [7, 2], [19, 17]];


let result;
if (part === '2') {
  result = solvePart2(input);
} else {
  result = solvePart1(input);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
