import { describe, it, expect } from 'vitest';
import { splitAt, minEntryByValue, maxEntryByValue, mapCounts } from './utils';

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
