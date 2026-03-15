// Interval set operations

// Half-open interval [start, end)
export interface Interval {
  start: number;
  end: number;
}

// Sorted, disjoint, normalized set of half-open intervals.
export class IntervalSet {
  constructor(readonly intervals: Interval[] = []) {}

  static of(start: number, end: number): IntervalSet {
    return new IntervalSet(start < end ? [{ start, end }] : []);
  }

  // Merges overlapping/adjacent intervals into a normalized set.
  static normalize(intervals: Interval[]): IntervalSet {
    const result: Interval[] = [];
    for (const iv of intervals) append(result, iv);
    return new IntervalSet(result);
  }

  empty(): boolean {
    return this.intervals.length === 0;
  }

  get length(): number {
    return this.intervals.reduce((sum, { start, end }) => sum + end - start, 0);
  }

  union(other: IntervalSet): IntervalSet {
    const [a, b] = [this.intervals, other.intervals];
    if (!a.length) return other;
    if (!b.length) return this;

    const result: Interval[] = [];
    let i = 0, j = 0;

    // Seed with the earlier interval, then merge the rest.
    result.push(a[0].start <= b[0].start ? a[i++] : b[j++]);
    while (i < a.length && j < b.length)
      append(result, a[i].start <= b[j].start ? a[i++] : b[j++]);
    while (i < a.length) append(result, a[i++]);
    while (j < b.length) append(result, b[j++]);

    return new IntervalSet(result);
  }

  intersection(other: IntervalSet): IntervalSet {
    const [a, b] = [this.intervals, other.intervals];
    const result: Interval[] = [];
    let i = 0, j = 0;

    while (i < a.length && j < b.length) {
      const start = Math.max(a[i].start, b[j].start);
      const end = Math.min(a[i].end, b[j].end);
      if (start < end) result.push({ start, end });
      a[i].end < b[j].end ? i++ : j++;
    }

    return new IntervalSet(result);
  }

  subtraction(other: IntervalSet): IntervalSet {
    const [a, b] = [this.intervals, other.intervals];
    const result: Interval[] = [];
    let j = 0;

    for (const iv of a) {
      let { start, end } = iv;
      while (j < b.length && b[j].end <= start) j++;
      for (let k = j; k < b.length && b[k].start < end; k++) {
        if (b[k].start > start) result.push({ start, end: b[k].start });
        start = Math.max(start, b[k].end);
      }
      if (start < end) result.push({ start, end });
    }

    return new IntervalSet(result);
  }
}

// Appends an interval, merging with the last element if overlapping/adjacent.
function append(set: Interval[], { start, end }: Interval): void {
  const last = set[set.length - 1];
  if (last && start <= last.end) {
    last.end = Math.max(last.end, end);
  } else {
    set.push({ start, end });
  }
}
