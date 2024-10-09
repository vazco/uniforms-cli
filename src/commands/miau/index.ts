import open from 'open';
import { Command } from 'commander';

export const miau = new Command()
  .name('miau')
  .description('plays miau miau song')
  .action(async () => {
    await open('https://www.youtube.com/watch?v=AtPrjYp75uA');
  });
