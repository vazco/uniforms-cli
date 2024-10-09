import { blue, cyan, green, lightBlue, lightMagenta, lightRed } from 'kolorist';

export const bridges = [
  {
    name: 'GraphQl',
    color: lightMagenta,
  },
  {
    name: 'JSON-Schema',
    color: blue,
  },
  {
    name: 'Simple-Schema',
    color: lightRed,
  },
  {
    name: 'Simple-Schema-2',
    color: green,
  },
  {
    name: 'Zod',
    color: cyan,
  },
];

export const themes = [
  {
    name: 'Semantic',
    color: cyan,
  },
  {
    name: 'MUI',
    color: lightBlue,
  },
  {
    name: 'Bootstrap4',
    color: green,
  },
  {
    name: 'Bootstrap5',
    color: green,
  },
  {
    name: 'AntD',
    color: lightRed,
  },
];

export const defaultTargetDir = 'uniforms-project';

export const bridgeImports = {
  GraphQl: { variable: 'GraphQLBridge', package: 'uniforms-bridge-graphql' },
  'JSON-schema': {
    variable: '{ JSONSchemaBridge }', // todo - handle this `special` case
    package: 'uniforms-bridge-json-schema',
  },
  'Simple-Schema': {
    variable: 'SimpleSchemaBridge',
    package: 'uniforms-bridge-simple-schema',
  },
  'Simple-Schema-2': {
    variable: 'SimpleSchema2Bridge',
    package: 'uniforms-bridge-simple-schema-2',
  },
  Zod: { variable: 'ZodBridge', package: 'uniforms-bridge-zod' },
};

export const themeImports = {
  Semantic: 'uniforms-semantic',
  MUI: 'uniforms-mui',
  Bootstrap4: 'uniforms-bootstrap4',
  Bootstrap5: 'uniforms-bootstrap5',
  AntD: 'uniforms-antd',
};
