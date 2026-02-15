import commander from 'commander';

export function args(day: number): { part: string; path: string } {
  const dayStr = String(day).padStart(2, '0');
  const defaultPath = `./src/day${dayStr}/day${dayStr}-input.txt`;
  const program = new commander.Command();
  program
    .option('-p, --part <number>', 'part to solve', '1')
    .option('-i, --path <path>', 'input file path', defaultPath)
    .parse();
   const { part, path } = program.opts();
   return { part, path };
}

export function banner(day: number, part: string): void {
  console.log(`== Day ${day}, Part ${part} ==`);
}
