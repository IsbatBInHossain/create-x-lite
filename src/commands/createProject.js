import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { select } from '@inquirer/prompts';
import {
  resolveDependencies,
  generatePackageJson,
} from '../utils/packageManager.js';

export const createProject = async (projectName, options) => {
  console.log(
    chalk.blue('🚀 Creating project:'),
    chalk.green.bold(projectName)
  );

  const language = await select({
    message: 'Which language would you like to use?',
    choices: [
      {
        name: 'TypeScript',
        value: 'ts',
        description: 'A typed superset of JavaScript.',
      },
      {
        name: 'JavaScript',
        value: 'js',
        description: 'The classic, dynamic language.',
      },
    ],
  });

  console.log(`Test prompt: ${language}`);

  const projectPath = path.join(process.cwd(), projectName);
  const rootPath = path.resolve(options.dirname, '../../'); // Go up from src/commands to root
  const templatePath = path.join(rootPath, 'templates', 'ts-esm-feature');

  // Copy template files
  fs.copySync(templatePath, projectPath, {
    filter: src => !src.includes('template.json'), // exclude the template.json file
  });

  // Resolve dependencies from config files
  const { dependencies, devDependencies } = resolveDependencies(
    templatePath,
    rootPath
  );

  // Generate and write the new package.json
  const newPackageJsonContent = generatePackageJson(
    projectName,
    dependencies,
    devDependencies
  );
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    newPackageJsonContent
  );

  console.log(chalk.green.bold('Project scaffolded successfully!'));
  console.log(`\nNext steps:`);
  console.log(chalk.yellow(`  cd ${projectName}`));
  console.log(chalk.yellow(`  npm install`));
  console.log(chalk.yellow(`  npm run dev`));
};
