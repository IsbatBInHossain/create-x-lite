#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProject } from './src/commands/createProject.js';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .version('0.0.1')
  .command('create <project-name>')
  .description('Scaffold a new Express.js project')
  .action(projectName => {
    createProject(projectName, {
      dirname: path.join(__dirname, 'src', 'commands'),
    });
  });

program.parse(process.argv);
