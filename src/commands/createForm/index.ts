import prompts, { PromptObject } from 'prompts';
import { bold, red } from 'kolorist';
import { Command } from 'commander';
import { fileTypes } from '../../consts';
import { getThemeAndBridgeFromPackageJSON } from '../../lib/getThemeAndBridgeFromPackageJSON';
import { findNearestPackageJson } from '../../lib/findNearestPackageJson';
import { Bridges, Themes } from '../../types';
import { createFile } from '../../lib/createFile';

const extensionPrompt: PromptObject = {
  type: 'select',
  name: 'extension',
  message: bold('Select extension:'),
  choices: () =>
    fileTypes.map(({ title, color, value }) => ({
      title: color(title),
      value,
    })),
};

const getBridgePrompt: (value: Bridges[]) => PromptObject = (
  availableBridges: Bridges[],
) => ({
  type: 'select',
  name: 'bridge',
  message: bold('Multiple bridges found, select one:'),
  choices: () =>
    availableBridges.map((bridge) => ({
      title: bridge,
      value: bridge,
    })),
});
const getThemePrompt: (value: Themes[]) => PromptObject = (
  availableThemes: Themes[],
) => ({
  type: 'select',
  name: 'theme',
  message: bold('Multiple themes found, select one:'),
  choices: () =>
    availableThemes.map((theme) => ({
      title: theme,
      value: theme,
    })),
});

const customDirPrompt: PromptObject = {
  type: 'confirm',
  name: 'customDir',
  message: bold('Choose custom directory?:'),
};
const customDirPathPrompt: PromptObject = {
  type: 'text',
  name: 'customDirPath',
  message: bold('Insert path to custom directory:'),
};

export const createForm = new Command()
  .name('createForm')
  .description('Creates new uniforms form template')
  .option('-s, --skip', 'skip custom dir question, and create in current dir')
  .option(
    '-e, --extension <extension>',
    `Select extension (${fileTypes.join(', ')})`,
  )
  .action(async (options) => {
    const { skip: skipFlag, extension: extensionFlag } = options;
    const findExtension = fileTypes.find(
      ({ value }) => value === extensionFlag,
    );
    const bridgePackages = Object.values(Bridges);
    const themePackages = Object.values(Themes);

    const packageJsonPath = await findNearestPackageJson();
    if (!packageJsonPath) {
      throw new Error('No package.json found');
    }
    const existingBridges = getThemeAndBridgeFromPackageJSON(
      packageJsonPath,
      bridgePackages,
    ) as Bridges[];
    const existingThemes = getThemeAndBridgeFromPackageJSON(
      packageJsonPath,
      themePackages,
    ) as Themes[];

    let result: prompts.Answers<'extension' | 'bridge' | 'theme' | 'customDir'>;
    try {
      result = await prompts(
        [
          // @ts-expect-error
          ...[findExtension ? [] : extensionPrompt],
          // @ts-expect-error
          ...[
            existingBridges.length > 1 ? getBridgePrompt(existingBridges) : [],
          ],
          // @ts-expect-error
          ...[existingThemes.length > 1 ? getThemePrompt(existingThemes) : []],
          // @ts-expect-error
          ...[skipFlag ? [] : customDirPrompt],
        ],
        {
          onCancel: (error) => {
            console.log('error', error);
            throw new Error(red('✖') + bold(' Operation cancelled'));
          },
        },
      );
    } catch (error: any) {
      console.log(error.message);
      return;
    }

    let customDirPath: string | undefined;
    let dirPathPromptResult: prompts.Answers<'customDirPath'>;
    if (result.customDir) {
      try {
        dirPathPromptResult = await prompts([customDirPathPrompt], {
          onCancel: () => {
            throw new Error(red('✖') + bold(' Operation cancelled'));
          },
        });
        customDirPath = dirPathPromptResult.customDirPath;
      } catch (error: any) {
        console.log(error.message);
        return;
      }
    }
    const { theme, extension, bridge } = result;
    const directory = process.cwd();
    createFile(
      theme ?? existingThemes[0],
      bridge ?? existingBridges[0],
      findExtension || extension,
      directory,
      customDirPath,
    );
  });
