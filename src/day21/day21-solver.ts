export interface Result {
  answer: number | string;
}

// Operations
// swap position `i` with position `j` means that the letters at indexes `i` and `j` (counting from 0) should be swapped.
function swapIndex(s: string, i: number, j: number): string {
  if (i > j) {
    [i, j] = [j, i]
  }
  return s.slice(0, i) + s[j] + s.slice(i + 1, j) + s[i] + s.slice(j + 1);
}

// swap letter `x` with letter `y` means that the letters `x` and `y` should be swapped (regardless of where they appear in the string).
function swapLetters(s: string, x: string, y: string): string {
  const i = s.indexOf(x);
  const j = s.indexOf(y);
  return swapIndex(s, i, j)
}

// rotate left/right `n` steps means that the whole string should be rotated; for example, one right rotation would turn "abcd"
// into "dabc".
function rotateLeft(s: string, n: number): string {
  n = n % s.length;
  if (n < 0) {
    n += s.length;
  }
  if (n === 0) {
    return s;
  }
  return s.slice(n) + s.slice(0, n);
}

// rotate left/right `n` steps means that the whole string should be rotated; for example, one right rotation would turn "abcd"
// into "dabc".
function rotateRight(s: string, n: number): string {
  n = n % s.length;
  if (n < 0) {
    n += s.length;
  }
  if (n === 0) {
    return s;
  }
  return s.slice(-n) + s.slice(0, -n);
}

// rotate based on position of letter `x` means that the whole string should be rotated to the right based on the index of
// letter `x` (counting from 0) as determined before this instruction does any rotations. Once the index is determined, rotate
//  the string to the right one time, plus a number of times equal to that index, plus one additional time if the index was at
// least 4.
function rotateLetterPlus4(s: string, x: string): string {
  const i = s.indexOf(x);
  const n = (1 + i + (i >= 4 ? 1 : 0));
  return rotateRight(s, n);
}

// reverse positions `x` through `y` means that the span of letters at indexes `x` through `y` (including the letters at `x` and `y`)
// should be reversed in order.
function reverseLetterRange(s: string, x: number, y: number): string {
  if (x > y) {
    [x, y] = [y, x]
  }
  const reversed = [...s.slice(x, y + 1)].reverse().join("");
  return s.slice(0, x) + reversed + s.slice(y + 1);
}

// move position `i` to position `j` means that the letter which is at index `i` should be removed from the string, then inserted such that it ends up at index `j`.
function moveIndex(s: string, i: number, j: number): string {
  const ch = s[i];
  if (i < j) {
    return s.slice(0, i) + s.slice(i + 1, j + 1) + ch + s.slice(j + 1);
  } else {
    return s.slice(0, j) + ch + s.slice(j, i) + s.slice(i + 1);
  }
}

const RE_MOVE_INDEX = /^move position (\d+) to position (\d+)/;
const RE_REVERSE_LETTER_RANGE = /^reverse positions (\d+) through (\d+)/;
const RE_ROTATE_LETTER_PLUS_4 = /^rotate based on position of letter (\w)/;
const RE_ROTATE_LEFT = /^rotate left (\d+)/;
const RE_ROTATE_RIGHT = /^rotate right (\d+)/;
const RE_SWAP_LETTERS = /^swap letter (\w) with letter (\w)/;
const RE_SWAP_INDEX = /^swap position (\d+) with position (\d+)/;

function executeOperationPart1(operation: string, s: string): string {
  let m: RegExpMatchArray | null;
  
  m = operation.match(RE_MOVE_INDEX);
  if (m) return moveIndex(s, Number(m[1]), Number(m[2]));
  
  m = operation.match(RE_REVERSE_LETTER_RANGE);
  if (m) return reverseLetterRange(s, Number(m[1]), Number(m[2]));
  
  m = operation.match(RE_ROTATE_LETTER_PLUS_4);
  if (m) return rotateLetterPlus4(s, m[1]);
  
  m = operation.match(RE_ROTATE_LEFT);
  if (m) return rotateLeft(s, Number(m[1]));

  m = operation.match(RE_ROTATE_RIGHT);
  if (m) return rotateRight(s, Number(m[1]));
  
  m = operation.match(RE_SWAP_LETTERS);
  if (m) return swapLetters(s, m[1], m[2]);
  
  m = operation.match(RE_SWAP_INDEX);
  if (m) return swapIndex(s, Number(m[1]), Number(m[2]));

  throw new Error(`Unknown operation: ${operation}`);
}

export function solvePart1(input: string[]): Result | null {
  let s = "abcdefgh"
  for (const line of input) {
    s = executeOperationPart1(line, s);
  }
  return { answer: s };
}

// Undo Operations
function undoSwapIndex(s: string, i: number, j: number): string {
  return swapIndex(s, i, j)
}

function undoSwapLetters(s: string, x: string, y: string): string {
  return swapLetters(s, x, y)
}

function undoRotateLeft(s: string, n: number): string {
  return rotateRight(s, n);
}

function undoRotateRight(s: string, n: number): string {
  return rotateLeft(s, n);
}

function undoRotateLetterPlus4(s: string, x: string): string {
  // Here are the rotation amounts based on the original index of the letter:
  // index:          0 1 2 3 4 5 6 7  Original index of letter
  // rotation:       1 2 3 4 6 7 0 1  Amount to rotate right based on original index
  // rotated index:  1 3 5 7 2 4 6 0  Resulting index of letter after rotation
  // unmap:          7 0 4 1 5 2 6 3  Mapping from resulting index back to original index
  // undo rotation:  1 1 6 2 7 3 0 4  Amount to rotate left to undo the rotation based on the resulting index 
  const undo: number[] = [1, 1, 6, 2, 7, 3, 0, 4];
  const i = s.indexOf(x);
  const n = undo[i];
  return rotateLeft(s, n);
}

function undoReverseLetterRange(s: string, x: number, y: number): string {
  return reverseLetterRange(s, x, y);
}

function undoMoveIndex(s: string, i: number, j: number): string {
  return moveIndex(s, j, i);
}

function executeOperationPart2(operation: string, s: string): string {
  let m: RegExpMatchArray | null;
  m = operation.match(RE_MOVE_INDEX);
  if (m) return undoMoveIndex(s, Number(m[1]), Number(m[2]));
  
  m = operation.match(RE_REVERSE_LETTER_RANGE);
  if (m) return undoReverseLetterRange(s, Number(m[1]), Number(m[2]));
  
  m = operation.match(RE_ROTATE_LETTER_PLUS_4);
  if (m)  return undoRotateLetterPlus4(s, m[1]);
  
  m = operation.match(RE_ROTATE_LEFT);
  if (m) return undoRotateLeft(s, Number(m[1]));
  
  m = operation.match(RE_ROTATE_RIGHT);
  if (m) return undoRotateRight(s, Number(m[1]));
  
  m = operation.match(RE_SWAP_LETTERS);
  if (m) return undoSwapLetters(s, m[1], m[2]);
  
  m = operation.match(RE_SWAP_INDEX);
  if (m) return undoSwapIndex(s, Number(m[1]), Number(m[2]));

  throw new Error(`Unknown operation: ${operation}`);
}

export function solvePart2(input: string[]): Result | null {
  let s = "fbgdceah"
  const reversed = [...input].reverse()
  for (const line of reversed) {
    s = executeOperationPart2(line, s);
  }
  return { answer: s };
}
