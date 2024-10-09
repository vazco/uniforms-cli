import { bridgeImports, themeImports } from '../../consts';
import { Bridges, Themes } from '../../types';
import { formSchemas } from '../../schemas';
import { red } from 'kolorist';

type CreateFormArgs = {
  theme: Themes;
  bridge: Bridges;
};

export const createForm = ({ theme, bridge }: CreateFormArgs) => {
  const bridgeImport = bridgeImports[bridge];
  const themeImport = `import { AutoForm } from '${themeImports[theme]}'`;
  if (!bridgeImport || !themeImports) {
    throw new Error(red('No bridge or theme'));
  }
  const schemaCode = formSchemas[bridge];
  const componentCode = `export const Form = () => <AutoForm schema={bridge} />`;
  return `${themeImport}\n${schemaCode}\n\n${componentCode}`;
};
