import { IntervalSet } from "../lib/intervals";

export interface Result {
  answer: number | string;
}

const FULL_RANGE = IntervalSet.of(0, 4294967296);

function applyBlackList(allowed: IntervalSet, ranges: { start: number; end: number; }[]) {
  for (const r of ranges) {
    allowed = allowed.subtraction(IntervalSet.of(r.start, r.end));
  }
  return allowed;
}

export function solvePart1(blackList: { start: number, end: number }[]): Result | null {
  let allowed = applyBlackList(FULL_RANGE, blackList);
  return !allowed.empty() ? { answer: allowed.intervals[0].start } : null;
}

export function solvePart2(blackList: { start: number, end: number }[]): Result | null {
  let allowed = applyBlackList(FULL_RANGE, blackList);
  return { answer: allowed.length };
}
