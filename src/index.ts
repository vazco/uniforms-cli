import { Command } from 'commander';
import { version } from '../package.json';
import { init } from './commands/init';
import { createForm } from './commands/createForm';
import { miau } from './commands/miau';

(async () => {
  const program = new Command();

  program.version(version).description('CLI for uniforms').option('');

  program.addCommand(init).addCommand(createForm).addCommand(miau);

  program.parse();
})();
