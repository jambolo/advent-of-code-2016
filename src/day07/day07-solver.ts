export interface Result {
  answer: number | string;
}

function splitAt(str: string, delim: string): [string, string] {
  const i = str.indexOf(delim);
  return i === -1 ? [str, ""] : [str.slice(0, i), str.slice(i)];
}

function containsABBA(s: string): boolean {
  for (let i = 0; i < s.length - 3; i++) {
    if (s[i] !== s[i + 1] && s[i] === s[i + 3] && s[i + 1] === s[i + 2]) {
      return true;
    }
  }
  return false;
}

function separated(ip: string): [string[], string[]] {
  const supernets: string[] = [];
  const hypernets: string[] = [];
  let remainder = ip;
  while (remainder.length > 0) {
    if (remainder[0] === "[") {
      var hypernet: string;
      [hypernet, remainder] = splitAt(remainder.slice(1), "]"); // skip the '['
      hypernets.push(hypernet);
      remainder = remainder.slice(1); // skip the "]"
    } else {
      var supernet: string;
      [supernet, remainder] = splitAt(remainder, "[");
      supernets.push(supernet);
    }
  }
  return [supernets, hypernets];
}

function extractAbas(sequence: string): string[] {
  const abas: string[] = [];
  for (let i = 0; i < sequence.length - 2; i++) {
    if (sequence[i] === sequence[i + 2] && sequence[i] !== sequence[i + 1]) {
      abas.push(sequence.slice(i, i + 3));
    }
  }
  return abas;
}

export function solvePart1(ips: string[]): Result | null {
  const count = ips
    .map(separated)
    .filter(([s, h]) => !h.some(containsABBA) && s.some(containsABBA))
    .length;
  return { answer: count };
}

export function solvePart2(ips: string[]): Result | null {
  const count = ips
    .map(separated)
    .filter(([s, h]) => {
      const abas = s.flatMap(extractAbas);
      if (abas.length === 0) {
        return false;
      }
      const babs = abas.map((aba) => aba[1] + aba[0] + aba[1]);
      return h.some((h) => babs.some((bab) => h.includes(bab)));
    })
    .length;
  return { answer: count };
}