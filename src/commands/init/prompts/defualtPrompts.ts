import { PromptObject } from 'prompts';
import { bold } from 'kolorist';
import { bridges, themes } from '../../../consts';

export const defaultPrompts: PromptObject[] = [
  {
    type: 'select',
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
    type: 'select',
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
