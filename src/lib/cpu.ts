export enum Operation {
  CPY, // cpy x y copies x (either an integer or the value of a register) into register y.
  INC, // inc x increases the value of register x by one.
  DEC, // dec x decreases the value of register x by one.
  JNZ, // jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.
  TGL, // tgl x alters the instruction x away. Altering it again reverts it back to the original instruction.
  ADD, // add x y adds the value of register x to register y.
  NOP, // A no-op instruction
  MUL, // mul x y multiplies the value of register y by the value of register x.
  OUT, // out x outputs the value of x (either an integer or the value of a register) to the console.
}


export interface Instruction {
  opcode: Operation;
  registers: (number | null)[];
  literals: number[]
}

export type Program = Instruction[];

function disassemble(instruction: Instruction): string {
  function operand(i: number) {
    const r = instruction.registers[i];
    return (r !== null) ? String.fromCharCode('a'.charCodeAt(0) + r) : instruction.literals[i].toString();
  }

  let s = Operation[instruction.opcode].toString();

  switch (instruction.opcode) {
    case Operation.CPY:
    case Operation.JNZ:
    case Operation.ADD:
    case Operation.MUL: {
      s += ' ' + operand(0);
      s += ' ' + operand(1);
      break;
    }
    case Operation.INC:
    case Operation.DEC:
    case Operation.TGL:
    case Operation.OUT: {
      s += ' ' + operand(0);
      break;
    }
    case Operation.NOP: {
      break;
    }
  }

  return s;
}
export class CPU {
  public registers: number[] = [0, 0, 0, 0]
  private program: Program = [];
  private pc: number = 0;
  private altered: boolean[] = [];

  operand(instruction: Instruction, i: number): number {
    const r = instruction.registers[i];
    return r !== null ? this.registers[r] : instruction.literals[i];
  }

  execute(program: Program, init?: (number | null)[]): void {
    this.program = program;
    this.pc = 0;
    this.registers.fill(0);
    if (init) {
      for (let i = 0; i < init.length && i < this.registers.length; i++) {
        if (init[i] !== null) this.registers[i] = init[i]!;
      }
    }
    this.altered = new Array(program.length).fill(false);

    while (this.pc >= 0 && this.pc < this.program.length) {
      const instruction = this.program[this.pc];
      const currentPc = this.pc;
      const isAltered = this.altered[currentPc];
//      console.log(`${currentPc}: ${disassemble(instruction)} [${this.registers}]${isAltered ? ' (altered)' : ''}`);
      switch (instruction.opcode) {
        case Operation.CPY: {
          if (isAltered) {
            // For two-argument instructions, jnz becomes cpy, and all other two-instructions become jnz.
            const condition = this.operand(instruction, 0);
            const offset = this.operand(instruction, 1);
            this.pc += (condition !== 0) ? offset : 1;
          } else {
            const from = this.operand(instruction, 0);
            const to = instruction.registers[1]!;
            this.registers[to] = from;
            this.pc++;
          }
          break;
        }
        case Operation.INC: {
          if (isAltered) {
            // For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
            const register = instruction.registers[0];
            if (register !== null) {
              this.registers[register]--;
            }
            this.pc++;
          } else {
            const register = instruction.registers[0]!;
            this.registers[register]++;
            this.pc++;
          }
          break;
        }
        case Operation.DEC: {
          if (isAltered) {
            // For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
            const register = instruction.registers[0];
            if (register !== null) {
              this.registers[register]++;
            }
            this.pc++;
          } else {
            const register = instruction.registers[0]!;
            this.registers[register]--;
            this.pc++;
          }
          break;
        }
        case Operation.JNZ: {
          if (isAltered) {
            // For two-argument instructions, jnz becomes cpy, and all other two-instructions become jnz.
            const from = this.operand(instruction, 0);
            const to = instruction.registers[1];
            if (to !== null) {
              this.registers[to] = from;
            }
            this.pc++;
          } else {
            const condition = this.operand(instruction, 0);
            const offset = this.operand(instruction, 1);
            this.pc += (condition !== 0) ? offset : 1;
          }
          break;
        }
        case Operation.TGL: {
          if (isAltered) {
            // For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
            const register = instruction.registers[0];
            if (register !== null) {
              this.registers[register]++;
            }
            this.pc++;
          } else {
            const offset = this.operand(instruction, 0);
            const targetPc = currentPc + offset;
            if (targetPc >= 0 && targetPc < this.program.length) {
              this.altered[targetPc] = !this.altered[targetPc];
            }
            this.pc++;
          }
          break;
        }
        case Operation.ADD: {
          if (isAltered) {
            // This is a fake instruction that I use to speed up the program. It can't be altered
            throw new Error(`ADD instruction cannot be altered`);
          } else {
            const from = instruction.registers[0]!;
            const to = instruction.registers[1]!;
            this.registers[to] += this.registers[from];
            this.pc++;
          }
          break;
        }
        case Operation.NOP: {
          if (isAltered) {
            // This is a fake instruction that I use to speed up the program. It can't be altered
            throw new Error(`NOP instruction cannot be altered`);
          } else {
            this.pc++;
          }
          break;
        }
        case Operation.MUL: {
          if (isAltered) {
            // This is a fake instruction that I use to speed up the program. It can't be altered
            throw new Error(`MUL instruction cannot be altered`);
          } else {
            const from = instruction.registers[0]!;
            const to = instruction.registers[1]!;
            this.registers[to] *= this.registers[from];
            this.pc++;
          }
          break;
        }
        case Operation.OUT: {
          if (isAltered) {
            // For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
            const register = instruction.registers[0];
            if (register !== null) {
              this.registers[register]++;
            }
            this.pc++;
          } else {
            const value = this.operand(instruction, 0);
            console.log(`OUT: ${value}  # [${this.registers}]`);
            this.pc++;
          }
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

function parseTglArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  let register: (number | null) = null;
  let literal: number = 0;
  if (args[0] === undefined) throw new Error(`Missing operand`);
  [register, literal] = parseRegisterOrLiteral(args[0]);
  return [[register], [literal]];
}

function parseAddMulArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  let registers: (number | null)[] = [null, null];
  let literals: number[] = [0, 0];
  if (args[0] === undefined || args[1] === undefined) throw new Error(`Missing operand`);
  registers[0] = parseRegister(args[0]);
  registers[1] = parseRegister(args[1]);
  return [registers, literals];
}

function parseOutArgs(args:string[]): [ registers: (number | null)[], literals: number[] ] {
  if (args[0] === undefined) throw new Error(`Missing operand`);
  let registers: (number | null)[] = [null];
  let literals: number[] = [0];
  [registers[0], literals[0]] = parseRegisterOrLiteral(args[0]);
  return [registers, literals];
}


export function assemble(input: string[]): Program {
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
        case 'tgl': {
          opcode = Operation.TGL;
          [registers, literals] = parseTglArgs(args);
          break;
        }
        case 'add': {
          opcode = Operation.ADD;
          [registers, literals] = parseAddMulArgs(args);
          break;
        }
        case 'mul': {
          opcode = Operation.MUL;
          [registers, literals] = parseAddMulArgs(args);
          break;
        }
        case 'nop': {
          opcode = Operation.NOP;
          registers = [];
          literals = [];
          break;
        }
        case 'out': {
          opcode = Operation.OUT;
          [registers, literals] = parseOutArgs(args);
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
