import { shortestPath } from '../lib/astar';
import { permutations } from '../lib/utils';
export interface Result {
  answer: number | string;
}

type Map = string[];
type XY = [number, number];
type NodeList = { [key: string]: XY; };
type DistanceList = { [key: string]: number; };
type DistanceTable = { [key: string]: DistanceList; };
type Edge = [XY, number];
  
export function solvePart1(map: Map): Result | null {
  // Find the locations of all numbers in the map
  let nodes = findAllNodes(map);

  // Find the shortest distances between all pairs of nodes
  let distances: DistanceTable = findShortestDistances(map, nodes);

  // Find the shortest path that visits all nodes starting from '0'. Try all permutations of the other nodes.
  let shortest = Infinity;
  let nodeKeys = Object.keys(nodes).filter(k => k !== '0');
  for (const perm of permutations(nodeKeys)) {
    let path = ['0', ...perm];
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const d = distances[path[i]][path[i + 1]];
      if (d === undefined || d === Infinity) {
        cost = Infinity;
        break;
      }
      cost += d;
    }
    if (cost < shortest) shortest = cost;
  }

  return { answer: shortest };
}

export function solvePart2(map: Map): Result | null {
  // Find the locations of all numbers in the map
  let nodes = findAllNodes(map);

  // Find the shortest distances between all pairs of nodes
  let distances: DistanceTable = findShortestDistances(map, nodes);

  // Find the shortest path that visits all nodes starting from '0'. Try all permutations of the other nodes.
  let shortest = Infinity;
  let nodeKeys = Object.keys(nodes).filter(k => k !== '0');
  for (const perm of permutations(nodeKeys)) {
    let path = ['0', ...perm, '0'];
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const d = distances[path[i]][path[i + 1]];
      if (d === undefined || d === Infinity) {
        cost = Infinity;
        break;
      }
      cost += d;
    }
    if (cost < shortest) shortest = cost;
  }

  return { answer: shortest };
}

function findShortestDistances(map: Map, nodes: NodeList): DistanceTable {
  let neighbors = ([x, y]: XY) => {
    const deltas = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    const result: XY[] = [];

    for (const [dx, dy] of deltas) {
      const nx = x + dx;
      const ny = y + dy;
      if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length) result.push([nx, ny]);
    }
    return result;
  };
  let edges = ([x, y]: XY) => neighbors([x, y]).filter(([nx, ny]) => map[ny][nx] !== '#').map(([nx, ny]) => [[nx, ny], 1] as Edge);
  let key = ([x, y]: XY) => `${x},${y}`;

  let distances: DistanceTable = {};
  let nodeEntries = Object.entries(nodes);
  for (const [node0, [startX, startY]] of nodeEntries) {
    for (const [node1, [goalX, goalY]] of nodeEntries) {
      if (node0 < node1) {
        let h = ([x, y]: XY) => Math.abs(x - goalX) + Math.abs(y - goalY);
        let result = shortestPath([startX, startY], [goalX, goalY], edges, h, key);
        if (result === null) {
          (distances[node0] ??= {})[node1] = Infinity;
          (distances[node1] ??= {})[node0] = Infinity;
        } else {
          let [cost, _] = result;
          (distances[node0] ??= {})[node1] = cost;
          (distances[node1] ??= {})[node0] = cost;
        }
      }
    }
  }
  return distances;
}

function findAllNodes(map: Map): NodeList {
  let nodes: NodeList = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char = map[y][x];
      if (char >= '0' && char <= '9') {
        nodes[char] = [x, y];
      }
    }
  }
  return nodes;
}
