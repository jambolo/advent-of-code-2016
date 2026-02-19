import { createHash } from 'node:crypto';

export interface Result {
  answer: number | string;
}

function repeats3(s: string): string | null {
  for (let i = 0; i < s.length - 2; i++) {
    if (s[i] === s[i + 1] && s[i] === s[i + 2]) {
      return s[i];
    }
  }
  return null;
}

function repeats5(s: string): string[] {
  const repeats: string[] = [];
  for (let i = 0; i < s.length - 4; i++) {
    if (s[i] === s[i + 1] && s[i] === s[i + 2] && s[i] === s[i + 3] && s[i] === s[i + 4]) {
      repeats.push(s[i]);
    }
  }
  return repeats;
}

// Adds the hash to the lookahead, and if it has a 5-repeat, adds it to the fivers list.
function addToCaches(h: string, i: number, lookAhead: string[], fivers: { index: number; repeated: string[]; }[]): void {
  lookAhead.push(h);
  const repeated5 = repeats5(h);
  if (repeated5.length > 0) {
    fivers.push({ index: i, repeated: repeated5 });
    console.log('Fiver at index', i, ', hash=', h, 'repeated=', repeated5);
  }
}

// Generates a hash of the input + index, adds it to the lookahead, and if it has a 5-repeat, adds it to the fivers list.
function generateNextHash(i: number, input: string, lookAhead: string[], fivers: {index: number, repeated: string[]}[]): void {
  const h = createHash('md5').update(input + `${i}`, 'utf8').digest('hex');
  addToCaches(h, i, lookAhead, fivers);
}

// Generates a stretched hash of the input + index, adds it to the lookahead, and if it has a 5-repeat, adds it to the fivers
// list.
function generateNextStretchedHash(i: number, input: string, lookAhead: string[], fivers: {index: number, repeated: string[]}[]): void {
  let h = createHash('md5').update(input + `${i}`, 'utf8').digest('hex');
  for (let j = 0; j < 2016; j++) {
    h = createHash('md5').update(h, 'utf8').digest('hex');
  }
  addToCaches(h, i, lookAhead, fivers);
}

export function solvePart1(input: string): Result | null {
  const lookAhead: string[] = [];
  const fivers: {index: number, repeated: string[]}[] = [];

  // Generate the first 1000 hashes and fivers
  for (let i = 0; i < 1000; i++) {
    generateNextHash(i, input, lookAhead, fivers);
  }

  // Look for the 64th qualifying index.
  let count = 0;
  let index = 0;
  while (count < 64) {
    // Get the next hash
    const h = lookAhead.shift()!;

    // If the next fiver is this index, remove it. It is no longer one of the next 1000 hashes.
    if (fivers.length > 0 && fivers[0].index === index) {
      fivers.shift();
    }
  
    // Add the hash for index + 1000 to the lookahead and fivers
    generateNextHash(index + 1000, input, lookAhead, fivers);
    if (lookAhead.length !== 1000) {
      throw new Error("Lookahead is the wrong length: " + lookAhead.length);
    }

    const repeated = repeats3(h);
    if (repeated !== null) {
      // Check if any of the fivers have this repeated character
      const fiver = fivers.find(f => f.repeated.includes(repeated));
      if (fiver) {
        console.log(`${count + 1}.  index ${index}, hash ${h}, fiver ${fiver.index}`);
        count++;
      }
    }

    index++;
  }

  return { answer: index - 1 };
}

export function solvePart2(input: string): Result | null {
  const lookAhead: string[] = [];
  const fivers: {index: number, repeated: string[]}[] = [];

  // Generate the first 1000 hashes and fivers
  for (let i = 0; i < 1000; i++) {
    generateNextStretchedHash(i, input, lookAhead, fivers);
  }

  // Look for the 64th qualifying index.
  let count = 0;
  let index = 0;
  while (count < 64) {
    // Get the next hash
    const h = lookAhead.shift()!;

    // If the next fiver is this index, remove it. It is no longer one of the next 1000 hashes.
    if (fivers.length > 0 && fivers[0].index === index) {
      fivers.shift();
    }
  
    // Add the hash for index + 1000 to the lookahead and fivers
    generateNextStretchedHash(index + 1000, input, lookAhead, fivers);
    if (lookAhead.length !== 1000) {
      throw new Error("Lookahead is the wrong length: " + lookAhead.length);
    }

    const repeated = repeats3(h);
    if (repeated !== null) {
      // Check if any of the fivers have this repeated character
      const fiver = fivers.find(f => f.repeated.includes(repeated));
      if (fiver) {
        console.log(`${count + 1}.  index ${index}, hash ${h}, fiver ${fiver.index}`);
        count++;
      }
    }

    index++;
  }

  return { answer: index - 1 };
}
