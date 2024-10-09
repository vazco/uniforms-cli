import fs from 'node:fs';
import path from 'node:path';
import { createForm } from '../templates/form/createForm';
import { Bridges, Themes } from '../types';
import { red } from 'kolorist';

export const createFile = (
  theme: Themes,
  bridge: Bridges,
  extension: string,
  directory: string = process.cwd(),
  customDirPath?: string,
) => {
  const content = createForm({ theme, bridge });
  const fileName = `uniforms-form.${extension}`;
  const dirPath = path.join(
    directory,
    customDirPath ? `/${customDirPath}` : '',
  );
  const filePath = path.join(dirPath, fileName);

  if (!content) {
    throw new Error(red('Failed to create file'));
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath ? `/${dirPath}` : '', { recursive: true });
  }
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(`Error writing file ${filePath}:`, err);
    } else {
      console.log(`File ${fileName} has been saved in ${directory}.`);
    }
  });
};
