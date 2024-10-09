import { PromptObject } from 'prompts';
import { bold, red } from 'kolorist';
import { existsSync } from 'node:fs';
import { defaultTargetDir } from '../../../consts';
import { getTargetDir } from '../../../lib/getTargetDir';
import { isDirEmpty } from '../../../lib/isDirEmpty';

export const getPromptsWithoutPackageJson = (): PromptObject[] => {
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
