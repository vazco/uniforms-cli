import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getThemeAndBridgeFromPackageJSON } from '../src/lib/getThemeAndBridgeFromPackageJSON';
import { packagesToBridges, packagesToThemes } from '../src/consts';
import { Bridges } from '../src/types';
import { findNearestPackageJson } from '../src/lib/findNearestPackageJson';

describe('getThemeAndBridgeFromPackageJSON', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-getThemeAndBridge-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should extract bridge from package.json', () => {
    const packageJsonPath = path.join(tempDir, 'package.json');
    const packageJsonContent = {
      dependencies: {
        'uniforms-bridge-json-schema': '1.0.0',
      },
    };
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJsonContent),
      'utf-8',
    );

    const result = getThemeAndBridgeFromPackageJSON(
      packageJsonPath,
      Object.keys(packagesToBridges),
    );

    expect(result).toEqual(['uniforms-bridge-json-schema']);
  });

  it('should extract theme from package.json', () => {
    const packageJsonPath = path.join(tempDir, 'package.json');
    const packageJsonContent = {
      dependencies: {
        'uniforms-mui': '1.0.0',
      },
    };
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJsonContent),
      'utf-8',
    );

    const result = getThemeAndBridgeFromPackageJSON(
      packageJsonPath,
      Object.keys(packagesToThemes),
    );

    expect(result).toEqual(['uniforms-mui']);
  });

  it('should return empty array if package.json does not contain theme and bridge', () => {
    const packageJsonPath = path.join(tempDir, 'package.json');
    const packageJsonContent = {
      dependencies: {
        name: '1.0.0',
      },
    };
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJsonContent),
      'utf-8',
    );

    const result = getThemeAndBridgeFromPackageJSON(
      packageJsonPath,
      Object.keys(packagesToThemes),
    );
    expect(result).toStrictEqual([]);
  });

  it('should return empty array if package.json does not exist', () => {
    const result = getThemeAndBridgeFromPackageJSON(
      tempDir,
      Object.keys(packagesToThemes),
    );
    expect(result).toStrictEqual([]);
  });
});
