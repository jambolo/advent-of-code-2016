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

function roomIsValid(name: string, checksum: string): boolean {

  // Count the occurrences of each letter in the name
  const counts = new Map<string, number>();
  for (const char of name) if (char !== '-') counts.set(char, (counts.get(char) ?? 0) + 1);

  // Compute the checksum
  const computed_checksum = [...counts]
    .sort(([k0, v0], [k1, v1]) => v1 - v0 || k0.localeCompare(k1)) // ascending by key
    .slice(0, 5).map(([k]) => k)
    .join('');

  // Check if it matches the given checksum
  return computed_checksum === checksum;
}

function decryptedName(name: string, sectorId: number): string {
  const a = 'a'.charCodeAt(0);
  const m = 'z'.charCodeAt(0) - a + 1; // 26

  const decoded = Array.from(name, c =>
    c === '-' ? ' ' : String.fromCharCode(((c.charCodeAt(0) - a + sectorId) % m) + a)
  );

  return decoded.join('');
}


export function solvePart1(input: string[]): Result | null {
  const sum = input
    .map(parseRoom)
    .filter(r => roomIsValid(r.name, r.checksum))
    .reduce((acc, r) => acc + r.sectorId, 0);

  return { answer: sum };
}

export function solvePart2(input: string[]): Result | null {
  const sectorId = input
    .map(parseRoom)
    .filter(r => roomIsValid(r.name, r.checksum))
    .map(r => ({ ...r, decrypted: decryptedName(r.name, r.sectorId) }))
    .find(r => r.decrypted.includes('northpole object storage'))?.sectorId;
  return sectorId === undefined ? null : { answer: sectorId };
}
