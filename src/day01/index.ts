import { solvePart1, solvePart2 } from './day01-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 1;
const { part, path } = setup.args(day);
setup.banner(day, part);

const directions = load.commaSeparatedValues(path);

let result;
if (part === '1') {
  result = solvePart1(directions);
} else if (part === '2') {
  result = solvePart2(directions);
} else {
  throw new Error(`Unsupported part: ${part}`);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}