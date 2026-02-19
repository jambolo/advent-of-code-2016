import { Heap } from './utils';

// Finds the shortest path from start to goal using A*.
// Returns the path and total cost, or null if no path exists.
// neighbors(node) should return an array of [neighbor, edgeCost] pairs.
// h(node) should return a heuristic estimate of the cost from node to goal.
// key(node) should return a unique string key for the node (used for caching).
export function shortestPath<T>(start: T, goal: T, neighbors: (node: T) => [T, number][], h: (node: T) => number, key: (node: T) => string): [cost: number, path: T[]] | null {

  const goalKey = key(goal);
  const startKey = key(start);

  const gScore = new Map<string, number>();
  gScore.set(startKey, 0);

  const cameFrom = new Map<string, { node: T; parentKey: string | null }>();
  cameFrom.set(startKey, { node: start, parentKey: null });

  const pq = new Heap<{ node: T; k: string; f: number }>(
    (a, b) => a.f < b.f
  );
  pq.push({ node: start, k: startKey, f: h(start) });

  const closed = new Set<string>();

  while (!pq.isEmpty) {
    const current = pq.pop()!;

    if (current.k === goalKey) {
      const path: T[] = [];
      let k: string | null = current.k;
      while (k !== null) {
        const entry: { node: T; parentKey: string | null } = cameFrom.get(k)!;
        path.push(entry.node);
        k = entry.parentKey;
      }
      path.reverse();
      return [gScore.get(current.k)!, path];
    }

    if (closed.has(current.k)) continue;
    closed.add(current.k);

    const currentG = gScore.get(current.k)!;

    for (const [neighbor, edgeCost] of neighbors(current.node)) {
      const nk = key(neighbor);
      if (closed.has(nk)) continue;

      const tentativeG = currentG + edgeCost;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, tentativeG);
        cameFrom.set(nk, { node: neighbor, parentKey: current.k });
        pq.push({ node: neighbor, k: nk, f: tentativeG + h(neighbor) });
      }
    }
  }

  return null;
}
