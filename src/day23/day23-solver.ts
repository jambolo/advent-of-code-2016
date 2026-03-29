import { CPU, assemble } from '../lib/cpu';

export interface Result {
  answer: number | string;
}

export function solvePart1(input: string[]): Result | null {
  const program = assemble(input);
  const cpu = new CPU();
  cpu.execute(program, [7]);
  return { answer: cpu.registers[0] };
}

export function solvePart2(input: string[]): Result | null {
  const program = assemble(input);
  const cpu = new CPU();
  cpu.execute(program, [12]);
  return { answer: cpu.registers[0] };
}
