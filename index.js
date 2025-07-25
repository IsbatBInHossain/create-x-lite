#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import packageJson from './package.json' with { type: 'json' };
import { generatePackageJson } from './src/utils/packageManager.js';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .version(packageJson.version)
  .command('create <project-name>')
  .description('Scaffold a new Express.js project')
  .action((projectName) => {
    console.log(chalk.blue('🚀 Creating project:'), chalk.green.bold(projectName));

    const projectPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, 'templates', 'ts-esm-feature');
    
    fs.copySync(templatePath, projectPath);

    const packageJsonContent = generatePackageJson(projectName);
    fs.writeFileSync(path.join(projectPath, 'package.json'), packageJsonContent);

    console.log(chalk.green.bold('Project scaffolded successfully!'));
    console.log(`\nNext steps:`);
    console.log(chalk.yellow(`  cd ${projectName}`));
    console.log(chalk.yellow(`  npm install`));
    console.log(chalk.yellow(`  npm run dev`));
  });

program.parse(process.argv);