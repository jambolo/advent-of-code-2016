import util from "node:util";

export interface Result {
  answer: number | string;
}

export interface Operation {
  type: 'rect' | 'rotateRow' | 'rotateColumn';
  params: number[];
}

class Screen {
  private display: boolean[][];

  constructor(public width: number, public height: number) {
    this.display = Array.from({ length: height }, () => Array(width).fill(false));
  }

  rect(width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.display[y][x] = true;
      }
    }
  }

  rotateRow(y: number, shift: number): void {
    const row = this.display[y];
    const newRow = row.slice(-shift).concat(row.slice(0, -shift));
    this.display[y] = newRow;
  }

  rotateColumn(x: number, shift: number): void {
    const column = this.display.map(row => row[x]);
    const newColumn = column.slice(-shift).concat(column.slice(0, -shift));
    for (let y = 0; y < this.height; y++) {
      this.display[y][x] = newColumn[y];
    }
  }

  litPixelsCount(): number {
    return this.display.reduce((c1, row) => c1 + row.reduce((c0, p) => c0 + (p ? 1 : 0), 0), 0);
  }

  [util.inspect.custom](_depth: number, _options: util.InspectOptionsStylized) {
    return this.display.map(row => row.map(p => (p ? '##' : '  ')).join('')).join('\n');
  }
}

export function solvePart1(operations: Operation[]): Result | null {
  const screen = new Screen(50, 6);
  
  for (const o of operations) {
    switch (o.type) {
      case 'rect':
        screen.rect(o.params[0], o.params[1]);
        break;
      case 'rotateRow':
        screen.rotateRow(o.params[0], o.params[1]);
        break;
      case 'rotateColumn':
        screen.rotateColumn(o.params[0], o.params[1]);
        break;
    }
  }

  return { answer: screen.litPixelsCount() };
}

export function solvePart2(operations: Operation[]): Result | null {
  const screen = new Screen(50, 6);
  
  for (const o of operations) {
    switch (o.type) {
      case 'rect':
        screen.rect(o.params[0], o.params[1]);
        break;
      case 'rotateRow':
        screen.rotateRow(o.params[0], o.params[1]);
        break;
      case 'rotateColumn':
        screen.rotateColumn(o.params[0], o.params[1]);
        break;
    }
  }

  console.log(screen);

  return null;
}
