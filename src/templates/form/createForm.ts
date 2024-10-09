import { bridgeImports, themeImports } from '../../consts';
import { Bridges, Themes } from '../../types';

type CreateFormArgs = {
  theme: Themes;
  bridge: Bridges;
};

export const createForm = ({ theme, bridge }: CreateFormArgs) => {
  const bridgeImport = bridgeImports[bridge];
  const themeImport = themeImports[theme];
  if (!bridgeImport || !themeImports) {
    // todo - handle error
    console.log('no bridge or theme');
    return;
  }
  const bridgeImportString = `import ${bridgeImport.variable} from "${bridgeImport.package}"`;
  const themeImportString = `import { AutoField } from ${themeImport}`;

  const totalImports = `${bridgeImportString}\n${themeImportString}`;
  console.log(totalImports);
};
