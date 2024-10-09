import { Command } from 'commander';
import { version } from '../package.json';
import { init } from './commands/init';
import { miau } from './commands/miau';

(async () => {
  const program = new Command();

  program.version(version).description('CLI for uniforms');

  program.addCommand(init).addCommand(miau);

  program.parse();
})();
