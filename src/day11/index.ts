import { solvePart1, solvePart2 } from './day11-solver';
import * as setup from '../lib/setup';

const day = 11;
const { part, path } = setup.args(day);
setup.banner(day, part);

// Hard-coded input
// The first floor contains a promethium generator and a promethium-compatible microchip.
// The second floor contains a cobalt generator, a curium generator, a ruthenium generator, and a plutonium generator.
// The third floor contains a cobalt-compatible microchip, a curium-compatible microchip, a ruthenium-compatible microchip, and a
// plutonium-compatible microchip.
// The fourth floor contains nothing relevant.

// Each value is the floor number (0-3) of the corresponding item.
// The first half of the items are microchips and the second half are generators.
//const input:  [number[], number[]] = [[1, 1], [2, 3]]; // example input
const input: [number[], number[]] = [[1, 3, 3, 3, 3], [1, 2, 2, 2, 2]];

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
