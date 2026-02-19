import { solvePart1, solvePart2 } from './day05-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';


const day = 5;
const { part, path } = setup.args(day);
setup.banner(day, part);

// Hard-coded input
const doorId = 'ugkcyxxp';

let result;
if (part === '2') {
  result = solvePart2(doorId);
} else {
  result = solvePart1(doorId);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
