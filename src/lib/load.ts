// Functions for loading input data from files.

import fs from 'fs';

// Reads a file containing comma-separated numbers and returns them as an array.
export function commaSeparatedValues(path: string): string[] {
  return fs.readFileSync(path, 'utf-8').trim().split(',').map(value => value.trim());
}

// Reads a file and returns lines as an array.
export function lines(path: string): string[] {
  return fs.readFileSync(path, 'utf-8').trim().split('\n');
}
