// Utility functions

// Binary heap with user-supplied comparison function.
// compare(a, b) should return true if a has higher priority than b.
export class Heap<T> {
  private data: T[] = [];
  private compare: (a: T, b: T) => boolean;

  constructor(compare: (a: T, b: T) => boolean) {
    this.compare = compare;
  }

  // Returns the number of elements in the heap.
  get size(): number {
    return this.data.length;
  }

  // Returns true if the heap is empty.
  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  // Returns the top element without removing it.
  peek(): T | undefined {
    return this.data[0];
  }

  // Adds an element to the heap.
  push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  // Removes and returns the top element, or undefined if empty.
  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.compare(this.data[i], this.data[parent])) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  // Removes all elements.
  clear(): void {
    this.data.length = 0;
  }

  // Drains all elements in priority order.
  drain(): T[] {
    const result: T[] = [];
    while (this.data.length > 0) result.push(this.pop()!);
    return result;
  }

  private sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let best = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.data[left], this.data[best])) best = left;
      if (right < n && this.compare(this.data[right], this.data[best])) best = right;
      if (best === i) break;
      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }
  }
}

// Splits a string at the first occurrence of a delimiter.
// Returns the part before the delimiter and the part starting at the delimiter.
export function splitAt(str: string, delim: string): [string, string] {
  const i = str.indexOf(delim);
  return i === -1 ? [str, ""] : [str.slice(0, i), str.slice(i)];
}

// Returns the key/value pair with the smallest value, or undefined if empty.
export function minEntryByValue<K, V>(entries: [K, V][]): [K, V] | undefined {
  if (entries.length === 0) return undefined;
  return entries.reduce((a, b) => a[1] < b[1] ? a : b);
}

// Returns the key/value pair with the largest value, or undefined if empty.
export function maxEntryByValue<K, V>(entries: [K, V][]): [K, V] | undefined {
  if (entries.length === 0) return undefined;
  return entries.reduce((a, b) => a[1] > b[1] ? a : b);
}

// Returns a map of the number of occurrences of each element in the array.
export function mapCounts<T>(a: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  for (const key of a) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}
