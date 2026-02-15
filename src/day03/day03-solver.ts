export interface Result {
  answer: number | string;
}

export function solvePart1(triangles: number[][]): Result | null {
  let count = 0;
  for (const triangle of triangles) {
    if (triangle[0] + triangle[1] > triangle[2] &&
        triangle[1] + triangle[2] > triangle[0] &&
        triangle[2] + triangle[0] > triangle[1]) {
      count++;
    }
  }
  return { answer: count };
}

export function solvePart2(triangles: number[][]): Result | null {
  let count = 0;
// iterate over the triangles in groups of three
  for (let i = 0; i < triangles.length; i += 3) {
    if (i + 2 >= triangles.length) {
      throw new Error("Not enough triangles left for a group of three");
    }
    // check the three columns of the current group of three triangles
    for (let j = 0; j < 3; j++) {
      const a = triangles[i][j];
      const b = triangles[i + 1][j];
      const c = triangles[i + 2][j];
      if (a + b > c && b + c > a && c + a > b) {
        count++;
      }
    }
  }
  return { answer: count };
}
