import { solvePart1, solvePart2 } from './day05-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 5;
const { part, path } = setup.args(day);
setup.banner(day, part);

let result;
if (part === '2') {
  result = solvePart2();
} else {
  result = solvePart1();
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
