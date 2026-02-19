
export interface Result {
  answer: number | string;
}

enum Operation {
  CPY, // cpy x y copies x (either an integer or the value of a register) into register y.
  INC, // inc x increases the value of register x by one.
  DEC, // dec x decreases the value of register x by one.
  JNZ  // jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.
}


interface Instruction {
  opcode: Operation;
  registers: (number | null)[];
  literals: number[]
}

type Program = Instruction[];

class CPU {
  public registers: number[] = [0, 0, 0, 0]
  private program: Program = [];
  private pc: number = 0;

  operand(instruction: Instruction, i: number): number {
    const r = instruction.registers[i];
    return r !== null ? this.registers[r] : instruction.literals[i];
  }

  execute(program: Program): void {
    this.program = program;
    this.pc = 0;
    this.registers.fill(0);
    while (this.pc >= 0 && this.pc < this.program.length) {
      const instruction = this.program[this.pc];
      const currentPc = this.pc;
      switch (instruction.opcode) {
        case Operation.CPY: {
          const from = this.operand(instruction, 0);
          const to = instruction.registers[1]!;
          this.registers[to] = from;
          this.pc++;
          break;
        }
        case Operation.INC: {
          const register = instruction.registers[0]!;
          this.registers[register]++;
          this.pc++;
          break;
        }
        case Operation.DEC: {
          const register = instruction.registers[0]!;
          this.registers[register]--;
          this.pc++;
          break;
        }
        case Operation.JNZ: {
          const condition = this.operand(instruction, 0);
          const offset = this.operand(instruction, 1);
          this.pc += (condition !== 0) ? offset : 1;
          break;
        }
      }
    }
  }
}

function parseRegister(arg: string): number {
  if (arg.length === 1 && arg >= 'a' && arg <= 'd') {
    return arg.charCodeAt(0) - 'a'.charCodeAt(0);
  } else {
    throw new Error(`Invalid register: ${arg}`);
  }
}

function parseRegisterOrLiteral(arg: string): [number | null, number] {
  const value = Number(arg);
  return isNaN(value) ? [parseRegister(arg), 0] : [null, value];
}

function parseCpyArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  let registers: (number | null)[] = [null, null];
  let literals: number[] = [0, 0];
  if (args[0] === undefined || args[1] === undefined) throw new Error(`Missing operand`);
  [registers[0], literals[0]] = parseRegisterOrLiteral(args[0]);
  registers[1] = parseRegister(args[1]);
  return [registers, literals];
}

function parseIncDecArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  if (args[0] === undefined) throw new Error(`Missing operand`);
  const r0 = parseRegister(args[0]);
  return [[r0], []];
}

function parseJnzArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  let registers: (number | null)[] = [null, null];
  let literals: number[] = [0, 0];
  if (args[0] === undefined || args[1] === undefined) throw new Error(`Missing operand`);
  [registers[0], literals[0]] = parseRegisterOrLiteral(args[0]);
  [registers[1], literals[1]] = parseRegisterOrLiteral(args[1]);
  return [registers, literals];
}

function assemble(input: string[]): Program {
  const program: Program = [];
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    const [opcodeStr, ...args] = line.split(' ');
    let opcode: Operation;
    let registers: (number | null)[] = [];
    let literals: number[] = [];
    try {
      switch (opcodeStr) {
        case 'cpy': {
          opcode = Operation.CPY;
          [registers, literals] = parseCpyArgs(args);
          break;
        }
        case 'inc': {
          opcode = Operation.INC;
          [registers, literals] = parseIncDecArgs(args);
          break;
        }
        case 'dec': {
          opcode = Operation.DEC;
          [registers, literals] = parseIncDecArgs(args);
          break;
        }
        case 'jnz': {
          opcode = Operation.JNZ;
          [registers, literals] = parseJnzArgs(args);
          break;
        }
        default: throw new Error(`Unknown opcode: ${opcodeStr}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`${msg}\n  at line ${i + 1}: ${line}`);
    }
    program.push({ opcode, registers, literals });
  }
  return program;
}

export function solvePart1(input: string[]): Result | null {
  const cpu = new CPU();
  const program = assemble(input);
  cpu.execute(program);
  return { answer: cpu.registers[0] };
}

export function solvePart2(input: string[]): Result | null {
  const cpu = new CPU();
  // For part 2, initialize register c to 1 before executing the program.
  const initializeC: Instruction = { opcode: Operation.CPY, registers: [null, 2], literals: [1, 0] };
  const program = [initializeC].concat(assemble(input));
  cpu.execute(program);
  return { answer: cpu.registers[0] };
}
