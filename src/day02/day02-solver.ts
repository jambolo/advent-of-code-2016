export interface Result {
  answer: number | string;
}

export function solvePart1(input: string[]): Result | null {
  const keypad: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];
  let x = 1;
  let y = 1;
  let code = '';
  for (const line of input) {
    for (const movement of line) {
      if (movement === 'U') {
        y = Math.max(0, y - 1);
      } else if (movement === 'D') {
        y = Math.min(2, y + 1);
      } else if (movement === 'L') {
        x = Math.max(0, x - 1);
      } else if (movement === 'R') {
        x = Math.min(2, x + 1);
      }
    }
    code += keypad[y][x];
  }
  return { answer: code };
}

export function solvePart2(input: string[]): Result | null {
  const keypad: string[][] = [
    ['',   '', '1',  '',  ''],
    ['',  '2', '3', '4',  ''],
    ['5', '6', '7', '8', '9'],
    ['',  'A', 'B', 'C',  ''],
    ['',   '', 'D',  '',  ''],
  ];
  let x = 0;
  let y = 2;
  let code = '';
  for (const line of input) {
    for (const movement of line) {
      let new_x = x;
      let new_y = y;
      if (movement === 'U') {
        new_y = Math.max(0, new_y - 1);
      } else if (movement === 'D') {
        new_y = Math.min(4, new_y + 1);
      } else if (movement === 'L') {
        new_x = Math.max(0, new_x - 1);
      } else if (movement === 'R') {
        new_x = Math.min(4, new_x + 1);
      }
      if (keypad[new_y][new_x] !== '') {
        x = new_x;
        y = new_y;
      }
    }
    code += keypad[y][x];
  }
  return { answer: code };
}
