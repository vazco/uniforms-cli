import fs from 'node:fs';
import path from 'node:path';

export const getThemeAndBridgeFromPackageJSON = (
  packageJsonPath: string,
  searchedPackages: string[],
) => {
  const absolutePath = path.resolve(packageJsonPath);
  let packageJson;

  try {
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    packageJson = JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `Error reading or parsing package.json at ${absolutePath}:`,
      error,
    );
    return [];
  }

  const dependenciesSections = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];

  const installedPackages = new Set<string>();

  for (const section of dependenciesSections) {
    const deps = packageJson[section];
    if (deps && typeof deps === 'object') {
      for (const pkg of Object.keys(deps)) {
        installedPackages.add(pkg);
      }
    }
  }

  return searchedPackages.filter((pkg) => installedPackages.has(pkg));
};
