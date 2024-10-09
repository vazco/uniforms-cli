import { Command } from 'commander';
import prompts, { PromptObject } from 'prompts';
import { bold, red } from 'kolorist';
import { existsSync } from 'node:fs';
import { exec } from 'node:child_process';
import { findNearestPackageJson } from '../../lib/findNearestPackageJson';
import { bridges, defaultTargetDir, themes } from '../../consts';
import { getTargetDir } from '../../lib/getTargetDir';
import { isDirEmpty } from '../../lib/isDirEmpty';

const defaultPrompts: PromptObject[] = [
  {
    type: 'select',
    name: 'bridge',
    message: bold('Select a bridge:'),
    choices: () =>
      bridges.map((bridge) => {
        const variantColor = bridge.color;
        return {
          title: variantColor(bridge.name),
          value: bridge.name,
        };
      }),
  },
  {
    type: 'select',
    name: 'theme',
    message: bold('Select a theme:'),
    choices: () =>
      themes.map((theme) => {
        const variantColor = theme.color;
        return {
          title: variantColor(theme.name),
          value: theme.name,
        };
      }),
  },
];

const getPromptsWithoutPackageJson = (): PromptObject[] => {
  let targetDir = defaultTargetDir;
  return [
    {
      type: 'text',
      name: 'projectName',
      message: bold('Project name:'),
      initial: defaultTargetDir,
      onState: (state: { value: string }) => {
        targetDir = getTargetDir(state.value) || defaultTargetDir;
      },
    },
    {
      type: () =>
        !existsSync(targetDir) || isDirEmpty(targetDir) ? null : 'confirm',
      name: 'overwrite',
      message: () =>
        `${
          targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`
        } is not empty. Remove existing files and continue?`,
    },
    {
      type: (_, { overwrite }: { overwrite?: boolean }) => {
        if (overwrite === false) {
          throw new Error(`${red('✖')} Operation cancelled`);
        }
        return null;
      },
      name: 'overwriteChecker',
    },
  ];
};

export const init = new Command()
  .name('init')
  .description('initialize uniforms in your project and install dependencies')
  .action(async () => {
    const packageJsonPath = await findNearestPackageJson();
    const withoutPackageJsonPrompts = getPromptsWithoutPackageJson();

    let result: prompts.Answers<'bridge' | 'theme' | 'projectName'>;

    try {
      result = await prompts(
        [
          ...defaultPrompts,
          ...(packageJsonPath ? [] : withoutPackageJsonPrompts),
        ],
        {
          onCancel: () => {
            throw new Error(red('✖') + bold(' Operation cancelled'));
          },
        },
      );
    } catch (error: any) {
      console.log(error.message);
      return;
    }

    console.log(packageJsonPath, result);
  });
