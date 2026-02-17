import { solvePart1, solvePart2, Operation } from './day08-solver';
import * as load from '../lib/load';
import * as setup from '../lib/setup';

const day = 8;
const { part, path } = setup.args(day);
setup.banner(day, part);

const input = load.lines(path);
const operations: Operation[] = input.map(line => {
  if (line.startsWith('rect')) {
    const [, width, height] = line.match(/rect (\d+)x(\d+)/)!.map(Number);
    return { type: 'rect', params: [width, height] };
  } else if (line.startsWith('rotate row')) {
    const [, y, shift] = line.match(/rotate row y=(\d+) by (\d+)/)!.map(Number);
    return { type: 'rotateRow', params: [y, shift] };
  } else if (line.startsWith('rotate column')) {
    const [, x, shift] = line.match(/rotate column x=(\d+) by (\d+)/)!.map(Number);
    return { type: 'rotateColumn', params: [x, shift] };
  }
  throw new Error(`Unknown operation: ${line}`);
});

let result;
if (part === '2') {
  result = solvePart2(operations);
} else {
  result = solvePart1(operations);
  if (result === null) {
    console.log("No solution found.");
  } else {
    console.log("Answer:", result.answer);
  }
}

