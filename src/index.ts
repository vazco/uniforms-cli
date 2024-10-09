import { Command } from 'commander';
import { version } from '../package.json';
import { init } from './commands/init';

(async () => {
  const program = new Command();

  program.version(version).description('CLI for uniforms');

  program.addCommand(init);

  program.parse();
})();
