import { Command } from 'commander';
import prompts, { PromptObject } from 'prompts';
import { bold, red } from 'kolorist';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import ora from 'ora';
import { join } from 'node:path';
import { findNearestPackageJson } from '../../lib/findNearestPackageJson';
import {
  bridgeImports,
  bridges,
  defaultTargetDir,
  packageManagers,
  themeImports,
  themes,
} from '../../consts';
import { getTargetDir } from '../../lib/getTargetDir';
import { isDirEmpty } from '../../lib/isDirEmpty';
import { getInstallCommand } from '../../lib/getInstallCommand';
import { Bridges, Themes } from '../../types';

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

const withPackageJsonPrompts: PromptObject[] = [
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
    const packageJsonDir = packageJsonPath?.split('/').slice(0, -1).join('/');
    const withoutPackageJsonPrompts = getPromptsWithoutPackageJson();

    let result: prompts.Answers<
      'bridge' | 'theme' | 'projectName' | 'packageManager'
    >;

    try {
      result = await prompts(
        [
          ...defaultPrompts,
          ...(packageJsonPath
            ? withPackageJsonPrompts
            : withoutPackageJsonPrompts),
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

    const { bridge, theme, packageManager, projectName, overwrite } = result;
    const installCommand = getInstallCommand(packageManager);
    const bridgePackage = bridgeImports[bridge as Bridges]?.package;
    const themePackage = themeImports[theme as Themes];
    const installCommandLine = `${installCommand} uniforms ${bridgePackage} ${themePackage}`;

    if (!packageJsonPath) {
      const root = join(process.cwd(), projectName);
      const spinner = ora('Installing dependencies...').start();
      try {
        if (overwrite) {
          isDirEmpty(root);
          readdirSync(root).forEach((f) =>
            rmSync(`${root}/${f}`, { recursive: true }),
          );
        } else if (!existsSync(root)) {
          mkdirSync(root, { recursive: true });
        }
        execSync(`cd ${root} && ${installCommandLine}`, {
          stdio: 'inherit',
        });
        spinner.succeed('Dependencies installed successfully.');
      } catch (error) {
        spinner.fail('Failed to install dependencies.');
      }
    } else {
      const spinner = ora('Installing dependencies...').start();
      try {
        execSync(`cd ${packageJsonDir} && ${installCommandLine}`, {
          stdio: 'inherit',
        });
        spinner.succeed('Dependencies installed successfully.');
      } catch (error) {
        spinner.fail('Failed to install dependencies.');
      }
    }
  });
