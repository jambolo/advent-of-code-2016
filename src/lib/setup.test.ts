import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockOpts = vi.fn();
const mockParse = vi.fn().mockReturnThis();
const mockOption = vi.fn().mockReturnThis();

vi.mock('commander', () => {
  return {
    default: {
      Command: class {
        option = mockOption;
        parse = mockParse;
        opts = mockOpts;
      },
    },
  };
});

import { args, banner } from './setup';

describe('args', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns part and path from commander opts', () => {
    mockOpts.mockReturnValue({ part: '1', path: './src/day01/day01-input.txt' });
    const result = args(1);
    expect(result).toEqual({ part: '1', path: './src/day01/day01-input.txt' });
  });

  it('constructs default path from day number', () => {
    mockOpts.mockReturnValue({ part: '1', path: './src/day01/day01-input.txt' });
    args(1);
    expect(mockOption).toHaveBeenCalledWith(
      '-i, --path <path>',
      'input file path',
      './src/day01/day01-input.txt'
    );
  });

  it('pads single-digit day to two digits in path', () => {
    mockOpts.mockReturnValue({ part: '1', path: './src/day05/day05-input.txt' });
    args(5);
    expect(mockOption).toHaveBeenCalledWith(
      '-i, --path <path>',
      'input file path',
      './src/day05/day05-input.txt'
    );
  });

  it('handles double-digit day number', () => {
    mockOpts.mockReturnValue({ part: '1', path: './src/day12/day12-input.txt' });
    args(12);
    expect(mockOption).toHaveBeenCalledWith(
      '-i, --path <path>',
      'input file path',
      './src/day12/day12-input.txt'
    );
  });

  it('registers -p/--part option with default "1"', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt' });
    args(1);
    expect(mockOption).toHaveBeenCalledWith('-p, --part <number>', 'part to solve', '1');
  });

  it('calls parse on the program', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt' });
    args(1);
    expect(mockParse).toHaveBeenCalled();
  });

  it('returns part value from opts', () => {
    mockOpts.mockReturnValue({ part: '2', path: './input.txt' });
    const result = args(1);
    expect(result.part).toBe('2');
  });

  it('returns path value from opts', () => {
    mockOpts.mockReturnValue({ part: '1', path: '/custom/path.txt' });
    const result = args(1);
    expect(result.path).toBe('/custom/path.txt');
  });

  it('returns only part and path properties', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt', extra: 'ignored' });
    const result = args(1);
    expect(Object.keys(result).sort()).toEqual(['part', 'path']);
  });

  it('does not include extra opts properties', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt', verbose: true });
    const result = args(1);
    expect(result).toEqual({ part: '1', path: './input.txt' });
  });

  it('calls option before parse', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt' });
    const callOrder: string[] = [];
    mockOption.mockImplementation(function (this: unknown) {
      callOrder.push('option');
      return this;
    });
    mockParse.mockImplementation(function (this: unknown) {
      callOrder.push('parse');
      return this;
    });
    args(1);
    expect(callOrder.indexOf('option')).toBeLessThan(callOrder.indexOf('parse'));
  });

  it('registers exactly two options', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt' });
    args(1);
    expect(mockOption).toHaveBeenCalledTimes(2);
  });

  it('returns string types for part and path', () => {
    mockOpts.mockReturnValue({ part: '1', path: './input.txt' });
    const result = args(1);
    expect(typeof result.part).toBe('string');
    expect(typeof result.path).toBe('string');
  });

  it('handles numeric-looking part as string', () => {
    mockOpts.mockReturnValue({ part: '99', path: './input.txt' });
    const result = args(1);
    expect(result.part).toBe('99');
  });

  it('handles path with spaces', () => {
    mockOpts.mockReturnValue({ part: '1', path: '/my path/file.txt' });
    const result = args(1);
    expect(result.path).toBe('/my path/file.txt');
  });
});

describe('banner', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('prints formatted banner for day 1 part 1', () => {
    banner(1, '1');
    expect(consoleSpy).toHaveBeenCalledWith('== Day 1, Part 1 ==');
  });

  it('prints formatted banner for day 25 part 2', () => {
    banner(25, '2');
    expect(consoleSpy).toHaveBeenCalledWith('== Day 25, Part 2 ==');
  });

  it('calls console.log exactly once', () => {
    banner(1, '1');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('returns void', () => {
    const result = banner(1, '1');
    expect(result).toBeUndefined();
  });

  it('handles single-digit day', () => {
    banner(5, '1');
    expect(consoleSpy).toHaveBeenCalledWith('== Day 5, Part 1 ==');
  });

  it('handles double-digit day', () => {
    banner(12, '2');
    expect(consoleSpy).toHaveBeenCalledWith('== Day 12, Part 2 ==');
  });

  it('handles arbitrary part string', () => {
    banner(1, 'bonus');
    expect(consoleSpy).toHaveBeenCalledWith('== Day 1, Part bonus ==');
  });
});
