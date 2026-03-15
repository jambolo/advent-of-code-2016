import { solvePart1, solvePart2 } from './day20-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 20;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = load.lines(path);

let ranges = input.map(line => {
  const [start, end] = line.split("-").map(Number);
  return { start, end: end + 1 };
});

let result;
if (part === '2') {
  result = solvePart2(ranges);
} else {
  result = solvePart1(ranges);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
