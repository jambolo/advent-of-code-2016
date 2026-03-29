import { CPU, assemble, Operation, Instruction } from '../lib/cpu';

export interface Result {
  answer: number | string;
}


export function solvePart1(input: string[]): Result | null {
  const cpu = new CPU();
  const program = assemble(input);
  cpu.execute(program);
  return { answer: cpu.registers[0] };
}

export function solvePart2(input: string[]): Result | null {
  const cpu = new CPU();
  const program = assemble(input);
  // For part 2, initialize register c to 1 before executing the program.
  cpu.execute(program, [null, null, 1]);
  return { answer: cpu.registers[0] };
}
