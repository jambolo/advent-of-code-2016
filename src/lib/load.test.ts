import { describe, it, expect, afterEach } from 'vitest';
import { commaSeparatedValues, lines } from './load';
import fs from 'fs';
import path from 'path';
import os from 'os';

function writeTempFile(content: string): string {
  const filePath = path.join(os.tmpdir(), `csv-test-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

const tempFiles: string[] = [];

function createTemp(content: string): string {
  const p = writeTempFile(content);
  tempFiles.push(p);
  return p;
}

afterEach(() => {
  for (const f of tempFiles) {
    try { fs.unlinkSync(f); } catch { /* ignore */ }
  }
  tempFiles.length = 0;
});

describe('commaSeparatedValues', () => {
  it('parses basic comma-separated values', () => {
    const p = createTemp('a,b,c');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', 'c']);
  });

  it('trims whitespace around values', () => {
    const p = createTemp(' a , b , c ');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', 'c']);
  });

  it('trims trailing newline', () => {
    const p = createTemp('a,b,c\n');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', 'c']);
  });

  it('trims leading and trailing whitespace from file content', () => {
    const p = createTemp('\n  a,b,c  \n');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', 'c']);
  });

  it('handles a single value', () => {
    const p = createTemp('42');
    expect(commaSeparatedValues(p)).toEqual(['42']);
  });

  it('handles numeric values as strings', () => {
    const p = createTemp('1,2,3');
    expect(commaSeparatedValues(p)).toEqual(['1', '2', '3']);
  });

  it('handles empty values between commas', () => {
    const p = createTemp('a,,b');
    expect(commaSeparatedValues(p)).toEqual(['a', '', 'b']);
  });

  it('handles trailing comma', () => {
    const p = createTemp('a,b,');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', '']);
  });

  it('handles leading comma', () => {
    const p = createTemp(',a,b');
    expect(commaSeparatedValues(p)).toEqual(['', 'a', 'b']);
  });

  it('handles values with mixed whitespace (tabs and spaces)', () => {
    const p = createTemp('a ,\tb ,  c');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b', 'c']);
  });

  it('handles multiline content by not splitting on newlines', () => {
    const p = createTemp('a,b\nc,d');
    expect(commaSeparatedValues(p)).toEqual(['a', 'b\nc', 'd']);
  });

  it('handles empty file (whitespace only)', () => {
    const p = createTemp('  \n  ');
    expect(commaSeparatedValues(p)).toEqual(['']);
  });

  it('throws on nonexistent file', () => {
    expect(() => commaSeparatedValues('/tmp/nonexistent-file-xyz.txt')).toThrow();
  });
});

describe('lines', () => {
  it('splits file into lines', () => {
    const p = createTemp('a\nb\nc');
    expect(lines(p)).toEqual(['a', 'b', 'c']);
  });

  it('trims trailing newline', () => {
    const p = createTemp('a\nb\nc\n');
    expect(lines(p)).toEqual(['a', 'b', 'c']);
  });

  it('trims leading and trailing whitespace from file content', () => {
    const p = createTemp('\na\nb\nc\n');
    expect(lines(p)).toEqual(['a', 'b', 'c']);
  });

  it('handles a single line', () => {
    const p = createTemp('hello');
    expect(lines(p)).toEqual(['hello']);
  });

  it('handles a single line with trailing newline', () => {
    const p = createTemp('hello\n');
    expect(lines(p)).toEqual(['hello']);
  });

  it('preserves whitespace within lines but trims outer content', () => {
    const p = createTemp('  a  \n  b  ');
    expect(lines(p)).toEqual(['a  ', '  b']);
  });

  it('preserves internal whitespace on non-edge lines', () => {
    const p = createTemp('x\n  a  \ny');
    expect(lines(p)).toEqual(['x', '  a  ', 'y']);
  });

  it('handles empty lines in the middle', () => {
    const p = createTemp('a\n\nb');
    expect(lines(p)).toEqual(['a', '', 'b']);
  });

  it('handles multiple consecutive empty lines', () => {
    const p = createTemp('a\n\n\nb');
    expect(lines(p)).toEqual(['a', '', '', 'b']);
  });

  it('handles empty file (whitespace only)', () => {
    const p = createTemp('  \n  ');
    expect(lines(p)).toEqual(['']);
  });

  it('handles lines with varied content', () => {
    const p = createTemp('123\nabc\n!@#');
    expect(lines(p)).toEqual(['123', 'abc', '!@#']);
  });

  it('does not split on carriage return alone', () => {
    const p = createTemp('a\rb');
    expect(lines(p)).toEqual(['a\rb']);
  });

  it('handles Windows-style CRLF line endings', () => {
    const p = createTemp('a\r\nb\r\nc');
    expect(lines(p)).toEqual(['a\r', 'b\r', 'c']);
  });

  it('handles lines with commas (no splitting)', () => {
    const p = createTemp('a,b\nc,d');
    expect(lines(p)).toEqual(['a,b', 'c,d']);
  });

  it('throws on nonexistent file', () => {
    expect(() => lines('/tmp/nonexistent-file-xyz.txt')).toThrow();
  });
});
