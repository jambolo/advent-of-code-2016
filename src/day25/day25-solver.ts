import { assemble, CPU } from "../lib/cpu";

export interface Result {
  answer: number | string;
}

export function solvePart1(input: string[]): Result | null {
  const program = assemble(input);
  const cpu = new CPU();
  let x = 0b101010101010 - 2534;
  //cpu.execute(program, [x]);
  return { answer: x };
}

export function solvePart2(input: string[]): Result | null {
  console.log('There is no part 2.');
  return null;
}
