import { describe, it, expect } from 'vitest';
import * as util from 'node:util';
import { splitAt, minEntryByValue, maxEntryByValue, mapCounts, Heap, Deque } from './utils';

describe('splitAt', () => {
  it('splits at the first occurrence of the delimiter', () => {
    expect(splitAt('hello=world', '=')).toEqual(['hello', '=world']);
  });

  it('returns [str, ""] when delimiter is not found', () => {
    expect(splitAt('hello', '=')).toEqual(['hello', '']);
  });

  it('splits at the first occurrence when delimiter appears multiple times', () => {
    expect(splitAt('a=b=c', '=')).toEqual(['a', '=b=c']);
  });

  it('handles delimiter at the start of the string', () => {
    expect(splitAt('=value', '=')).toEqual(['', '=value']);
  });

  it('handles delimiter at the end of the string', () => {
    expect(splitAt('key=', '=')).toEqual(['key', '=']);
  });

  it('handles empty string input', () => {
    expect(splitAt('', '=')).toEqual(['', '']);
  });

  it('handles multi-character delimiter', () => {
    expect(splitAt('hello::world::foo', '::')).toEqual(['hello', '::world::foo']);
  });

  it('handles delimiter equal to the entire string', () => {
    expect(splitAt('==', '==')).toEqual(['', '==']);
  });

  it('handles empty delimiter', () => {
    expect(splitAt('abc', '')).toEqual(['', 'abc']);
  });
});

describe('minEntryByValue', () => {
  it('returns the entry with the smallest value', () => {
    expect(minEntryByValue([['a', 3], ['b', 1], ['c', 2]])).toEqual(['b', 1]);
  });

  it('returns the last entry when all values are equal', () => {
    expect(minEntryByValue([['a', 5], ['b', 5], ['c', 5]])).toEqual(['c', 5]);
  });

  it('works with a single entry', () => {
    expect(minEntryByValue([['x', 42]])).toEqual(['x', 42]);
  });

  it('returns last minimum when there are ties', () => {
    expect(minEntryByValue([['a', 2], ['b', 1], ['c', 1]])).toEqual(['c', 1]);
  });

  it('handles negative values', () => {
    expect(minEntryByValue([['a', -1], ['b', -5], ['c', 0]])).toEqual(['b', -5]);
  });

  it('handles zero values', () => {
    expect(minEntryByValue([['a', 0], ['b', 3], ['c', 1]])).toEqual(['a', 0]);
  });
});

describe('maxEntryByValue', () => {
  it('returns the entry with the largest value', () => {
    expect(maxEntryByValue([['a', 3], ['b', 1], ['c', 2]])).toEqual(['a', 3]);
  });

  it('returns the last entry when all values are equal', () => {
    expect(maxEntryByValue([['a', 5], ['b', 5], ['c', 5]])).toEqual(['c', 5]);
  });

  it('works with a single entry', () => {
    expect(maxEntryByValue([['x', 42]])).toEqual(['x', 42]);
  });

  it('returns last maximum when there are ties', () => {
    expect(maxEntryByValue([['a', 1], ['b', 3], ['c', 3]])).toEqual(['c', 3]);
  });

  it('handles negative values', () => {
    expect(maxEntryByValue([['a', -1], ['b', -5], ['c', 0]])).toEqual(['c', 0]);
  });

  it('handles zero values', () => {
    expect(maxEntryByValue([['a', 0], ['b', 3], ['c', 1]])).toEqual(['b', 3]);
  });
});

describe('mapCounts', () => {
  it('counts occurrences of each element', () => {
    expect(mapCounts(['a', 'b', 'a', 'c', 'b', 'a'])).toEqual(new Map([['a', 3], ['b', 2], ['c', 1]]));
  });

  it('returns empty map for empty array', () => {
    expect(mapCounts([])).toEqual(new Map());
  });

  it('returns count of 1 for all unique elements', () => {
    expect(mapCounts(['a', 'b', 'c'])).toEqual(new Map([['a', 1], ['b', 1], ['c', 1]]));
  });

  it('handles single element', () => {
    expect(mapCounts(['x'])).toEqual(new Map([['x', 1]]));
  });

  it('handles all identical elements', () => {
    expect(mapCounts([7, 7, 7, 7])).toEqual(new Map([[7, 4]]));
  });

  it('works with numbers', () => {
    expect(mapCounts([1, 2, 3, 2, 1])).toEqual(new Map([[1, 2], [2, 2], [3, 1]]));
  });

  it('distinguishes types when using mixed values', () => {
    expect(mapCounts([true, false, true, true])).toEqual(new Map([[true, 3], [false, 1]]));
  });

  it('handles large repeated sequences', () => {
    const arr = Array(1000).fill('a').concat(Array(500).fill('b'));
    const result = mapCounts(arr);
    expect(result.get('a')).toBe(1000);
    expect(result.get('b')).toBe(500);
    expect(result.size).toBe(2);
  });

  it('preserves insertion order of first occurrence', () => {
    const result = mapCounts(['c', 'a', 'b', 'a']);
    expect([...result.keys()]).toEqual(['c', 'a', 'b']);
  });
});

describe('Heap', () => {
  const minHeap = () => new Heap<number>((a, b) => a < b);
  const maxHeap = () => new Heap<number>((a, b) => a > b);

  it('starts empty', () => {
    const h = minHeap();
    expect(h.size).toBe(0);
    expect(h.peek()).toBeUndefined();
    expect(h.pop()).toBeUndefined();
  });

  it('push and pop single element', () => {
    const h = minHeap();
    h.push(42);
    expect(h.size).toBe(1);
    expect(h.peek()).toBe(42);
    expect(h.pop()).toBe(42);
    expect(h.size).toBe(0);
  });

  it('maintains min-heap order', () => {
    const h = minHeap();
    [5, 3, 8, 1, 4].forEach(v => h.push(v));
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(3);
    expect(h.pop()).toBe(4);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBe(8);
  });

  it('maintains max-heap order', () => {
    const h = maxHeap();
    [5, 3, 8, 1, 4].forEach(v => h.push(v));
    expect(h.pop()).toBe(8);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBe(4);
    expect(h.pop()).toBe(3);
    expect(h.pop()).toBe(1);
  });

  it('handles duplicate values', () => {
    const h = minHeap();
    [3, 1, 3, 1, 2].forEach(v => h.push(v));
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(2);
    expect(h.pop()).toBe(3);
    expect(h.pop()).toBe(3);
  });

  it('peek does not remove element', () => {
    const h = minHeap();
    h.push(10);
    h.push(5);
    expect(h.peek()).toBe(5);
    expect(h.size).toBe(2);
    expect(h.peek()).toBe(5);
  });

  it('interleaved push and pop', () => {
    const h = minHeap();
    h.push(5);
    h.push(3);
    expect(h.pop()).toBe(3);
    h.push(1);
    h.push(4);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(4);
    expect(h.pop()).toBe(5);
  });

  it('works with custom objects', () => {
    interface Task { name: string; priority: number; }
    const h = new Heap<Task>((a, b) => a.priority < b.priority);
    h.push({ name: 'low', priority: 10 });
    h.push({ name: 'high', priority: 1 });
    h.push({ name: 'mid', priority: 5 });
    expect(h.pop()!.name).toBe('high');
    expect(h.pop()!.name).toBe('mid');
    expect(h.pop()!.name).toBe('low');
  });

  it('works with string comparison', () => {
    const h = new Heap<string>((a, b) => a < b);
    ['banana', 'apple', 'cherry'].forEach(v => h.push(v));
    expect(h.pop()).toBe('apple');
    expect(h.pop()).toBe('banana');
    expect(h.pop()).toBe('cherry');
  });

  it('handles large number of elements', () => {
    const h = minHeap();
    const values = Array.from({ length: 1000 }, (_, i) => i);
    // Insert in random order
    const shuffled = [...values].sort(() => Math.random() - 0.5);
    shuffled.forEach(v => h.push(v));
    expect(h.size).toBe(1000);
    for (let i = 0; i < 1000; i++) {
      expect(h.pop()).toBe(i);
    }
  });

  it('returns undefined when popping empty heap', () => {
    const h = minHeap();
    h.push(1);
    h.pop();
    expect(h.pop()).toBeUndefined();
    expect(h.size).toBe(0);
  });

  it('handles all identical elements', () => {
    const h = minHeap();
    [7, 7, 7, 7].forEach(v => h.push(v));
    expect(h.pop()).toBe(7);
    expect(h.pop()).toBe(7);
    expect(h.pop()).toBe(7);
    expect(h.pop()).toBe(7);
    expect(h.pop()).toBeUndefined();
  });

  it('handles negative numbers', () => {
    const h = minHeap();
    [0, -3, 5, -1, -10].forEach(v => h.push(v));
    expect(h.pop()).toBe(-10);
    expect(h.pop()).toBe(-3);
    expect(h.pop()).toBe(-1);
    expect(h.pop()).toBe(0);
    expect(h.pop()).toBe(5);
  });

  it('correctly updates size after operations', () => {
    const h = minHeap();
    expect(h.size).toBe(0);
    h.push(1);
    expect(h.size).toBe(1);
    h.push(2);
    expect(h.size).toBe(2);
    h.pop();
    expect(h.size).toBe(1);
    h.pop();
    expect(h.size).toBe(0);
    h.pop();
    expect(h.size).toBe(0);
  });

  it('sorted input ascending', () => {
    const h = minHeap();
    [1, 2, 3, 4, 5].forEach(v => h.push(v));
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(2);
  });

  it('sorted input descending', () => {
    const h = minHeap();
    [5, 4, 3, 2, 1].forEach(v => h.push(v));
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(2);
  });

  it('two elements swap correctly', () => {
    const h = minHeap();
    h.push(2);
    h.push(1);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(2);
  });
});

describe('Deque', () => {
  it('starts empty', () => {
    const d = new Deque<number>();
    expect(d.length).toBe(0);
  });

  it('constructs from array', () => {
    const d = new Deque<number>([1, 2, 3]);
    expect(d.length).toBe(3);
    expect(d.popFront()).toBe(1);
    expect(d.popFront()).toBe(2);
    expect(d.popFront()).toBe(3);
  });

  it('constructs from empty array', () => {
    const d = new Deque<number>([]);
    expect(d.length).toBe(0);
  });

  it('does not mutate the source array', () => {
    const src = [1, 2, 3];
    const d = new Deque<number>(src);
    d.popFront();
    d.pushBack(99);
    expect(src).toEqual([1, 2, 3]);
  });

  it('pushBack and popFront (FIFO)', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.pushBack(3);
    expect(d.popFront()).toBe(1);
    expect(d.popFront()).toBe(2);
    expect(d.popFront()).toBe(3);
  });

  it('pushBack and popBack (LIFO)', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.pushBack(3);
    expect(d.popBack()).toBe(3);
    expect(d.popBack()).toBe(2);
    expect(d.popBack()).toBe(1);
  });

  it('pushFront and popFront (LIFO)', () => {
    const d = new Deque<number>();
    d.pushFront(1);
    d.pushFront(2);
    d.pushFront(3);
    expect(d.popFront()).toBe(3);
    expect(d.popFront()).toBe(2);
    expect(d.popFront()).toBe(1);
  });

  it('pushFront and popBack (FIFO)', () => {
    const d = new Deque<number>();
    d.pushFront(1);
    d.pushFront(2);
    d.pushFront(3);
    expect(d.popBack()).toBe(1);
    expect(d.popBack()).toBe(2);
    expect(d.popBack()).toBe(3);
  });

  it('mixed push and pop operations', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushFront(2);
    d.pushBack(3);
    d.pushFront(4);
    // State: [4, 2, 1, 3]
    expect(d.popFront()).toBe(4);
    expect(d.popBack()).toBe(3);
    expect(d.popFront()).toBe(2);
    expect(d.popBack()).toBe(1);
  });

  it('throws on popFront from empty deque', () => {
    const d = new Deque<number>();
    expect(() => d.popFront()).toThrow('empty');
  });

  it('throws on popBack from empty deque', () => {
    const d = new Deque<number>();
    expect(() => d.popBack()).toThrow('empty');
  });

  it('throws after draining via popFront', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.popFront();
    expect(() => d.popFront()).toThrow('empty');
  });

  it('throws after draining via popBack', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.popBack();
    expect(() => d.popBack()).toThrow('empty');
  });

  it('length tracks correctly through operations', () => {
    const d = new Deque<number>();
    expect(d.length).toBe(0);
    d.pushBack(1);
    expect(d.length).toBe(1);
    d.pushFront(2);
    expect(d.length).toBe(2);
    d.pushBack(3);
    expect(d.length).toBe(3);
    d.popFront();
    expect(d.length).toBe(2);
    d.popBack();
    expect(d.length).toBe(1);
    d.popFront();
    expect(d.length).toBe(0);
  });

  it('single element popFront', () => {
    const d = new Deque<string>();
    d.pushBack('only');
    expect(d.length).toBe(1);
    expect(d.popFront()).toBe('only');
    expect(d.length).toBe(0);
  });

  it('single element popBack', () => {
    const d = new Deque<string>();
    d.pushBack('only');
    expect(d.length).toBe(1);
    expect(d.popBack()).toBe('only');
    expect(d.length).toBe(0);
  });

  it('single pushFront element popFront', () => {
    const d = new Deque<string>();
    d.pushFront('only');
    expect(d.length).toBe(1);
    expect(d.popFront()).toBe('only');
  });

  it('single pushFront element popBack', () => {
    const d = new Deque<string>();
    d.pushFront('only');
    expect(d.length).toBe(1);
    expect(d.popBack()).toBe('only');
  });

  it('works with string values', () => {
    const d = new Deque<string>();
    d.pushBack('hello');
    d.pushBack('world');
    expect(d.popFront()).toBe('hello');
    expect(d.popFront()).toBe('world');
  });

  it('pushFront after popFront reuses head slot', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.popFront(); // head advances to 1
    d.pushFront(0); // should reuse slot at head-1
    expect(d.length).toBe(2);
    expect(d.popFront()).toBe(0);
    expect(d.popFront()).toBe(2);
  });

  it('pushFront after multiple popFronts', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.pushBack(3);
    d.popFront(); // head=1
    d.popFront(); // head=2
    d.pushFront(10); // reuse slot at head-1
    d.pushFront(20); // reuse slot at head-1
    expect(d.length).toBe(3);
    expect(d.popFront()).toBe(20);
    expect(d.popFront()).toBe(10);
    expect(d.popFront()).toBe(3);
  });

  it('pushFront falls back to unshift when head is 0', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushFront(0); // head=0, must unshift
    expect(d.length).toBe(2);
    expect(d.popFront()).toBe(0);
    expect(d.popFront()).toBe(1);
  });

  it('mixed pushFront/popFront interleaving', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.pushBack(3);
    expect(d.popFront()).toBe(1);
    d.pushFront(0);
    expect(d.popFront()).toBe(0);
    expect(d.popFront()).toBe(2);
    d.pushFront(99);
    expect(d.popFront()).toBe(99);
    expect(d.popFront()).toBe(3);
    expect(d.length).toBe(0);
  });

  it('pushFront after popFront then popBack', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.popFront();
    d.pushFront(0);
    // State: [0, 2]
    expect(d.popBack()).toBe(2);
    expect(d.popBack()).toBe(0);
  });

  it('handles interleaved pushBack/popFront sequences', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    expect(d.popFront()).toBe(1);
    d.pushBack(3);
    expect(d.popFront()).toBe(2);
    d.pushBack(4);
    expect(d.popFront()).toBe(3);
    expect(d.popFront()).toBe(4);
    expect(d.length).toBe(0);
  });

  it('reusable after fully draining', () => {
    const d = new Deque<number>();
    d.pushBack(1);
    d.pushBack(2);
    d.popFront();
    d.popFront();
    d.pushBack(10);
    d.pushBack(20);
    expect(d.popFront()).toBe(10);
    expect(d.popFront()).toBe(20);
  });

  it('handles large number of popFront operations (triggers compaction)', () => {
    const d = new Deque<number>();
    for (let i = 0; i < 2000; i++) d.pushBack(i);
    for (let i = 0; i < 2000; i++) {
      expect(d.popFront()).toBe(i);
    }
    expect(d.length).toBe(0);
  });

  it('maintains correctness across compaction boundary', () => {
    const d = new Deque<number>();
    // Push enough to trigger compaction on popFront (head > 1024 && head*2 > arr.length)
    for (let i = 0; i < 1500; i++) d.pushBack(i);
    // Pop 1100 from front to trigger compaction
    for (let i = 0; i < 1100; i++) {
      expect(d.popFront()).toBe(i);
    }
    // Remaining elements should still be correct
    expect(d.length).toBe(400);
    expect(d.popFront()).toBe(1100);
    expect(d.popBack()).toBe(1499);
  });

  it('handles alternating pushFront and popBack', () => {
    const d = new Deque<number>();
    for (let i = 0; i < 100; i++) {
      d.pushFront(i);
      expect(d.popBack()).toBe(i);
    }
    expect(d.length).toBe(0);
  });

  it('handles alternating pushBack and popFront', () => {
    const d = new Deque<number>();
    for (let i = 0; i < 100; i++) {
      d.pushBack(i);
      expect(d.popFront()).toBe(i);
    }
    expect(d.length).toBe(0);
  });

  describe('toArray', () => {
    it('returns empty array for empty deque', () => {
      const d = new Deque<number>();
      expect(d.toArray()).toEqual([]);
    });

    it('returns elements in order', () => {
      const d = new Deque<number>([1, 2, 3]);
      expect(d.toArray()).toEqual([1, 2, 3]);
    });

    it('reflects pushFront/pushBack', () => {
      const d = new Deque<number>();
      d.pushBack(2);
      d.pushFront(1);
      d.pushBack(3);
      expect(d.toArray()).toEqual([1, 2, 3]);
    });

    it('reflects popFront', () => {
      const d = new Deque<number>([1, 2, 3]);
      d.popFront();
      expect(d.toArray()).toEqual([2, 3]);
    });

    it('reflects popBack', () => {
      const d = new Deque<number>([1, 2, 3]);
      d.popBack();
      expect(d.toArray()).toEqual([1, 2]);
    });

    it('does not mutate internal state', () => {
      const d = new Deque<number>([1, 2, 3]);
      const arr = d.toArray();
      arr.push(99);
      expect(d.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('[util.inspect.custom]', () => {
    it('returns array representation for empty deque', () => {
      const d = new Deque<number>();
      expect((d as any)[util.inspect.custom]()).toEqual([]);
    });

    it('returns array representation of elements', () => {
      const d = new Deque<number>([1, 2, 3]);
      expect((d as any)[util.inspect.custom]()).toEqual([1, 2, 3]);
    });

    it('reflects operations', () => {
      const d = new Deque<number>([1, 2, 3, 4]);
      d.popFront();
      d.pushBack(5);
      expect((d as any)[util.inspect.custom]()).toEqual([2, 3, 4, 5]);
    });

    it('matches toArray output', () => {
      const d = new Deque<number>();
      d.pushBack(10);
      d.pushFront(5);
      d.pushBack(15);
      d.popFront();
      expect((d as any)[util.inspect.custom]()).toEqual(d.toArray());
    });

    it('formats correctly with util.inspect', () => {
      const d = new Deque<number>([1, 2, 3]);
      const output = util.inspect(d);
      expect(output).toBe('[ 1, 2, 3 ]');
    });
  });
});

describe('Heap (isEmpty, clear, drain)', () => {
  const minHeapFn = () => new Heap<number>((a, b) => a < b);
  const maxHeapFn = () => new Heap<number>((a, b) => a > b);

  it('isEmpty reflects state correctly', () => {
    const h = minHeapFn();
    expect(h.isEmpty).toBe(true);
    h.push(1);
    expect(h.isEmpty).toBe(false);
    h.pop();
    expect(h.isEmpty).toBe(true);
  });

  it('clear removes all elements', () => {
    const h = minHeapFn();
    [1, 2, 3, 4, 5].forEach(v => h.push(v));
    expect(h.size).toBe(5);
    h.clear();
    expect(h.size).toBe(0);
    expect(h.isEmpty).toBe(true);
    expect(h.peek()).toBeUndefined();
    expect(h.pop()).toBeUndefined();
  });

  it('clear on empty heap', () => {
    const h = minHeapFn();
    h.clear();
    expect(h.size).toBe(0);
    expect(h.isEmpty).toBe(true);
  });

  it('usable after clear', () => {
    const h = minHeapFn();
    [3, 1, 2].forEach(v => h.push(v));
    h.clear();
    h.push(10);
    h.push(5);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBe(10);
  });

  it('drain returns all elements in priority order', () => {
    const h = minHeapFn();
    [5, 3, 8, 1, 4].forEach(v => h.push(v));
    expect(h.drain()).toEqual([1, 3, 4, 5, 8]);
    expect(h.isEmpty).toBe(true);
  });

  it('drain on empty heap returns empty array', () => {
    const h = minHeapFn();
    expect(h.drain()).toEqual([]);
  });

  it('drain with max-priority', () => {
    const h = maxHeapFn();
    [2, 9, 4, 7].forEach(v => h.push(v));
    expect(h.drain()).toEqual([9, 7, 4, 2]);
  });

  it('handles negative numbers with drain', () => {
    const h = minHeapFn();
    [0, -3, 5, -1, -10].forEach(v => h.push(v));
    expect(h.drain()).toEqual([-10, -3, -1, 0, 5]);
  });
});
