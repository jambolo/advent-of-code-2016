import * as crt from "../lib/crt";

export interface Result {
  answer: number | string;
}

export function solvePart1(input: number[][]): Result | null {
  // Adjust p0 for each disc to be the position of the disc when the ball reaches it if dropped at time=0.
  const discs = input.map(([n, p0], i) => ([n, (p0 + i + 1) % n]));

  // The equations for the solver are of the form x ≡ a (mod n), where a = -p0 (mod n).
  const equations: crt.Equation[] = discs.map(([n, p0]) => ({a: (n - p0) % n, n}));

  const result = crt.solveBySieve(equations);
  return { answer: result };
}

export function solvePart2(input: number[][]): Result | null {
  // Add an additional disc with 11 positions and starting at position 0.
  input.push([11, 0]);

  // Adjust p0 for each disc to be the position of the disc when the ball reaches it if dropped at time=0.
  const discs = input.map(([n, p0], i) => ([n, (p0 + i + 1) % n]));

  // The equations for the solver are of the form x ≡ a (mod n), where a = -p0 (mod n).
  const equations: crt.Equation[] = discs.map(([n, p0]) => ({a: (n - p0) % n, n}));

  const result = crt.solveBySieve(equations);
  return { answer: result };
}
