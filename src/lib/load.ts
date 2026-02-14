import fs from 'fs';

// Reads a file containing comma-separated numbers and returns them as an array.
export function commaSeparatedValues(path: string): string[] {
  return fs.readFileSync(path, 'utf-8').trim().split(',').map(value => value.trim());
}
