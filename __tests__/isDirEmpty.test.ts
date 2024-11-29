import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { isDirEmpty } from '../src/lib/isDirEmpty';

describe('isDirEmpty', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-isDirEmpty-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should return true for an empty directory', () => {
    expect(isDirEmpty(tempDir)).toBe(true);
  });

  it('should return false for a directory with files', () => {
    fs.writeFileSync(path.join(tempDir, 'file.txt'), 'content');
    expect(isDirEmpty(tempDir)).toBe(false);
  });
});
