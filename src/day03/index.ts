import commander from 'commander';

import { solvePart1, solvePart2 } from './day03-solver';
import * as load from '../lib/load';

const day = 3;
const program = new commander.Command();
program
  .option('-p, --part <number>', 'part to solve', '1')
  .option('-i, --path <path>', 'input file path', './src/day03/day03-input.txt')
  .parse();

const { part, path } = program.opts();

console.log(`== Day ${day}, Part ${part} ==`);

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
