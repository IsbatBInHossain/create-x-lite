#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProject } from './src/commands/createProject.js';
import { input } from '@inquirer/prompts';
import { ExitPromptError } from '@inquirer/core';
import chalk from 'chalk';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pkg = require('./package.json');

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .version(pkg.version)
  .argument('[project-name]', 'The name for your new project')
  .description('Scaffold a new Express.js project')
  .action(async projectName => {
    try {
      let finalProjectName = projectName;

      // If the project name wasn't provided, prompt the user for it
      if (!finalProjectName) {
        finalProjectName = await input({
          message: 'What would you like to name your project?',
          validate: value =>
            value.length > 0 ? true : 'Project name cannot be empty.',
        });
      }
      await createProject(finalProjectName, {
        dirname: path.join(__dirname, 'src', 'commands'),
      });
    } catch (err) {
      if (err instanceof ExitPromptError) {
        console.log(
          chalk.yellow('\n👋 Project creation cancelled. See you next time!')
        );
        process.exit(0);
      } else {
        console.error(chalk.red('An unexpected error occurred:'), err);
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
