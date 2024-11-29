import path from 'node:path';
import fs from 'node:fs';

export const createFolder = ({
  folderName,
  directory,
  customDirPath,
}: {
  folderName: string;
  directory: string;
  customDirPath?: string;
}) => {
  const dirPath = path.join(
    directory,
    customDirPath ? `/${customDirPath}` : '',
    folderName,
  );

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
};
