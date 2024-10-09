import { bridgeImports, themeImports } from '../../consts';
import { Bridges, Themes } from '../../types';
import { formSchemas } from '../../schemas';

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
  const schemaCode = formSchemas[bridge];
  return `${themeImport}\n${schemaCode}\n\n${'<AutoForm schema={bridge} />'}`;
};
