import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { copyFiles } from '../src/lib/copyFiles';

describe('copyFiles', () => {
  let sourceFolder: string;
  let destinationFolder: string;

  beforeEach(() => {
    sourceFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'source-'));
    destinationFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'destination-'));

    // Create some test files in the source folder
    fs.writeFileSync(path.join(sourceFolder, 'file1.txt'), 'Content of file 1');
    fs.writeFileSync(path.join(sourceFolder, 'file2.txt'), 'Content of file 2');
  });

  afterEach(() => {
    // Clean up the temporary folders
    fs.rmSync(sourceFolder, { recursive: true, force: true });
    fs.rmSync(destinationFolder, { recursive: true, force: true });
  });

  it('should copy files from source to destination', () => {
    copyFiles(sourceFolder, destinationFolder);

    const copiedFiles = fs.readdirSync(destinationFolder);
    expect(copiedFiles).toContain('file1.txt');
    expect(copiedFiles).toContain('file2.txt');

    const file1Content = fs.readFileSync(
      path.join(destinationFolder, 'file1.txt'),
      'utf-8',
    );
    const file2Content = fs.readFileSync(
      path.join(destinationFolder, 'file2.txt'),
      'utf-8',
    );
    expect(file1Content).toBe('Content of file 1');
    expect(file2Content).toBe('Content of file 2');
  });

  it('should create destination folder if it does not exist', () => {
    const nonExistentDestination = path.join(
      os.tmpdir(),
      'non-existent-destination',
    );
    copyFiles(sourceFolder, nonExistentDestination);

    const copiedFiles = fs.readdirSync(nonExistentDestination);
    expect(copiedFiles).toContain('file1.txt');
    expect(copiedFiles).toContain('file2.txt');

    const file1Content = fs.readFileSync(
      path.join(nonExistentDestination, 'file1.txt'),
      'utf-8',
    );
    const file2Content = fs.readFileSync(
      path.join(nonExistentDestination, 'file2.txt'),
      'utf-8',
    );
    expect(file1Content).toBe('Content of file 1');
    expect(file2Content).toBe('Content of file 2');

    // Clean up the non-existent destination folder
    fs.rmSync(nonExistentDestination, { recursive: true, force: true });
  });

  it('should not copy if source folder does not exist', () => {
    const nonExistentSource = path.join(os.tmpdir(), 'non-existent-source');
    copyFiles(nonExistentSource, destinationFolder);

    const copiedFiles = fs.readdirSync(destinationFolder);
    expect(copiedFiles.length).toBe(0);
  });
});
