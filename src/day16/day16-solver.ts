export interface Result {
  answer: number | string;
}

function expand(data: number[], size: number): number[] {
  while (data.length < size) {
    const reversed = data.slice().reverse().map((bit: number) => 1 - bit);
    data = [...data, 0, ...reversed];
  }
  return data;
}

function checksum(data: number[], size: number): number[] {
  let result = data.slice(0, size);
  while (result.length % 2 === 0) {
    result = Array.from({ length: result.length / 2 }, (_, i) =>
      result[i * 2] === result[i * 2 + 1] ? 1 : 0
    );
  }
  return result;
}

function solve(input: string, diskSize: number): Result {
  const data = [...input].map(Number);
  return { answer: checksum(expand(data, diskSize), diskSize).join('') };
}

export function solvePart1(input: string): Result | null {
  const data = [...input].map(Number);
  const SIZE = 272;
  const expanded = expand(data, SIZE);
  let c = checksum(expanded, SIZE);
  return { answer: c.join('') };
}

export function solvePart2(input: string): Result | null {
  const data = [...input].map(Number);
  const SIZE = 35651584;
  const expanded = expand(data, SIZE);
  let c = checksum(expanded, SIZE);
  return { answer: c.join('') };
}
