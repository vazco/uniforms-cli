import { Command } from 'commander';
import prompts from 'prompts';
import { bold, red } from 'kolorist';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { findNearestPackageJson } from '../../lib/findNearestPackageJson';
import { bridgeImports, themeImports } from '../../consts';
import { isDirEmpty } from '../../lib/isDirEmpty';
import { getInstallCommand } from '../../lib/getInstallCommand';
import { Bridges, Themes } from '../../types';
import { getPromptsWithoutPackageJson } from './prompts/promptsWithoutPackageJson';
import { getWithPackageJsonPrompts } from './prompts/withPackageJsonPrompts';
import { getDefaultPrompts } from './prompts/defualtPrompts';

export const init = new Command()
  .name('init')
  .description('Initialize uniforms in your project and install dependencies')
  .option(
    '-b, --bridge <bridge>',
    `Select a bridge (${Object.values(Bridges).join(', ')})`,
  )
  .option(
    '-t, --theme <theme>',
    `Select a theme (${Object.values(Themes).join(', ')})`,
  )
  .option(
    '-pm, --packageManager <packageManager>',
    `Select a package manager (${Object.values(Themes).join(', ')})`,
  )
  .action(async (options) => {
    const {
      bridge: bridgeFlag,
      theme: themeFlag,
      packageManager: packageManagerFlag,
    } = options;
    const packageJsonPath = await findNearestPackageJson();
    const packageJsonDir = packageJsonPath?.split('/').slice(0, -1).join('/');
    const withoutPackageJsonPrompts = getPromptsWithoutPackageJson();
    const defaultPrompts = getDefaultPrompts({
      bridge: bridgeFlag,
      theme: themeFlag,
    });
    const withPackageJsonPrompts =
      getWithPackageJsonPrompts(packageManagerFlag);

    let result: prompts.Answers<
      'bridge' | 'theme' | 'projectName' | 'packageManager' | 'overwrite'
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
      console.log(red(error.message));
      return;
    }

    const { bridge, theme, packageManager, projectName, overwrite } = result;
    const installCommand =
      getInstallCommand(packageManagerFlag) ||
      getInstallCommand(packageManager);
    const bridgePackage =
      bridgeImports[bridgeFlag as Bridges]?.package ||
      bridgeImports[bridge as Bridges]?.package;
    const themePackage =
      themeImports[themeFlag as Themes] || themeImports[theme as Themes];
    const installCommandLine = `${installCommand} uniforms ${bridgePackage} ${themePackage}`;

    if (!packageJsonPath) {
      const root = join(process.cwd(), projectName);
      console.log('Installing dependencies...');
      try {
        if (overwrite) {
          isDirEmpty(root);
          readdirSync(root).forEach((f) =>
            rmSync(`${root}/${f}`, { recursive: true }),
          );
        } else if (!existsSync(root)) {
          mkdirSync(root, { recursive: true });
        }
        console.log('Creating package.json...');
        execSync(`cd ${root} && npm init -y`, { stdio: 'inherit' });
        console.log('package.json created successfully.');
        execSync(
          `cd ${root} && npm install uniforms ${bridgePackage} ${themePackage}`,
          {
            stdio: 'inherit',
          },
        );
        console.log('Dependencies installed successfully.');
      } catch (error) {
        console.log(red('Failed to install dependencies.'));
      }
    } else {
      console.log('Installing dependencies...');
      try {
        execSync(`cd ${packageJsonDir} && ${installCommandLine}`, {
          stdio: 'inherit',
        });
        console.log('Dependencies installed successfully.');
      } catch (error) {
        console.log(red('Failed to install dependencies.'));
      }
    }
  });
