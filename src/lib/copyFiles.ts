import fs from 'node:fs';
import path from 'node:path';

export const copyFiles = (sourceFolder: string, destinationFolder: string) => {
  if (!fs.existsSync(sourceFolder)) {
    console.error(`Source folder not found: ${sourceFolder}`);
    return;
  }

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  const files = fs.readdirSync(sourceFolder);
  for (const file of files) {
    const sourceFilePath = path.join(sourceFolder, file);
    const destinationFilePath = path.join(destinationFolder, file);

    if (fs.lstatSync(sourceFilePath).isFile()) {
      fs.copyFileSync(sourceFilePath, destinationFilePath);
    }
  }
};
