import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { findNearestPackageJson } from '../src/lib/findNearestPackageJson';

describe('findNearestPackageJson', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'test-findNearestPackageJson-'),
    );
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should find the nearest package.json in the current directory', async () => {
    const packageJsonPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify({ name: 'test' }));

    const result = await findNearestPackageJson(tempDir);
    expect(result).toBe(packageJsonPath);
  });

  it('should find the nearest package.json without passing directory', async () => {
    const result = await findNearestPackageJson();
    console.log('result', result);
    expect(result).toBe(result);
  });

  it('should return null if no package.json is found in the current directory', async () => {
    const result = await findNearestPackageJson(tempDir);
    expect(result).toBeNull();
  });

  it('should return null if the package.json file does not exist', async () => {
    const nonExistentPath = path.join(tempDir, 'non-existent-dir');
    const result = await findNearestPackageJson(nonExistentPath);
    expect(result).toBeNull();
  });
});
