import { shortestPath } from '../lib/astar';

export interface Result {
  answer: number | string;
}

interface Node {
  floors: number[]; // The floor of each item, indexed by item type. The first half are microchips, the second half are generators.
  elevator: number; // The floor of the elevator.
}

// A microchip can never be in the presence of an unassociated RTG unless its own RTG is also present.
function nodeIsValid(node: Node): boolean {
  const typeCount = node.floors.length / 2;
  // Bitmask of floors that have at least one generator.
  let generatorFloorMask = 0;
  for (let j = 0; j < typeCount; j++) {
    generatorFloorMask |= 1 << node.floors[j + typeCount];
  }
  for (let i = 0; i < typeCount; i++) {
    const chipFloor = node.floors[i];
    if (chipFloor !== node.floors[i + typeCount] && (generatorFloorMask & (1 << chipFloor))) {
      return false;
    }
  }
  return true;
}

function moveSingleItem(node: Node, i: number, newFloor: number): Node {
  const newNode: Node = {floors: [...node.floors], elevator: newFloor};
  newNode.floors[i] = newFloor;
  return newNode;
}

function moveTwoItems(node: Node, i: number, j: number, newFloor: number): Node {
  const newNode: Node = {floors: [...node.floors], elevator: newFloor};
  newNode.floors[i] = newFloor;
  newNode.floors[j] = newFloor;
  return newNode;
}

function moveAllSingleItems(result: [Node, number][], node: Node, newFloor: number): void {
  for (let i = 0; i < node.floors.length; i++) {
    if (node.floors[i] !== node.elevator) continue;
    const newNode = moveSingleItem(node, i, newFloor);
    if (nodeIsValid(newNode)) result.push([newNode, 1]);
  }
}

function moveAllDoubleItems(result: [Node, number][], node: Node, newFloor: number): void {
  for (let i = 0; i < node.floors.length - 1; i++) {
    if (node.floors[i] !== node.elevator) continue;
    for (let j = i + 1; j < node.floors.length; j++) {
      if (node.floors[j] !== node.elevator) continue;
      const newNode = moveTwoItems(node, i, j, newFloor);
      if (nodeIsValid(newNode)) result.push([newNode, 1]);
    }
  }
}

function neighbors(node: Node): [Node, number][] {
  const result: [Node, number][] = [];
  if (node.elevator > 1) {
    const down = node.elevator - 1;
    moveAllSingleItems(result, node, down);
    moveAllDoubleItems(result, node, down);
  }
  if (node.elevator < 4) {
    const up = node.elevator + 1;
    moveAllSingleItems(result, node, up);
    moveAllDoubleItems(result, node, up);
  }
  return result;
}

const a_code = 'a'.charCodeAt(0);
function nodeToString(node: Node): string {
  let s = String.fromCharCode(node.elevator + a_code); // This is ok because values are 1 - 4
  for (let i = 0; i < node.floors.length; i++) {
    s += String.fromCharCode(node.floors[i] + a_code); // This is ok because values are 1 - 4
  }
  return s;
}

function heuristic(node: Node): number {
  let h = 0;
  // Count moves to get each item to top floor, divide by 2 (items can move in pairs).
  for (let i = 0; i < node.floors.length; i++) {
    h += 4 - node.floors[i];
  }
  return (h + 1) / 2; // Round up because an odd number means that at least one item will need to be moved alone.
}

export function solvePart1(input: [number[], number[]]): Result | null {
  const itemCount = input[0].length + input[1].length;
  const start = { floors: input[0].concat(input[1]), elevator: 1 };
  const goal = { floors: new Array(itemCount).fill(4), elevator: 4 };
  const result = shortestPath(start, goal, neighbors, heuristic, nodeToString);
  if (result === null) return null;
  const [cost] = result;
  return { answer: cost };
}

export function solvePart2(input: [number[], number[]]): Result | null {
  const extraChips = [1, 1];
  const extraGenerators = [1, 1];
  input[0].push(...extraChips);
  input[1].push(...extraGenerators);
  const itemCount = input[0].length + input[1].length;
  const start = { floors: input[0].concat(input[1]), elevator: 1 };
  const goal = { floors: new Array(itemCount).fill(4), elevator: 4 };
  const result = shortestPath(start, goal, neighbors, heuristic, nodeToString);
  if (result === null) return null;
  const [cost] = result;
  return { answer: cost };
}
