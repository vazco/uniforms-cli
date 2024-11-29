import fs from 'node:fs';
import path from 'node:path';
import { createForm } from '../templates/form/createForm';
import { Bridges, Themes } from '../types';

export const createFile = (
  theme: Themes,
  bridge: Bridges,
  extension: string,
  directory: string,
  customDirPath?: string,
) => {
  const content = createForm({ theme, bridge });
  const fileName = `uniforms-form.${extension}`;
  const dirPath = path.join(
    directory,
    customDirPath ? `/${customDirPath}` : '',
  );
  const filePath = path.join(dirPath, fileName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath ? `/${dirPath}` : '', { recursive: true });
  }

  try {
    fs.writeFileSync(filePath, content);
    console.log(`File ${fileName} has been saved in ${directory}.`);
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
  }
};
