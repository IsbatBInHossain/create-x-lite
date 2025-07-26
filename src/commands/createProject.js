import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { select } from '@inquirer/prompts';
import { ExitPromptError } from '@inquirer/core';
import {
  resolveDependencies,
  generatePackageJson,
} from '../utils/packageManager.js';

export const createProject = async (projectName, options) => {
  try {
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
        },
        {
          name: 'JavaScript',
          value: 'js',
        },
      ],
    });

    console.log(
      chalk.blue(
        `✨ Scaffolding a ${
          language === 'ts' ? 'TypeScript' : 'JavaScript'
        } project...`
      )
    );

    const projectPath = path.join(process.cwd(), projectName);
    const rootPath = path.resolve(options.dirname, '../../');

    // Determine which template to use based on the user's choice
    const templateDir = `templates/${language}-esm-feature`;
    const templatePath = path.join(rootPath, templateDir);

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

    console.log(chalk.green.bold('\n✅Project scaffolded successfully!'));
    console.log(`\nNext steps:`);
    console.log(chalk.yellow(`  cd ${projectName}`));
    console.log(chalk.yellow(`  npm install`));
    console.log(chalk.yellow(`  npm run dev`));
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
};
