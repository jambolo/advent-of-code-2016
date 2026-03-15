export interface Result {
  answer: number | string;
}

function isTrap(left: string, center: string, right: string): boolean {
  return (left === '^' && center === '^' && right !== '^') ||
         (left !== '^' && center === '^' && right === '^') ||
         (left === '^' && center !== '^' && right !== '^') ||
         (left !== '^' && center !== '^' && right === '^');
}

function nextRow(row: string) : string {
  let result = '';
  for (let i = 0; i < row.length; i++) {
    const left = row[i - 1] ?? '.';
    const center = row[i];
    const right = row[i + 1] ?? '.';
    result += isTrap(left, center, right) ? '^' : '.';
  }

  return result;
}

function countSafeTiles(row: string): number {
  return [...row].filter(tile => tile !== '^').length;
}

export function solvePart1(input: string): Result | null {
  const N = 40;
  let row = input;
  let total = countSafeTiles(row);
  for (let i = 1; i < N; i++) {
    row = nextRow(row);
    let count = countSafeTiles(row);
    total += count;
  }
  return { answer: total };
}

export function solvePart2(input: string): Result | null {
  const N = 400000;
  let row = input;
  let total = countSafeTiles(row);
  for (let i = 1; i < N; i++) {
    row = nextRow(row);
    total += countSafeTiles(row);
  }
  return { answer: total };
}
