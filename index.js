#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
const program = new Command();

program
  .version('0.0.1')
  .command('create <project-name>')
  .description('Scaffold a new Express.js project')
  .action(projectName => {
    console.log(
      chalk.green('🚀 Starting setup for new project:'),
      chalk.blue.bold(projectName)
    );
    console.log(chalk.green('Project setup complete!'));
  });

program.parse(process.argv);
