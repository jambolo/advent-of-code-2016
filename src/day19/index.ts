import { solvePart1, solvePart2 } from './day19-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 19;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = 3004953;

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
