export interface Result {
  answer: number | string;
}

function parseRoom(line: string): { name: string; sectorId: number; checksum: string } {
  const match = line.match(/^([a-z-]+)-(\d+)\[([a-z]+)\]$/);
  if (!match) {
    throw new Error(`Invalid room format: ${line}`);
  }
  return {
    name: match[1],
    sectorId: parseInt(match[2], 10),
    checksum: match[3],
  };
}

function room_is_valid(name: string, checksum: string): boolean {
  // Record of the count of each letter in the name
  const counts: Record<string, number> = Object.create(null);

  // Count the occurrences of each letter in the name
  for (const char of name) {
    if (char !== '-') {
      counts[char] = (counts[char] ?? 0) + 1;
    }
  }

  // Sort the letters by frequency and then alphabetically
  const sorted = Object.entries(counts) // [ [k, v], ... ]
    .sort(([k0, v0], [k1, v1]) => {
      if (v1 !== v0) {
        return v1 - v0; // descending by value
      }
      return k0.localeCompare(k1); // ascending by key
    });

  // Get the top 5 letters
  const computed_checksum = sorted.slice(0, 5).map(([k]) => k).join('');

  return computed_checksum === checksum;
}

function decrypt_name(name: string, sectorId: number): string {
  const a_index = 'a'.charCodeAt(0);
  const m = 'z'.charCodeAt(0) - a_index + 1; // 26
  let result = '';
  for (const c of name) {
    if (c === '-') {
      result += ' ';
    } else {
      const shifted = ((c.charCodeAt(0) - a_index + sectorId) % m) + a_index;
      result += String.fromCharCode(shifted);
    }
  }
  return result;
}


export function solvePart1(input: string[]): Result | null {
  let sum = 0;

    // For each line
  for (const line of input) {
    const { name, sectorId, checksum } = parseRoom(line);
    const valid = room_is_valid(name, checksum);
    if (valid) {
      sum += sectorId;
    }
  }

  return { answer: sum };
}

export function solvePart2(input: string[]): Result | null {
  for (const line of input) {
    const { name, sectorId, checksum } = parseRoom(line);
    if (room_is_valid(name, checksum)) {
      const decrypted = decrypt_name(name, sectorId);
      if (decrypted.includes('northpole object storage')) { // found by inspection
        return { answer: sectorId };
      }
    }
  }
  return null;
}
