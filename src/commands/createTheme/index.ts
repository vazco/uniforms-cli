import { Command } from 'commander';
import { execSync } from 'node:child_process';
import prompts, { PromptObject } from 'prompts';
import { bold, red } from 'kolorist';
import { fetchFiles } from '../../lib/fetchFilesFromGithub';
import { createTsConfigFileInFolder } from '../../lib/createTsConfigFileInFolder';
import { fileTypes } from '../../consts';
import { deleteSpecificFilesInFolder } from '../../lib/deleteSpecificFilesInFolder';
import { createFolder } from '../../lib/createFolder';
import { copyFiles } from '../../lib/copyFiles';

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

const themeNamePrompt: PromptObject = {
  type: 'text',
  name: 'themeName',
  message: bold('Insert theme name:'),
  initial: 'my-custom-theme',
};

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

export const createTheme = new Command()
  .name('createTheme')
  .description('Creates new uniforms theme template')
  .option('-n, --name <name>', 'Insert theme name')
  .option(
    '-s, --skip',
    'skip custom directory question, and create in current directory',
  )
  .option(
    '-e, --extension <extension>',
    `Select extension (${fileTypes.map(({ value }) => value).join(', ')})`,
  )
  .action(async (options) => {
    const {
      skip: skipFlag,
      extension: extensionFlag,
      name: themeName,
    } = options;
    const findExtension = fileTypes.find(
      ({ value }) => value === extensionFlag,
    );

    let result: prompts.Answers<'extension' | 'customDir' | 'themeName'>;
    try {
      result = await prompts(
        [
          // @ts-expect-error
          ...[themeName ? [] : themeNamePrompt],
          // @ts-expect-error
          ...[findExtension ? [] : extensionPrompt],
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

    console.log('Fetching custom theme...');
    const { tempDir } = await fetchFiles();
    console.log('Custom theme fetched successfully.');

    const extension = findExtension?.value || result.extension;

    const isJsx = extension === 'jsx';

    if (isJsx) {
      console.log('Parsing files...');
      createTsConfigFileInFolder(tempDir);
      execSync(
        `npm install -g typescript --quiet && cd ${tempDir} && npx --yes tsc --noCheck`,
      );
      deleteSpecificFilesInFolder(`${tempDir}/striped`, ['types.js']);
      console.log('Files parsed successfully.');
    }

    console.log('Creating theme...');
    const createdFolderPath = createFolder({
      folderName: themeName || result.themeName,
      customDirPath,
      directory: process.cwd(),
    });
    copyFiles(isJsx ? `${tempDir}/striped` : `${tempDir}`, createdFolderPath);
    console.log('Theme created successfully.');
  });
