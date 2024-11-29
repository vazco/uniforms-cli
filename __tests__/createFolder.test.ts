import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createFolder } from '../src/lib/createFolder';

describe('createFolder', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-createFolder-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should create a folder with the specified name', () => {
    const folderName = 'newFolder';
    const createdFolderPath = createFolder({ folderName, directory: tempDir });

    expect(fs.existsSync(createdFolderPath)).toBe(true);
    expect(fs.lstatSync(createdFolderPath).isDirectory()).toBe(true);
  });

  it('should create a folder with the specified name in a custom directory', () => {
    const folderName = 'newFolder';
    const customDirPath = 'customDir';
    const createdFolderPath = createFolder({
      folderName,
      directory: tempDir,
      customDirPath,
    });

    expect(fs.existsSync(createdFolderPath)).toBe(true);
    expect(fs.lstatSync(createdFolderPath).isDirectory()).toBe(true);
  });

  it('should create a folder with the specified name in the root directory if customDirPath is empty', () => {
    const folderName = 'newFolder';
    const customDirPath = '';
    const createdFolderPath = createFolder({
      folderName,
      directory: tempDir,
      customDirPath,
    });

    expect(fs.existsSync(createdFolderPath)).toBe(true);
    expect(fs.lstatSync(createdFolderPath).isDirectory()).toBe(true);
  });
});
