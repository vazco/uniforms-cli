import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fetchFiles } from '../src/lib/fetchFilesFromGithub';

vi.mock('node-fetch');

describe('fetchFiles', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-fetchFiles-'));
    vi.spyOn(fs, 'mkdtempSync').mockReturnValue(tempDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('should fetch files from GitHub and save them to a temporary directory', async () => {
    const mockHtmlResponse = `
      <a href="/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/file1.ts">file1.ts</a>
      <a href="/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/file2.ts">file2.ts</a>
    `;
    const mockFileContent = 'console.log("test");';

    (fetch as any)
      .mockResolvedValueOnce({ text: () => Promise.resolve(mockHtmlResponse) })
      .mockResolvedValue({ text: () => Promise.resolve(mockFileContent) });

    const result = await fetchFiles();

    expect(result.tempDir).toBe(tempDir);
    expect(fs.existsSync(path.join(tempDir, 'file1.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'file2.ts'))).toBe(true);
    expect(fs.readFileSync(path.join(tempDir, 'file1.ts'), 'utf-8')).toBe(
      mockFileContent,
    );
    expect(fs.readFileSync(path.join(tempDir, 'file2.ts'), 'utf-8')).toBe(
      mockFileContent,
    );
  });
});
