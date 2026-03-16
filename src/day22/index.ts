import { Node, solvePart1, solvePart2 } from './day22-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 22;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = load.lines(path);

let nodes: Node[] = [];

for (let i = 2; i < input.length; i++) {
  const line = input[i];
  const match = line.match(/^\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/);
  if (!match) {
    throw new Error(`Invalid line format: ${line}`);
  }
  const [_, x, y, size, used, avail] = match;
  nodes.push({
    x: parseInt(x),
    y: parseInt(y),
    size: parseInt(size),
    used: parseInt(used),
    avail: parseInt(avail)
  });
}

let result;
if (part === '2') {
  result = solvePart2(nodes);
} else {
  result = solvePart1(nodes);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
