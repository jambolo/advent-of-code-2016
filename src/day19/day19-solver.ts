import { Deque } from "../lib/utils";

export interface Result {
  answer: number | string;
}

export function solvePart1(input: number): Result | null {
// Create a list of numbers from 1 to count
  let numbers = Array.from({ length: input }, (_, i) => i + 1);
  let parity = 0; // Start with even index (0-based)
  while (numbers.length > 1) {
    // If the current parity is even and the length is even, the tne next parity is even
    // if the current parity is even and the length is odd, next parity is odd
    // If the current parity is odd and the length is even, the next parity is odd
    // if the current parity is odd and the length is odd, next parity is even
    let nextParity = parity ^ (numbers.length % 2);

    // Remove every other number depending on the parity
    numbers = numbers.filter((_, index) => index % 2 === parity);
    parity = nextParity;
  }
  return { answer: numbers[0] };
}

export function solvePart2(input: number): Result | null {
  let mid = Math.floor((input + 1) / 2);
  let right = new Deque<number>(Array.from({ length: mid }, (_, i) => i + 1));
  let left = new Deque<number>(Array.from({ length: input - mid }, (_, i) => mid + i + 1));
  
  //console.log("Initial state:", right, left);
  while (left.length > 0 && right.length > 0) {
    // Remove the elf across from the first elf in the right deque
    if (right.length > left.length) {
      right.popBack();
    } else {
      left.popFront();
    }
    
    // Move the first elf in the right deque to the end of the left deque
    left.pushBack(right.popFront()!);
    // Rebalance - if the right deque is smaller than the left deque, move the first elf in the left deque to the end of the right deque
    if (right.length < left.length) {
      right.pushBack(left.popFront()!);
    }
    //console.log("Current state:", right, left);
  }

  return { answer: left.length > 0 ? left.popFront()! : right.popFront()! };
}
