import { PackageManagers } from '../types';

export const getInstallCommand = (packageManager: PackageManagers) => {
  switch (packageManager) {
    case PackageManagers.NPM:
      return 'npm install';
    case PackageManagers.YARN:
      return 'yarn add';
    case PackageManagers.PNPM:
      return 'pnpm add';
    default:
      return 'npm install';
  }
};
