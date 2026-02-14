import { describe, it, expect, afterEach } from 'vitest';
import { commaSeparatedValues } from './load';
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
