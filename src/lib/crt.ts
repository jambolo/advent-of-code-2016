// Implements the Chinese Remainder Theorem.
//
// Find the smallest x such that:
// x ≡ a_1 (mod n_1)
// x ≡ a_2 (mod n_2)
// ...
// x ≡ a_k (mod n_k)
//
// where the n_i are > 1 and are pairwise coprime integers, and a_i are non-negative integers.
// The solution is unique modulo L = lcm(n_1, n_2, ..., n_k).

// Equation form: x ≡ a (mod n)
export type Equation = {a: number, n: number};

// Finds the solution by a sieve method. This is not the most efficient way to solve the problem, but it is simple to implement
// and works well for small inputs.
//
// Note: all n_i are assumed to be unique prime numbers, so we don't need to compute LCM.
// Note: all input equations are assumed to be valid (i.e., a_i < n_i and n_i > 1).
export function solveBySieve(equations: Equation[]): number {
    // Sort equations by n in descending order to optimize the sieve.
    equations.sort((e1, e2) => e2.n - e1.n);

    const period = equations.reduce((acc, eq) => acc * eq.n, 1);

    // Start with the first equation and find the solution set for it in order to populate the sieve.
    let candidates: number[] = [];
    for (let x = equations[0].a; x < period; x += equations[0].n) {
        candidates.push(x);
    }

    // for each of the remaining equations, filter the candidates to those that satisfy the equation.
    for (let i = 1; i < equations.length; i++) {
        const eq = equations[i];
        candidates = candidates.filter(x => x % eq.n === eq.a);
    }

    return candidates[0];
}