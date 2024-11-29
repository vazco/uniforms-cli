import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { deleteSpecificFilesInFolder } from '../src/lib/deleteSpecificFilesInFolder';

describe('deleteSpecificFilesInFolder', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-deleteFiles-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should delete specified files in the folder', () => {
    const file1 = path.join(tempDir, 'file1.txt');
    const file2 = path.join(tempDir, 'file2.txt');
    const file3 = path.join(tempDir, 'file3.txt');
    fs.writeFileSync(file1, 'content1');
    fs.writeFileSync(file2, 'content2');
    fs.writeFileSync(file3, 'content3');

    deleteSpecificFilesInFolder(tempDir, ['file1.txt', 'file3.txt']);

    expect(fs.existsSync(file1)).toBe(false);
    expect(fs.existsSync(file2)).toBe(true);
    expect(fs.existsSync(file3)).toBe(false);
  });

  it('should not throw an error if the specified files do not exist', () => {
    const file1 = path.join(tempDir, 'file1.txt');
    fs.writeFileSync(file1, 'content1');

    expect(() => {
      deleteSpecificFilesInFolder(tempDir, ['file2.txt']);
    }).not.toThrow();

    expect(fs.existsSync(file1)).toBe(true);
  });

  it('should handle an empty list of files to delete', () => {
    const file1 = path.join(tempDir, 'file1.txt');
    fs.writeFileSync(file1, 'content1');

    deleteSpecificFilesInFolder(tempDir, []);

    expect(fs.existsSync(file1)).toBe(true);
  });

  it('should throw an error if the folder does not exist', () => {
    expect(() => {
      deleteSpecificFilesInFolder('/non-existent-folder', ['file1.txt']);
    }).toThrow();
  });
});
