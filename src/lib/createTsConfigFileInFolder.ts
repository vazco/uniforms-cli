import fs from 'node:fs';
import path from 'node:path';

export const createTsConfigFileInFolder = (folderPath: string) => {
  const tsConfig = {
    include: [`./**/*`],
    compilerOptions: {
      outDir: `./striped`,
      target: 'es2020',
      module: 'es2020',
      strict: false,
      esModuleInterop: true,
      jsx: 'react',
      moduleResolution: 'node',
    },
  };

  const filePath = path.join(folderPath, 'tsconfig.json');
  fs.writeFileSync(filePath, JSON.stringify(tsConfig, null, 2));
};
