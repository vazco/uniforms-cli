import { PromptObject } from 'prompts';
import { bold } from 'kolorist';
import { packageManagers } from '../../../consts';
import { getInstallCommand } from '../../../lib/getInstallCommand';
import { PackageManagers } from '../../../types';

export const getWithPackageJsonPrompts = (
  packageManagerFlag: string,
): PromptObject[] => {
  const foundPackageManager = getInstallCommand(
    packageManagerFlag as PackageManagers,
  );

  return [
    {
      type: () => (foundPackageManager ? null : 'select'),
      name: 'packageManager',
      message: bold('Select a package manager:'),
      choices: () =>
        packageManagers.map((pm) => {
          const variantColor = pm.color;
          return {
            title: variantColor(pm.name),
            value: pm.name,
          };
        }),
    },
  ];
};
