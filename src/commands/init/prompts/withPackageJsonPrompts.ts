import { PromptObject } from 'prompts';
import { bold } from 'kolorist';
import { packageManagers } from '../../../consts';

export const withPackageJsonPrompts: PromptObject[] = [
  {
    type: 'select',
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
