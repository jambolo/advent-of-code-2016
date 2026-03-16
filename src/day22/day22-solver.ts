export interface Result {
  answer: number | string;
}

export interface Node {
  x: number;
  y: number;
  size: number;
  used: number;
  avail: number;
}

const WIDTH = 32;
const HEIGHT = 31;

export function solvePart1(nodes: Node[]): Result | null {
  let viableCount = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      if (nodes[i].used > 0 && nodes[i].used <= nodes[j].avail) {
        viableCount++;
      }
    }
  }
  return { answer: viableCount };
}

function toIndex(x: number, y: number): number {
  // data is column-major
  return x * WIDTH + y;
}

function toCoords(index: number): [ number, number ] {
  // data is column-major
  return [ Math.floor(index / WIDTH), index % WIDTH ];
}

export function solvePart2(nodes: Node[]): Result | null {
  const START = toIndex(WIDTH - 1, 0);
  const GOAL = toIndex(0, 0);

  return null;
}
