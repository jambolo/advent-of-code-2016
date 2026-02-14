import commander from 'commander';

import { solvePart1, solvePart2 } from './day01-solver';
import * as load from '../lib/load';

const day = 1;
const program = new commander.Command();
program
  .option('-p, --part <number>', 'part to solve', '1')
  .option('-i, --path <path>', 'input file path', './src/day01/day01-input.txt')
  .parse();

const { part, path } = program.opts();

console.log(`== Day ${day}, Part ${part} ==`);

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