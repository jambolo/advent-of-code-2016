import commander from 'commander';

import { solvePart1, solvePart2 } from './day02-solver';
import * as load from '../lib/load';

const day = 2;
const program = new commander.Command();
program
  .option('-p, --part <number>', 'part to solve', '1')
  .option('-i, --path <path>', 'input file path', './src/day02/day02-input.txt')
  .parse();

const { part, path } = program.opts();

console.log(`== Day ${day}, Part ${part} ==`);

const input = load.lines(path);

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
