import { describe, it, expect } from 'vitest';
import { solveBySieve, Equation } from './crt';

describe('solveBySieve', () => {
  it('solves a single equation', () => {
    expect(solveBySieve([{ a: 2, n: 5 }])).toBe(2);
  });

  it('solves two equations', () => {
    // x ≡ 2 (mod 3), x ≡ 3 (mod 5) → x = 8
    expect(solveBySieve([{ a: 2, n: 3 }, { a: 3, n: 5 }])).toBe(8);
  });

  it('solves the classic CRT example (mod 3, 5, 7)', () => {
    // x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) → x = 23
    const eqs: Equation[] = [
      { a: 2, n: 3 },
      { a: 3, n: 5 },
      { a: 2, n: 7 },
    ];
    expect(solveBySieve(eqs)).toBe(23);
  });

  it('solves when all remainders are zero', () => {
    // x ≡ 0 (mod 2), x ≡ 0 (mod 3), x ≡ 0 (mod 5) → x = 0
    const eqs: Equation[] = [
      { a: 0, n: 2 },
      { a: 0, n: 3 },
      { a: 0, n: 5 },
    ];
    expect(solveBySieve(eqs)).toBe(0);
  });

  it('solves when remainder is n-1 for all equations', () => {
    // x ≡ 2 (mod 3), x ≡ 4 (mod 5), x ≡ 6 (mod 7) → x = 104
    // (since 105 ≡ 0 mod each, x = 105 - 1 = 104)
    const eqs: Equation[] = [
      { a: 2, n: 3 },
      { a: 4, n: 5 },
      { a: 6, n: 7 },
    ];
    expect(solveBySieve(eqs)).toBe(104);
  });

  it('solves with larger primes', () => {
    // x ≡ 1 (mod 11), x ≡ 2 (mod 13) → x = 67
    const eqs: Equation[] = [
      { a: 1, n: 11 },
      { a: 2, n: 13 },
    ];
    expect(solveBySieve(eqs)).toBe(67);
  });

  it('handles equations given in any order', () => {
    const eqs1: Equation[] = [
      { a: 2, n: 3 },
      { a: 3, n: 5 },
      { a: 2, n: 7 },
    ];
    const eqs2: Equation[] = [
      { a: 2, n: 7 },
      { a: 2, n: 3 },
      { a: 3, n: 5 },
    ];
    expect(solveBySieve(eqs1)).toBe(solveBySieve(eqs2));
  });

  it('solves the Advent of Code Day 15 style problem', () => {
    // Disc 1: 5 positions, starts at 4 → x ≡ 0 (mod 5) where offset = (4+1) mod 5 = 0
    // Disc 2: 2 positions, starts at 1 → x ≡ 1 (mod 2) where offset = (1+2) mod 2 = 1
    // x + 1 + 4 ≡ 0 (mod 5) → x ≡ 0 (mod 5)
    // x + 2 + 1 ≡ 0 (mod 2) → x ≡ 1 (mod 2)
    const eqs: Equation[] = [
      { a: 0, n: 5 },
      { a: 1, n: 2 },
    ];
    expect(solveBySieve(eqs)).toBe(5);
  });

  it('verifies the solution satisfies all equations', () => {
    const eqs: Equation[] = [
      { a: 1, n: 2 },
      { a: 2, n: 3 },
      { a: 3, n: 5 },
      { a: 4, n: 7 },
    ];
    const x = solveBySieve(eqs);
    for (const eq of eqs) {
      expect(x % eq.n).toBe(eq.a);
    }
  });

  it('returns the smallest non-negative solution', () => {
    const eqs: Equation[] = [
      { a: 1, n: 3 },
      { a: 1, n: 5 },
    ];
    const x = solveBySieve(eqs);
    expect(x).toBe(1);
    expect(x).toBeLessThan(3 * 5);
  });
});
