
export interface Result {
  answer: number | string;
}

function minEntryByValue(counts: [string, number][]): [string, number] { return counts.reduce((a, b) => a[1] < b[1] ? a : b); }
function maxEntryByValue(counts: [string, number][]): [string, number] { return counts.reduce((a, b) => a[1] > b[1] ? a : b); }

function decode(messages: string[], pick: (entries: [string, number][]) => [string, number]): string {
  const picked = Array.from({ length: messages[0].length }, (_, i) => {
    const counts = new Map<string, number>();
    for (const m of messages) counts.set(m[i], (counts.get(m[i]) ?? 0) + 1);
    return pick([...counts])[0];
  });
  return picked.join('');
}

export function solvePart1(messages: string[]): Result {
  const result = decode(messages, maxEntryByValue);
  return { answer: result };
}

export function solvePart2(messages: string[]): Result {
  const result = decode(messages, minEntryByValue);
  return { answer: result };
}
