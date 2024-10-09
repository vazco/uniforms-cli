import {
  blue,
  cyan,
  green,
  lightBlue,
  lightMagenta,
  lightRed,
  red,
  yellow,
} from 'kolorist';
import { Bridges, PackageManagers, Themes } from '../types';

export const bridges = [
  {
    name: Bridges.GraphQL,
    color: lightMagenta,
  },
  {
    name: Bridges.JSONSchema,
    color: blue,
  },
  {
    name: Bridges.SimpleSchema,
    color: lightRed,
  },
  {
    name: Bridges.SimpleSchema2,
    color: green,
  },
  {
    name: Bridges.ZOD,
    color: cyan,
  },
];

export const themes = [
  {
    name: Themes.Semantic,
    color: cyan,
  },
  {
    name: Themes.MUI,
    color: lightBlue,
  },
  {
    name: Themes.Bootstrap4,
    color: green,
  },
  {
    name: Themes.Bootstrap5,
    color: green,
  },
  {
    name: Themes.AntD,
    color: lightRed,
  },
];

export const packageManagers = [
  {
    name: PackageManagers.NPM,
    color: red,
  },
  {
    name: PackageManagers.YARN,
    color: blue,
  },
  {
    name: PackageManagers.PNPM,
    color: yellow,
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

export const fileTypes = [
  { color: blue, title: '.tsx', value: 'tsx' },
  { color: red, title: '.jsx', value: 'jsx' },
];
