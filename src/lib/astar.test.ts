import { describe, it, expect } from 'vitest';
import { shortestPath } from './astar';

// Helper: 2D grid point.
type Point = [number, number];
const pointKey = (p: Point) => `${p[0]},${p[1]}`;
const manhattan = (a: Point, b: Point) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// 4-directional grid neighbors with unit cost, optionally blocked by walls.
function gridNeighbors(walls: Set<string>, width: number, height: number) {
  return (p: Point): [Point, number][] => {
    const dirs: Point[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const result: [Point, number][] = [];
    for (const [dx, dy] of dirs) {
      const np: Point = [p[0] + dx, p[1] + dy];
      if (np[0] >= 0 && np[0] < width && np[1] >= 0 && np[1] < height && !walls.has(pointKey(np))) {
        result.push([np, 1]);
      }
    }
    return result;
  };
}

describe('shortestPath', () => {
  it('finds trivial path when start equals goal', () => {
    const result = shortestPath<Point>([0, 0], [0, 0], () => [], () => 0, pointKey);
    expect(result).toEqual([0, [[0, 0]]]);
  });

  it('finds direct path between adjacent nodes', () => {
    const result = shortestPath<Point>(
      [0, 0], [1, 0], gridNeighbors(new Set(), 2, 1), (p) => manhattan(p, [1, 0]), pointKey,
    );
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(1);
    expect(path).toEqual([[0, 0], [1, 0]]);
  });

  it('finds shortest path on open grid', () => {
    const goal: Point = [3, 3];
    const result = shortestPath<Point>(
      [0, 0], goal, gridNeighbors(new Set(), 4, 4), (p) => manhattan(p, goal), pointKey,
    );
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(6);
    expect(path.length).toBe(7);
    expect(path[0]).toEqual([0, 0]);
    expect(path[6]).toEqual([3, 3]);
  });

  it('navigates around walls', () => {
    // 5x5 grid with wall blocking direct path
    // S . . . .
    // # # # . .
    // . . . . .
    // . . # # #
    // . . . . G
    const walls = new Set(['0,1', '1,1', '2,1', '2,3', '3,3', '4,3']);
    const goal: Point = [4, 4];
    const result = shortestPath<Point>(
      [0, 0], goal, gridNeighbors(walls, 5, 5), (p) => manhattan(p, goal), pointKey,
    );
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(path[0]).toEqual([0, 0]);
    expect(path[path.length - 1]).toEqual([4, 4]);
    expect(cost).toBe(path.length - 1);
    // Verify path is connected (each step differs by 1 in exactly one axis)
    for (let i = 1; i < path.length; i++) {
      const dist = manhattan(path[i - 1], path[i]);
      expect(dist).toBe(1);
    }
  });

  it('returns null when no path exists', () => {
    // Completely walled off goal
    const walls = new Set(['0,1', '1,0', '1,1']);
    const result = shortestPath<Point>(
      [0, 0], [1, 1], gridNeighbors(walls, 2, 2), (p) => manhattan(p, [1, 1]), pointKey,
    );
    expect(result).toBeNull();
  });

  it('returns null when goal is unreachable (island)', () => {
    // 3x3 grid, center surrounded by walls
    const walls = new Set(['1,0', '0,1', '2,1', '1,2']);
    const result = shortestPath<Point>(
      [0, 0], [1, 1], gridNeighbors(walls, 3, 3), (p) => manhattan(p, [1, 1]), pointKey,
    );
    expect(result).toBeNull();
  });

  it('handles weighted edges', () => {
    // Graph: A --1--> B --1--> D
    //        A --5--> D (direct but expensive)
    type N = string;
    const edges: Record<string, [N, number][]> = {
      A: [['B', 1], ['D', 5]],
      B: [['D', 1]],
      D: [],
    };
    const result = shortestPath<N>('A', 'D', (n) => edges[n] ?? [], () => 0, (n) => n);
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(2);
    expect(path).toEqual(['A', 'B', 'D']);
  });

  it('prefers lower cost even with longer path', () => {
    // A --10--> C (direct, expensive)
    // A --1--> B --1--> C (cheap but more hops)
    const edges: Record<string, [string, number][]> = {
      A: [['C', 10], ['B', 1]],
      B: [['C', 1]],
      C: [],
    };
    const result = shortestPath<string>('A', 'C', (n) => edges[n] ?? [], () => 0, (n) => n);
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(2);
    expect(path).toEqual(['A', 'B', 'C']);
  });

  it('works with zero heuristic (degenerates to Dijkstra)', () => {
    const goal: Point = [2, 2];
    const result = shortestPath<Point>(
      [0, 0], goal, gridNeighbors(new Set(), 3, 3), () => 0, pointKey,
    );
    expect(result).not.toBeNull();
    const [cost] = result!;
    expect(cost).toBe(4);
  });

  it('works with complex graph (diamond shape)', () => {
    //     B
    //   / | \
    // A   |   D
    //   \ | /
    //     C
    const edges: Record<string, [string, number][]> = {
      A: [['B', 1], ['C', 2]],
      B: [['D', 3]],
      C: [['D', 1]],
      D: [],
    };
    const result = shortestPath<string>('A', 'D', (n) => edges[n] ?? [], () => 0, (n) => n);
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(3);
    expect(path).toEqual(['A', 'C', 'D']);
  });

  it('handles single node graph with no neighbors', () => {
    const result = shortestPath<string>('A', 'B', () => [], () => 0, (n) => n);
    expect(result).toBeNull();
  });

  it('handles bidirectional edges', () => {
    const edges: Record<string, [string, number][]> = {
      A: [['B', 1]],
      B: [['A', 1], ['C', 1]],
      C: [['B', 1]],
    };
    const result = shortestPath<string>('A', 'C', (n) => edges[n] ?? [], () => 0, (n) => n);
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(2);
    expect(path).toEqual(['A', 'B', 'C']);
  });

  it('finds path on larger grid', () => {
    const goal: Point = [9, 9];
    const result = shortestPath<Point>(
      [0, 0], goal, gridNeighbors(new Set(), 10, 10), (p) => manhattan(p, goal), pointKey,
    );
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(18);
    expect(path.length).toBe(19);
  });

  it('handles maze-like corridor', () => {
    // 1xN corridor: (0,0) -> (4,0)
    const result = shortestPath<Point>(
      [0, 0], [4, 0], gridNeighbors(new Set(), 5, 1), (p) => manhattan(p, [4, 0]), pointKey,
    );
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(4);
    expect(path).toEqual([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]);
  });

  it('uses heuristic to guide search efficiently', () => {
    // Track which nodes are expanded
    const expanded: string[] = [];
    const goal: Point = [5, 0];
    const result = shortestPath<Point>(
      [0, 0],
      goal,
      (p) => {
        expanded.push(pointKey(p));
        return gridNeighbors(new Set(), 6, 3)(p);
      },
      (p) => manhattan(p, goal),
      pointKey,
    );
    expect(result).not.toBeNull();
    const [cost] = result!;
    expect(cost).toBe(5);
    // With a good heuristic, A* should not need to explore all 18 cells
    expect(expanded.length).toBeLessThan(18);
  });

  it('handles non-integer costs', () => {
    const edges: Record<string, [string, number][]> = {
      A: [['B', 0.5], ['C', 1.5]],
      B: [['C', 0.5]],
      C: [],
    };
    const result = shortestPath<string>('A', 'C', (n) => edges[n] ?? [], () => 0, (n) => n);
    expect(result).not.toBeNull();
    const [cost, path] = result!;
    expect(cost).toBe(1);
    expect(path).toEqual(['A', 'B', 'C']);
  });
});
