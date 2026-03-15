import { createHash } from 'node:crypto';
import { shortestPath } from "../lib/astar";

export interface Result {
  answer: number | string;
}

interface Node {
  x: number;
  y: number;
  path: string;
  door: string;
}

const START: Node = { x: 0, y: 0, path: "", door: "" };
const GOAL: Node = { x: 3, y: 3, path: "", door: "" };

const X_MIN = 0;
const X_MAX = 3;
const Y_MIN = 0;
const Y_MAX = 3;

function doorIsOpen(c: string): boolean {
  return "bcdef".includes(c);
}

function doors(prefix: string, path: string): boolean[] {
  let hash = createHash('md5').update(prefix + path, 'utf8').digest('hex');
  return [
    doorIsOpen(hash[0]),
    doorIsOpen(hash[1]),
    doorIsOpen(hash[2]),
    doorIsOpen(hash[3]),
  ];
}

// key(node) should return a unique string key for the node (used for caching).
function key(node: Node): string {
  return `${node.x},${node.y}:${node.path}`;
}

let accessibleNodesOf = (node: Node, goal: {x: number, y: number}, prefix: string): [Node, number][] => {
  let n: [Node, number][] = [
    [{ x: node.x, y: node.y - 1, path: node.path + "U", door: "U" }, 1],
    [{ x: node.x, y: node.y + 1, path: node.path + "D", door: "D" }, 1],
    [{ x: node.x - 1, y: node.y, path: node.path + "L", door: "L" }, 1],
    [{ x: node.x + 1, y: node.y, path: node.path + "R", door: "R" }, 1],
  ];
  // Check the doors
  let accessible: [Node, number][] = n.filter(([n, _]) => {
      let d = doors(prefix, node.path);
      if (n.y < node.y) return d[0]; // up
      if (n.y > node.y) return d[1]; // down
      if (n.x < node.x) return d[2]; // left
      if (n.x > node.x) return d[3]; // right
      throw new Error("Invalid neighbor");
    });
  
  // Stay within the grid
  let inbounds: [Node, number][] = accessible.filter(([n, _]) => n.x >= X_MIN && n.x <= X_MAX && n.y >= Y_MIN && n.y <= Y_MAX);

  // The goal node must have a path of "" to match the goal parameter in the search.
  let massaged = inbounds.map(([n, cost]) => {
    if (n.x === goal.x && n.y === goal.y) {
      return [{ x: n.x, y: n.y, path: "", door: n.door }, 1] as [Node, number];
    }
    return [n, cost] as [Node, number];
  });
  return massaged;
}

export function solvePart1(input: string): Result | null {
  // h(node) should return a heuristic estimate of the cost from node to goal.
  let h = (node: Node): number => {
    return Math.abs(node.x - GOAL.x) + Math.abs(node.y - GOAL.y);
  };
  // neighbors(node) should return an array of [neighbor, edgeCost] pairs.
  let neighbors = (node: Node): [Node, number][] => {
    return accessibleNodesOf(node, GOAL, input);
  }

  // Returns the total cost and path, or null, if no path exists.
  let result: [cost: number, path: Node[]] | null = shortestPath(START, GOAL, neighbors, h, key);

  if (result === null) {
    return null;
  }
  // Return the path string of the next to last node appended with the door of the last node.
  let [cost, path] = result;
  let lastNode = path[path.length - 1];
  let nextToLastNode = path[path.length - 2];
  return { answer: nextToLastNode.path + lastNode.door };
}

function searchRecursive(node: Node, goal: {x: number, y: number}, prefix: string): number | null{
  // If this is the goal, return a cost of 0.
  if (node.x === goal.x && node.y === goal.y) {
    return 0;
  }

  let neighbors: [Node, number][] = accessibleNodesOf(node, goal, prefix);
  let maxCost = 0;
  for (let [n, _] of neighbors) {
    let cost = searchRecursive(n, goal, prefix);
    if (cost !== null) {
      maxCost = Math.max(maxCost, cost + 1);
    }
  }
  return maxCost > 0 ? maxCost : null;
}

export function solvePart2(input: string): Result | null {
  let answer = searchRecursive(START, GOAL, input);
  if (answer === null) {
    return null;
  }
  return { answer };
}
