import { createHash } from 'node:crypto';

export interface Result {
  answer: number | string;
}

const doorId = 'ugkcyxxp'

function md5(s: string): string {
  return createHash('md5').update(s, 'utf8').digest('hex');
}

export function solvePart1(): Result | null {
  let count = 0;
  let password = '';
  let index = 0;
  while (count < 8) {
    let found = false;
    while (!found) {
      const indexString = index.toString();
      const hash = md5(doorId + indexString);
      if (hash.startsWith('00000')) {
        password += hash[5];
        count++;
        found = true;
      }
      index++;
    }
  }
  return { answer: password };
}

export function solvePart2(): Result | null {
  let count = 0;
  let index = 0;
  const password : (string | undefined)[] = Array(8).fill(undefined);
  while (count < 8) {
    const indexString = index.toString();
    const hash = md5(doorId + indexString);
    if (hash.startsWith('00000')) {
      let position = parseInt(hash[5], 16);
      let c = hash[6];
      if (position < 8 && password[position] === undefined) {
        password[position] = c;
        count++;
      }
    }
    index++;
  }
  return { answer: password.join('') };
}
