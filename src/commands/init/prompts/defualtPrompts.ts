import { PromptObject } from 'prompts';
import { bold } from 'kolorist';
import { bridgeImports, bridges, themeImports, themes } from '../../../consts';
import { Bridges, Themes } from '../../../types';

export const getDefaultPrompts = ({
  bridge,
  theme,
}: {
  bridge: string;
  theme: string;
}): PromptObject[] => {
  const foundBridge = bridgeImports[bridge as Bridges];
  const foundTheme = themeImports[theme as Themes];

  return [
    {
      type: () => (foundBridge ? null : 'select'),
      name: 'bridge',
      message: bold('Select a bridge:'),
      choices: () =>
        bridges.map((bridge) => {
          const variantColor = bridge.color;
          return {
            title: variantColor(bridge.name),
            value: bridge.name,
          };
        }),
    },
    {
      type: () => (foundTheme ? null : 'select'),
      name: 'theme',
      message: bold('Select a theme:'),
      choices: () =>
        themes.map((theme) => {
          const variantColor = theme.color;
          return {
            title: variantColor(theme.name),
            value: theme.name,
          };
        }),
    },
  ];
};
