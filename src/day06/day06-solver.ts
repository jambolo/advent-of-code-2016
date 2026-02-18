import * as utils from '../lib/utils';

export interface Result {
  answer: number | string;
}

function decode(messages: string[], pick: (entries: [string, number][]) => [string, number]): string {
  const picked = Array.from({ length: messages[0].length }, (_, i) => {
    const counts = utils.mapCounts(messages.map(m => m[i]));
    return pick([...counts])[0];
  });
  return picked.join('');
}

export function solvePart1(messages: string[]): Result {
  const result = decode(messages, utils.maxEntryByValue);
  return { answer: result };
}

export function solvePart2(messages: string[]): Result {
  const result = decode(messages, utils.minEntryByValue);
  return { answer: result };
}
