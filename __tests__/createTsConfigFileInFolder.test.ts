import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createTsConfigFileInFolder } from '../src/lib/createTsConfigFileInFolder';

describe('createTsConfigFileInFolder', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-createTsConfig-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should create a tsconfig.json file with the correct content', () => {
    createTsConfigFileInFolder(tempDir);

    const filePath = path.join(tempDir, 'tsconfig.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const tsConfigContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(tsConfigContent).toEqual({
      include: ['./**/*'],
      compilerOptions: {
        outDir: './striped',
        target: 'es2020',
        module: 'es2020',
        strict: false,
        esModuleInterop: true,
        jsx: 'react',
        moduleResolution: 'node',
      },
    });
  });
});
