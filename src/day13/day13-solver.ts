import { shortestPath } from "../lib/astar";

export interface Result {
  answer: number | string;
}

function numberOfBits(n: number): number {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

export function solvePart1(input: number): Result | null {
  const start = { x: 1, y: 1 };
  const goal = { x: 31, y: 39 };

  const isOpen = (x: number, y: number): boolean => {
    const value = x * x + 3 * x + 2 * x * y + y + y * y + input;
    return numberOfBits(value) % 2 === 0;
  };

  const neighbors = (node: { x: number; y: number }): [{ x: number; y: number }, number][] => {
    const deltas = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    const result: [{ x: number; y: number }, number][] = [];
    for (const { dx, dy } of deltas) {
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (nx >= 0 && ny >= 0 && isOpen(nx, ny)) {
        result.push([{ x: nx, y: ny }, 1]);
      }
    }
    return result;
  }

  const h = (node: { x: number; y: number }): number => {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
  };

  const nodeToString = (node: { x: number; y: number }): string => {
    return `${node.x},${node.y}`;
  };

  const result = shortestPath(start, goal, neighbors, h, nodeToString);
  if (result === null) return null;
  const [cost] = result;
  return { answer: cost };
}

export function solvePart2(input: number): Result | null {
  const visited = new Set<string>();
  const start = { x: 1, y: 1 };
  const isOpen = (x: number, y: number): boolean => {
    const value = x * x + 3 * x + 2 * x * y + y + y * y + input;
    return numberOfBits(value) % 2 === 0;
  };

  const neighbors = (node: { x: number; y: number }): { x: number; y: number }[] => {
    const deltas = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    const result: { x: number; y: number }[] = [];
    for (const { dx, dy } of deltas) {
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (nx >= 0 && ny >= 0 && isOpen(nx, ny)) {
        result.push({ x: nx, y: ny });
      }
    }
    return result;
  };
  
  const queue: [{ x: number; y: number }, number][] = [[start, 0]];
  while (queue.length > 0) {
    const [node, cost] = queue.shift()!;
    const nodeKey = `${node.x},${node.y}`;
    if (visited.has(nodeKey)) continue;
    visited.add(nodeKey);
    if (cost >= 50) continue;
    for (const neighbor of neighbors(node)) {
      queue.push([neighbor, cost + 1]);
    }
  }

  return { answer: visited.size };
}
