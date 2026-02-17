export interface Result {
  answer: number | string;
}

function triangleIsValid(triangle: number[]): boolean {
  const [a, b, c] = triangle
  return a + b > c && b + c > a && c + a > b;
}

export function solvePart1(triangles: number[][]): Result | null {
  const count = triangles
    .filter(triangleIsValid)
    .length;
  return { answer: count };
}

export function solvePart2(triangles: number[][]): Result | null {
  let count = 0;
  for (let i = 0; i < triangles.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      const a = triangles[i + 0][j];
      const b = triangles[i + 1][j];
      const c = triangles[i + 2][j];
      if (triangleIsValid([a, b, c])) {
        count++;
      }
    }
  }
  return { answer: count };
}
