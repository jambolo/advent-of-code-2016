import { stringify } from 'querystring';
import * as utils from '../lib/utils';

export interface Result {
  answer: number | string;
}

const markerRegex = /(\d+)x(\d+)/;

function decompressedLength(input: string, f: (input: string) => number): number {
  let remainder = input;
  let count = 0;
  while (remainder.length > 0) {
    if (remainder[0] === "(") {
      var marker: string;
      [marker, remainder] = utils.splitAt(remainder.slice(1), ")"); // skip the '('
      const match = markerRegex.exec(marker); // add the parentheses back for the regex
      if (match) {
        const charCount = Number(match[1]);
        const times = Number(match[2]);
        count += times * f(remainder.slice(1, charCount+1));
        remainder = remainder.slice(1 + charCount); // skip the ")" and repeated characters
      } else {
        throw new Error(`Invalid marker: ${marker}`);
      }
    } else {
      const nextMarker = remainder.indexOf("(");
      if (nextMarker === -1) {
        count += remainder.length;
        remainder = "";
      } else {
        count += nextMarker;
        remainder = remainder.slice(nextMarker);
      }
    }
  }
  return count;
}

function v1(input: string): number { return input.length; }
function v2(input: string): number { return decompressedLength(input, v2); }

export function solvePart1(input: string): Result | null {
  return { answer: decompressedLength(input, v1) };
}

export function solvePart2(input: string): Result | null {
  return { answer: decompressedLength(input, v2) };
}
