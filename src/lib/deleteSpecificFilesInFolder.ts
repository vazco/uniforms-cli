import fs from 'node:fs';
import path from 'node:path';
import { bold, red } from 'kolorist';

export const deleteSpecificFilesInFolder = (
  folderPath: string,
  filesToDelete: string[],
) => {
  if (!fs.existsSync(folderPath)) {
    throw new Error(red('✖') + bold(' Operation cancelled'));
  }

  for (const file of filesToDelete) {
    const filePath = path.join(folderPath, file);
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }
};
