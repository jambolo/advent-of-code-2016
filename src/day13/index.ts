import { solvePart1, solvePart2 } from './day13-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 13;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = 1358;

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
