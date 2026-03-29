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
  for (const a of nodes) {
    for (const b of nodes) {
      if (a !== b && a.used > 0 && a.used <= b.avail) viableCount++;
    }
  }
  return { answer: viableCount };
}

export function solvePart2(nodes: Node[]): Result | null {
  const START_INDEX = toIndex(WIDTH - 1, 0);
  const GOAL_INDEX = toIndex(0, 0);

  let [dataX, dataY] = toCoords(START_INDEX);
  let [emptyX, emptyY] = toCoords(nodes.findIndex(node => node.used === 0));

//  console.log("Initial grid:");
//  drawGrid(nodes, toIndex(dataX, dataY), GOAL_INDEX);

  let stepCount = 0;
  for (let i = 0; i < 3; i++) {
    [emptyX, emptyY] = move(emptyX, emptyY, [-1, 0] as const, nodes);
    ++stepCount;
  }

  while (emptyY > 0) {
    [emptyX, emptyY] = move(emptyX, emptyY, [0, -1] as const, nodes);
    ++stepCount;
  }

  while (emptyX < dataX - 1) {
    [emptyX, emptyY] = move(emptyX, emptyY, [1, 0] as const, nodes);
    ++stepCount;
  }

  for (let i = 0; i < 30; i++) {
    [dataX, dataY] = move(dataX, dataY, [-1, 0] as const, nodes);
    emptyX = dataX + 1;
    ++stepCount;

    [emptyX, emptyY] = move(emptyX, emptyY, [0, 1] as const, nodes);
    ++stepCount;
    [emptyX, emptyY] = move(emptyX, emptyY, [-1, 0] as const, nodes);
    ++stepCount;
    [emptyX, emptyY] = move(emptyX, emptyY, [-1, 0] as const, nodes);
    ++stepCount;
    [emptyX, emptyY] = move(emptyX, emptyY, [0, -1] as const, nodes);
    ++stepCount;
  }

  [dataX, dataY] = move(dataX, dataY, [-1, 0] as const, nodes);
  emptyX = dataX + 1;
  ++stepCount;

//  console.log(`${stepCount} steps:`);
//  drawGrid(nodes, toIndex(dataX, dataY), GOAL_INDEX);

  return { answer: stepCount };
}

function toIndex(x: number, y: number): number {
  // data is column-major
  return x * HEIGHT + y;
}

function toCoords(index: number): [ number, number ] {
  // data is column-major
  return [ Math.floor(index / HEIGHT), index % HEIGHT ];
}

function isBlocked(x: number, y: number, nodes: Node[]): boolean {
  // A node is locked if its used space is greater than all of its neighbors' sizes.
  if (y === HEIGHT - 1) {
    return false;
  }
  const node0 = nodes[toIndex(x, y)];
  const node1 = nodes[toIndex(x, y + 1)];
  return node0.used > node1.size;
}

function drawGrid(nodes: Node[], startIndex: number, goalIndex: number): void {
  for (let y = 0; y < HEIGHT; y++) {
    let line = '';
    for (let x = 0; x < WIDTH; x++) {
      const index = toIndex(x, y);
      const node = nodes[index];
      if (index === startIndex) {
        line += '* ';
      } else if (node.used === 0) {
        if (index === goalIndex) {
          line += '_G';
        } else {
          line += '_ ';
        }
      } else if (isBlocked(x, y, nodes)) {
        line += '# ';
      } else if (index === goalIndex) {
          line += 'G ';
      } else {
        line += '. ';
      }
    }
    console.log(line);
  }
  console.log('');
}

function move(x: number, y: number, [dx, dy]: readonly [number, number], nodes: Node[]): [number, number] {
  const from = toIndex(x, y);
  const to = toIndex(x + dx, y + dy);
  const fromNode = nodes[from];
  const toNode = nodes[to];
  if (fromNode.used > 0) {
    toNode.used += fromNode.used;
    toNode.avail -= fromNode.used;
    fromNode.avail += fromNode.used;
    fromNode.used = 0;
  } else {
    fromNode.used += toNode.used;
    fromNode.avail -= toNode.used;
    toNode.avail += toNode.used;
    toNode.used = 0;
  }
  return [ x + dx, y + dy ];
}
