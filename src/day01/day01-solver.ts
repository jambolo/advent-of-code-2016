export interface Result {
  answer: number | string;
}

enum Facing {
  East = 0,
  North,
  West,
  South,
}

function turnLeft(facing: Facing): Facing {
  return (facing + 1) % 4;
}

function turnRight(facing: Facing): Facing {
  return (facing + 3) % 4;
}

function move(x: number, y: number, facing: Facing, movement: string) {
  const turn = movement[0];
  if (turn === 'L') {
    facing = turnLeft(facing);
  } else if (turn === 'R') {
    facing = turnRight(facing);
  }
  const distance = parseInt(movement.slice(1));
  switch (facing) {
    case Facing.East:
      x += distance;
      break;
    case Facing.North:
      y += distance;
      break;
    case Facing.West:
      x -= distance;
      break;
    case Facing.South:
      y -= distance;
      break;
  }
  return { x, y, facing };
}

export function solvePart1(directions: string[]): Result | null {
  let x = 0;
  let y = 0;
  let facing = Facing.North
  for (const movement of directions) {
    ({ x, y, facing } = move(x, y, facing, movement));
  }

  return { answer: Math.abs(x) + Math.abs(y) };
}

export function solvePart2(directions: string[]): Result | null {
  let x = 0;
  let y = 0;
  let facing = Facing.North
  const visited = new Set<string>([`0,0`]);
  for (const movement of directions) {
    let new_x: number;
    let new_y: number;
    ({ x: new_x, y: new_y, facing } = move(x, y, facing, movement));
    switch (facing) {
      case Facing.East:
        for (let i = x + 1; i <= new_x; i++) {
          const key = `${i},${y}`;
          if (visited.has(key)) {
            return { answer: Math.abs(i) + Math.abs(y) };
          }
          visited.add(key);
        }
        break;
      case Facing.North:
        for (let i = y + 1; i <= new_y; i++) {
          const key = `${x},${i}`;
          if (visited.has(key)) {
            return { answer: Math.abs(x) + Math.abs(i) };
          }
          visited.add(key);
        }
        break;
      case Facing.West:
        for (let i = x - 1; i >= new_x; i--) {
          const key = `${i},${y}`;
          if (visited.has(key)) {
            return { answer: Math.abs(i) + Math.abs(y) };
          }
          visited.add(key);
        }
        break;
      case Facing.South:
        for (let i = y - 1; i >= new_y; i--) {
          const key = `${x},${i}`;
          if (visited.has(key)) {
            return { answer: Math.abs(x) + Math.abs(i) };
          }
          visited.add(key);
        }
        break;
    }
    x = new_x;
    y = new_y;
  }

  return null;
}