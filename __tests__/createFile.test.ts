import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createFile } from '../src/lib/createFile';
import { Bridges, Themes } from '../src/types';

describe('createFile', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-createFile-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should create a file with the specified content', () => {
    const theme: Themes = Themes.Semantic;
    const bridge: Bridges = Bridges.GraphQL;
    const extension = 'jsx';
    const directory = tempDir;
    const customDirPath = 'customDir';
    const filePath = path.join(
      directory,
      customDirPath,
      `uniforms-form.${extension}`,
    );

    createFile(theme, bridge, extension, directory, customDirPath);

    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should throw an error theme or bridge are bad', () => {
    const theme: Themes = 'default' as Themes;
    const bridge: Bridges = Bridges.GraphQL;
    const extension = 'jsx';
    const directory = tempDir;
    const customDirPath = 'customDir';
    const filePath = path.join(
      directory,
      customDirPath,
      `uniforms-form.${extension}`,
    );

    fs.mkdirSync(path.join(directory, customDirPath), { recursive: true });
    fs.writeFileSync(filePath, 'content');

    expect(() =>
      createFile(theme, bridge, extension, directory, customDirPath),
    ).toThrow('No bridge or theme');
  });
});
