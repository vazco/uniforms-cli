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
import { withPackageJsonPrompts } from './prompts/withPackageJsonPrompts';
import { defaultPrompts } from './prompts/defualtPrompts';

export const init = new Command()
  .name('init')
  .description('Initialize uniforms in your project and install dependencies')
  .action(async () => {
    const packageJsonPath = await findNearestPackageJson();
    const packageJsonDir = packageJsonPath?.split('/').slice(0, -1).join('/');
    const withoutPackageJsonPrompts = getPromptsWithoutPackageJson();

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
        console.log('Failed to install dependencies.');
      }
    } else {
      console.log('Installing dependencies...');
      try {
        execSync(`cd ${packageJsonDir} && ${installCommandLine}`, {
          stdio: 'inherit',
        });
        console.log('Dependencies installed successfully.');
      } catch (error) {
        console.log('Failed to install dependencies.');
      }
    }
  });
