import { Command } from 'commander';
import { version } from '../package.json';
import { init } from './commands/init';
import { createForm } from './commands/createForm';

(async () => {
  const program = new Command();

  program.version(version).description('CLI for uniforms');

  program.addCommand(init).addCommand(createForm);

  program.parse();
})();
