import fs from 'node:fs';
import { join, dirname } from 'node:path';

export const findNearestPackageJson = async (
  currentDir?: string,
): Promise<string | null> => {
  const searchedDir = currentDir || process.cwd();
  const packageJsonPath = join(searchedDir, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    return packageJsonPath;
  }

  const parentDir = dirname(searchedDir);

  if (currentDir === parentDir) {
    return null;
  }

  return findNearestPackageJson(parentDir);
};
