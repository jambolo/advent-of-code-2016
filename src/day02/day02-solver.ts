export interface Result {
  answer: number | string;
}

function execute(keypad: string[][], line: string, x0: number, y0: number): [number, number] {
  const width = keypad[0].length;
  const height = keypad.length;
  return [...line].reduce(([x, y], movement) => {
    let new_x = x;
    let new_y = y;
    switch (movement) {
      case 'U': new_y = Math.max(0, y - 1); break;
      case 'D': new_y = Math.min(height-1, y + 1); break;
      case 'L': new_x = Math.max(0, x - 1); break;
      case 'R': new_x = Math.min(width-1, x + 1); break;
      default: throw new Error(`Invalid movement: ${movement}`);
    }
    return (keypad[new_y][new_x] !== '') ? [new_x, new_y] : [x, y];
  }, [x0, y0]);
}

export function solvePart1(input: string[]): Result | null {
  const keypad: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];
  let code = '';
  let x = 1;
  let y = 1;
  for (const line of input) {
    [x, y] = execute(keypad, line, x, y);
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
    [x, y] = execute(keypad, line, x, y);
    code += keypad[y][x];
  }
  return { answer: code };
}
