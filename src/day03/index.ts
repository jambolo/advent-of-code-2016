import { solvePart1, solvePart2 } from './day03-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 3;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = load.lines(path);

const triangles = input.map(line => line.trim().split(/\s+/).map(Number));

let result;
if (part === '2') {
  result = solvePart2(triangles);
} else {
  result = solvePart1(triangles);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
