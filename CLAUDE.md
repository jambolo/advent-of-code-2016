# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Advent of Code 2016 solutions in TypeScript. Each day's solution follows this pattern:

```
src/
├── lib/              # Shared utilities (import with '../lib/...')
└── dayXX/
    ├── dayXX-solver.ts    # Logic only, exports solvePart1() and solvePart2()
    ├── index.ts           # CLI entry point (uses commander)
    └── dayXX-input.txt    # Puzzle input
```

**Critical**: Solver logic MUST be separated from I/O. Solvers export per-part functions:

```typescript
interface Result {
  answer: number | string;
}

function solvePart1(input: ...): Result | null { ... }
function solvePart2(input: ...): Result | null { ... }
```

Return `null` when no solution is found.

## Commands

Run a specific day (defaults to part 1):

```bash
pnpm day01                    # part 1
pnpm day01 -- -p 2            # part 2
pnpm day01 -- -i other.txt    # custom input
```

Add new day script to `package.json`:

```json
"dayXX": "tsx src/dayXX/index.ts"
```

Testing:

```bash
pnpm test           # watch mode
pnpm test:run       # single run
```

Build:

```bash
pnpm build          # outputs to dist/
```

## Adding a New Day

Replace `XX` with the zero-padded day number (e.g., `03`) and `N` with the unpadded number (e.g., `3`).

### 1. Create `src/dayXX/` directory

### 2. Create empty `src/dayXX/dayXX-input.txt`

### 3. Create `src/dayXX/dayXX-solver.ts`

```typescript
export interface Result {
  answer: number | string;
}

export function solvePart1(input: string[]): Result | null {
  return null;
}

export function solvePart2(input: string[]): Result | null {
  return null;
}
```

- Input type is `string[]`.
- Return `{ answer }` on success, `null` if no solution found.

### 4. Create `src/dayXX/index.ts`

```typescript
import commander from 'commander';

import { solvePart1, solvePart2 } from './dayXX-solver';
import * as load from '../lib/load';

const day = N;
const program = new commander.Command();
program
  .option('-p, --part <number>', 'part to solve', '1')
  .option('-i, --path <path>', 'input file path', './src/dayXX/dayXX-input.txt')
  .parse();

const { part, path } = program.opts();

console.log(`== Day ${day}, Part ${part} ==`);

const input = load.lines(path);

let result;
if (part === '2') {
  result = solvePart2(input);
} else {
  result = solvePart1(input);
}

if (result === null) {
  console.log("No solution found.");
} else {
  console.log("Answer:", result.answer);
}
```

- Update the `import` and default `--path` to use the actual day number.
- Change `load.lines(path)` if the solver expects a different input format.

### 5. Add script to `package.json`

Add to `"scripts"`:

```json
"dayXX": "tsx src/dayXX/index.ts"
```

### 6. Add new day to `README.md`

Add to `README.md`:

```
## Day N
```

## Shared Utilities (`src/lib/`)

- `load.ts`: File loading helpers (e.g., `commaSeparatedValues(path)` returns trimmed `string[]`)
