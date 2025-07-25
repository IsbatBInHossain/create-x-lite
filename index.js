#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import packageJson from './package.json' with { type: 'json' };

// This is the modern way to get __dirname in an ES module
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
    
    // Copy the template directory to the new project path
    fs.copySync(templatePath, projectPath);

    // Process the EJS template for package.json
    const pkgJsonPath = path.join(projectPath, 'package.json.ejs');
    const pkgJsonContent = fs.readFileSync(pkgJsonPath, 'utf8');
    const renderedPkgJson = ejs.render(pkgJsonContent, { projectName: projectName });
    
    // Write the new package.json and remove the template file
    fs.writeFileSync(path.join(projectPath, 'package.json'), renderedPkgJson);
    fs.unlinkSync(pkgJsonPath);

    console.log(chalk.green.bold('✅ Project scaffolded successfully!'));
    console.log(`\nNext steps:`);
    console.log(chalk.yellow(`  cd ${projectName}`));
    console.log(chalk.yellow(`  npm install`));
    console.log(chalk.yellow(`  npm run dev`));
  });

program.parse(process.argv);