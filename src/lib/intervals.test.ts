import { describe, it, expect } from 'vitest';
import { IntervalSet } from './intervals';

const of = IntervalSet.of;
const empty = new IntervalSet();

// Helper to compare interval contents.
function ivs(set: IntervalSet) {
  return set.intervals;
}

describe('of', () => {
  it('creates a single interval', () => {
    expect(ivs(of(1, 5))).toEqual([{ start: 1, end: 5 }]);
  });

  it('returns empty for zero-width interval', () => {
    expect(ivs(of(3, 3))).toEqual([]);
  });

  it('returns empty for negative-width interval', () => {
    expect(ivs(of(5, 2))).toEqual([]);
  });

  it('handles negative values', () => {
    expect(ivs(of(-10, -3))).toEqual([{ start: -10, end: -3 }]);
  });

  it('handles width of 1', () => {
    expect(ivs(of(0, 1))).toEqual([{ start: 0, end: 1 }]);
  });
});

describe('union', () => {
  it('returns b when a is empty', () => {
    const b = of(1, 3);
    expect(ivs(empty.union(b))).toEqual(ivs(b));
  });

  it('returns a when b is empty', () => {
    const a = of(1, 3);
    expect(ivs(a.union(empty))).toEqual(ivs(a));
  });

  it('returns empty when both are empty', () => {
    expect(ivs(empty.union(empty))).toEqual([]);
  });

  it('merges two disjoint intervals in order', () => {
    expect(ivs(of(1, 3).union(of(5, 7)))).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 7 },
    ]);
  });

  it('merges two disjoint intervals in reverse order', () => {
    expect(ivs(of(5, 7).union(of(1, 3)))).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 7 },
    ]);
  });

  it('merges overlapping intervals', () => {
    expect(ivs(of(1, 5).union(of(3, 7)))).toEqual([{ start: 1, end: 7 }]);
  });

  it('merges adjacent intervals', () => {
    expect(ivs(of(1, 3).union(of(3, 5)))).toEqual([{ start: 1, end: 5 }]);
  });

  it('merges contained interval', () => {
    expect(ivs(of(1, 10).union(of(3, 5)))).toEqual([{ start: 1, end: 10 }]);
  });

  it('merges identical intervals', () => {
    expect(ivs(of(2, 5).union(of(2, 5)))).toEqual([{ start: 2, end: 5 }]);
  });

  it('merges multiple intervals from both sides', () => {
    const a = new IntervalSet([{ start: 1, end: 3 }, { start: 10, end: 12 }]);
    const b = new IntervalSet([{ start: 5, end: 7 }, { start: 14, end: 16 }]);
    expect(ivs(a.union(b))).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 7 },
      { start: 10, end: 12 },
      { start: 14, end: 16 },
    ]);
  });

  it('merges multiple overlapping intervals into one', () => {
    const a = new IntervalSet([{ start: 1, end: 5 }, { start: 8, end: 12 }]);
    const b = new IntervalSet([{ start: 4, end: 9 }]);
    expect(ivs(a.union(b))).toEqual([{ start: 1, end: 12 }]);
  });

  it('handles many small intervals merging into one', () => {
    const a = new IntervalSet([{ start: 0, end: 2 }, { start: 4, end: 6 }, { start: 8, end: 10 }]);
    const b = new IntervalSet([{ start: 2, end: 4 }, { start: 6, end: 8 }]);
    expect(ivs(a.union(b))).toEqual([{ start: 0, end: 10 }]);
  });
});

describe('intersection', () => {
  it('returns empty when a is empty', () => {
    expect(ivs(empty.intersection(of(1, 5)))).toEqual([]);
  });

  it('returns empty when b is empty', () => {
    expect(ivs(of(1, 5).intersection(empty))).toEqual([]);
  });

  it('returns empty when both are empty', () => {
    expect(ivs(empty.intersection(empty))).toEqual([]);
  });

  it('returns empty for disjoint intervals', () => {
    expect(ivs(of(1, 3).intersection(of(5, 7)))).toEqual([]);
  });

  it('returns empty for adjacent intervals (half-open)', () => {
    expect(ivs(of(1, 3).intersection(of(3, 5)))).toEqual([]);
  });

  it('returns overlap of two overlapping intervals', () => {
    expect(ivs(of(1, 5).intersection(of(3, 7)))).toEqual([{ start: 3, end: 5 }]);
  });

  it('returns the smaller when one contains the other', () => {
    expect(ivs(of(1, 10).intersection(of(3, 5)))).toEqual([{ start: 3, end: 5 }]);
  });

  it('returns identical interval', () => {
    expect(ivs(of(2, 5).intersection(of(2, 5)))).toEqual([{ start: 2, end: 5 }]);
  });

  it('handles multiple intervals in both sets', () => {
    const a = new IntervalSet([{ start: 0, end: 5 }, { start: 10, end: 15 }]);
    const b = new IntervalSet([{ start: 3, end: 12 }]);
    expect(ivs(a.intersection(b))).toEqual([
      { start: 3, end: 5 },
      { start: 10, end: 12 },
    ]);
  });

  it('handles interleaved intervals', () => {
    const a = new IntervalSet([{ start: 0, end: 3 }, { start: 5, end: 8 }, { start: 10, end: 13 }]);
    const b = new IntervalSet([{ start: 2, end: 6 }, { start: 9, end: 11 }]);
    expect(ivs(a.intersection(b))).toEqual([
      { start: 2, end: 3 },
      { start: 5, end: 6 },
      { start: 10, end: 11 },
    ]);
  });

  it('returns empty for single-point overlap at boundary', () => {
    expect(ivs(of(0, 5).intersection(of(5, 10)))).toEqual([]);
  });
});

describe('subtraction', () => {
  it('returns a when b is empty', () => {
    expect(ivs(of(1, 5).subtraction(empty))).toEqual([{ start: 1, end: 5 }]);
  });

  it('returns empty when a is empty', () => {
    expect(ivs(empty.subtraction(of(1, 5)))).toEqual([]);
  });

  it('returns empty when both are empty', () => {
    expect(ivs(empty.subtraction(empty))).toEqual([]);
  });

  it('returns a when intervals are disjoint', () => {
    expect(ivs(of(1, 3).subtraction(of(5, 7)))).toEqual([{ start: 1, end: 3 }]);
  });

  it('returns a when b is adjacent (half-open)', () => {
    expect(ivs(of(1, 3).subtraction(of(3, 5)))).toEqual([{ start: 1, end: 3 }]);
  });

  it('removes overlap from the right', () => {
    expect(ivs(of(1, 5).subtraction(of(3, 7)))).toEqual([{ start: 1, end: 3 }]);
  });

  it('removes overlap from the left', () => {
    expect(ivs(of(3, 7).subtraction(of(1, 5)))).toEqual([{ start: 5, end: 7 }]);
  });

  it('removes a contained interval, splitting into two', () => {
    expect(ivs(of(1, 10).subtraction(of(3, 7)))).toEqual([
      { start: 1, end: 3 },
      { start: 7, end: 10 },
    ]);
  });

  it('returns empty when b fully covers a', () => {
    expect(ivs(of(3, 7).subtraction(of(1, 10)))).toEqual([]);
  });

  it('returns empty when a equals b', () => {
    expect(ivs(of(2, 5).subtraction(of(2, 5)))).toEqual([]);
  });

  it('handles multiple subtractions from one interval', () => {
    const a = new IntervalSet([{ start: 0, end: 20 }]);
    const b = new IntervalSet([{ start: 3, end: 5 }, { start: 10, end: 12 }, { start: 15, end: 18 }]);
    expect(ivs(a.subtraction(b))).toEqual([
      { start: 0, end: 3 },
      { start: 5, end: 10 },
      { start: 12, end: 15 },
      { start: 18, end: 20 },
    ]);
  });

  it('handles subtracting from multiple intervals', () => {
    const a = new IntervalSet([{ start: 0, end: 5 }, { start: 10, end: 15 }]);
    const b = new IntervalSet([{ start: 3, end: 12 }]);
    expect(ivs(a.subtraction(b))).toEqual([
      { start: 0, end: 3 },
      { start: 12, end: 15 },
    ]);
  });

  it('handles b that does not overlap a at all', () => {
    const a = new IntervalSet([{ start: 0, end: 3 }, { start: 7, end: 10 }]);
    const b = new IntervalSet([{ start: 4, end: 6 }]);
    expect(ivs(a.subtraction(b))).toEqual([
      { start: 0, end: 3 },
      { start: 7, end: 10 },
    ]);
  });

  it('subtracts completely overlapping multiple intervals', () => {
    const a = new IntervalSet([{ start: 0, end: 3 }, { start: 5, end: 8 }]);
    const b = new IntervalSet([{ start: 0, end: 3 }, { start: 5, end: 8 }]);
    expect(ivs(a.subtraction(b))).toEqual([]);
  });
});

describe('normalize', () => {
  it('returns empty for empty input', () => {
    expect(ivs(IntervalSet.normalize([]))).toEqual([]);
  });

  it('returns single interval unchanged', () => {
    expect(ivs(IntervalSet.normalize([{ start: 1, end: 5 }]))).toEqual([{ start: 1, end: 5 }]);
  });

  it('keeps already-normalized disjoint intervals', () => {
    const input = [{ start: 1, end: 3 }, { start: 5, end: 7 }];
    expect(ivs(IntervalSet.normalize(input))).toEqual(input);
  });

  it('merges overlapping intervals', () => {
    expect(ivs(IntervalSet.normalize([{ start: 1, end: 5 }, { start: 3, end: 7 }]))).toEqual([
      { start: 1, end: 7 },
    ]);
  });

  it('merges adjacent intervals', () => {
    expect(ivs(IntervalSet.normalize([{ start: 1, end: 3 }, { start: 3, end: 5 }]))).toEqual([
      { start: 1, end: 5 },
    ]);
  });

  it('merges contained interval', () => {
    expect(ivs(IntervalSet.normalize([{ start: 1, end: 10 }, { start: 3, end: 5 }]))).toEqual([
      { start: 1, end: 10 },
    ]);
  });

  it('merges multiple overlapping into one', () => {
    expect(ivs(IntervalSet.normalize([
      { start: 0, end: 3 },
      { start: 2, end: 5 },
      { start: 4, end: 8 },
    ]))).toEqual([{ start: 0, end: 8 }]);
  });

  it('merges some but not all intervals', () => {
    expect(ivs(IntervalSet.normalize([
      { start: 0, end: 3 },
      { start: 2, end: 5 },
      { start: 10, end: 12 },
    ]))).toEqual([
      { start: 0, end: 5 },
      { start: 10, end: 12 },
    ]);
  });

  it('merges chain of adjacent intervals', () => {
    expect(ivs(IntervalSet.normalize([
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 4 },
    ]))).toEqual([{ start: 0, end: 4 }]);
  });

  it('does not mutate input', () => {
    const input = [{ start: 1, end: 5 }, { start: 3, end: 7 }];
    const copy = JSON.parse(JSON.stringify(input));
    IntervalSet.normalize(input);
    expect(input).toEqual(copy);
  });

  it('handles identical intervals', () => {
    expect(ivs(IntervalSet.normalize([{ start: 2, end: 5 }, { start: 2, end: 5 }]))).toEqual([
      { start: 2, end: 5 },
    ]);
  });
});

describe('length', () => {
  it('returns 0 for empty set', () => {
    expect(empty.length).toBe(0);
  });

  it('returns length of single interval', () => {
    expect(of(1, 5).length).toBe(4);
  });

  it('returns total length across multiple intervals', () => {
    expect(new IntervalSet([{ start: 0, end: 3 }, { start: 5, end: 8 }]).length).toBe(6);
  });

  it('handles width-1 interval', () => {
    expect(of(0, 1).length).toBe(1);
  });
});

describe('empty', () => {
  it('returns true for default-constructed set', () => {
    expect(empty.empty()).toBe(true);
  });

  it('returns false for non-empty set', () => {
    expect(of(1, 5).empty()).toBe(false);
  });

  it('returns true when subtraction removes everything', () => {
    expect(of(1, 5).subtraction(of(0, 10)).empty()).toBe(true);
  });

  it('returns true when subtracting identical intervals', () => {
    expect(of(3, 7).subtraction(of(3, 7)).empty()).toBe(true);
  });

  it('returns false when subtraction leaves a remainder', () => {
    expect(of(1, 10).subtraction(of(3, 7)).empty()).toBe(false);
  });

  it('returns true when intersection of disjoint intervals', () => {
    expect(of(1, 3).intersection(of(5, 7)).empty()).toBe(true);
  });

  it('returns true when intersection of adjacent intervals', () => {
    expect(of(1, 3).intersection(of(3, 5)).empty()).toBe(true);
  });

  it('returns false when intersection has overlap', () => {
    expect(of(1, 5).intersection(of(3, 7)).empty()).toBe(false);
  });
});

describe('algebraic properties', () => {
  const a = of(0, 10);
  const b = of(5, 15);
  const c = of(3, 8);

  it('union is commutative', () => {
    expect(ivs(a.union(b))).toEqual(ivs(b.union(a)));
  });

  it('intersection is commutative', () => {
    expect(ivs(a.intersection(b))).toEqual(ivs(b.intersection(a)));
  });

  it('a - b + (a & b) = a', () => {
    expect(ivs(a.subtraction(b).union(a.intersection(b)))).toEqual(ivs(a));
  });

  it('(a | b) - b = a - b', () => {
    expect(ivs(a.union(b).subtraction(b))).toEqual(ivs(a.subtraction(b)));
  });

  it('union is associative', () => {
    expect(ivs(a.union(b).union(c))).toEqual(ivs(a.union(b.union(c))));
  });

  it('intersection is associative', () => {
    expect(ivs(a.intersection(b).intersection(c))).toEqual(ivs(a.intersection(b.intersection(c))));
  });

  it('a & a = a (idempotent)', () => {
    expect(ivs(a.intersection(a))).toEqual(ivs(a));
  });

  it('a | a = a (idempotent)', () => {
    expect(ivs(a.union(a))).toEqual(ivs(a));
  });

  it('a - a = empty', () => {
    expect(ivs(a.subtraction(a))).toEqual([]);
  });
});
