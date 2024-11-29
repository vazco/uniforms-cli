import { describe, it, expect } from 'vitest';
import { getInstallCommand } from '../src/lib/getInstallCommand';
import { PackageManagers } from '../src/types';

describe('getInstallCommand', () => {
  it('should return "npm install" for NPM', () => {
    expect(getInstallCommand(PackageManagers.NPM)).toBe('npm install');
  });

  it('should return "yarn add" for YARN', () => {
    expect(getInstallCommand(PackageManagers.YARN)).toBe('yarn add');
  });

  it('should return "pnpm add" for PNPM', () => {
    expect(getInstallCommand(PackageManagers.PNPM)).toBe('pnpm add');
  });

  it('should return undefined for an unknown package manager', () => {
    expect(getInstallCommand('unknown' as PackageManagers)).toBeUndefined();
  });
});
