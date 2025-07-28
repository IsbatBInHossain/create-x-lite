import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { select, confirm } from '@inquirer/prompts';
import { ExitPromptError } from '@inquirer/core';
import { injectValidation } from '../../features/validation.js';
import {
  resolveDependencies,
  generatePackageJson,
} from '../utils/packageManager.js';
import { initiateGit } from '../utils/initiateGit.js';

// Recursively finds and deletes all temporariy files (e.g. .gitkeep) in a directory.
const cleanupFiles = directory => {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    const tempFiles = ['.gitkeep'];

    if (stat.isDirectory()) {
      cleanupFiles(fullPath);
    } else if (tempFiles.includes(path.basename(fullPath))) {
      fs.unlinkSync(fullPath);
    }
  }
};

export const createProject = async (projectName, options) => {
  try {
    let projectPath = path.join(process.cwd(), projectName);
    const formattedProjectName = path.basename(projectPath);
    const isYes = options.yes;
    // console.log(chalk.redBright(`Debug: ${JSON.stringify(options)}`)); //! for Debug only

    // Directory and Name Validation
    if (projectName === '.') {
      projectPath = process.cwd();
      const files = fs.readdirSync(projectPath);
      if (files.length > 0) {
        const proceed = await confirm({
          message: `The current directory is not empty. Proceed?`,
          default: false,
        });
        if (!proceed) throw new ExitPromptError();
      }
    } else {
      if (fs.existsSync(projectPath)) {
        const proceed = await confirm({
          message: `Directory ${chalk.yellow(
            projectName
          )} already exists. Overwrite?`,
          default: false,
        });
        if (!proceed) throw new ExitPromptError();
        fs.emptyDirSync(projectPath); // Clear the directory if overwrite is confirmed
      } else {
        fs.ensureDirSync(projectPath);
      }
    }

    console.log(
      chalk.blue('🚀 Creating project:'),
      chalk.green.bold(formattedProjectName)
    );

    const language = options.typescript
      ? 'ts'
      : isYes
      ? 'js'
      : await select({
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

    const moduleSystem = options.commonjs
      ? 'cjs'
      : isYes
      ? 'esm'
      : await select({
          message: 'Which module system would you like to use?',
          choices: [
            { name: 'ESM (ECMAScript Modules)', value: 'esm' },
            { name: 'CommonJS', value: 'cjs' },
          ],
        });

    const structure = options.traditional
      ? 'traditional'
      : isYes
      ? 'feature'
      : await select({
          message: 'Which project structure do you prefer?',
          choices: [
            {
              name: 'Feature-based (recommended)',
              value: 'feature',
              description:
                'Group code by feature (e.g., /users, /products). Great for larger projects.',
            },
            {
              name: 'Traditional',
              value: 'traditional',
              description:
                'Separate code by responsibility (e.g., /controllers, /routes). Familiar MVC pattern.',
            },
          ],
          theme: {
            style: {
              description: text => chalk.yellowBright(text),
            },
          },
        });

    const validation = options.zod
      ? true
      : isYes
      ? false
      : await confirm({
          message: 'Add Zod for schema validation?',
          default: false, // Default to No
        });

    console.log(
      chalk.blue(
        `✨ Scaffolding a ${
          language === 'ts' ? 'TypeScript' : 'JavaScript'
        } project...`
      )
    );

    const noGit = !options.git;
    const git = noGit
      ? false
      : isYes
      ? true
      : await confirm({
          message: 'Initialize git repository?',
          default: true,
        });

    const rootPath = path.resolve(options.dirname, '../../');

    // Determine which template to use based on the user's choice
    const templateDir = `templates/${language}-${moduleSystem}-${structure}`;
    const templatePath = path.join(rootPath, templateDir);

    // Copy template files
    fs.copySync(templatePath, projectPath, {
      filter: src => !src.includes('template.json'), // exclude the template.json file
    });

    // Resolve dependencies from config files
    const { dependencies, devDependencies } = resolveDependencies(
      templatePath,
      rootPath,
      { validation }
    );

    // Generate and write the new package.json
    const newPackageJsonContent = generatePackageJson(
      formattedProjectName,
      dependencies,
      devDependencies,
      moduleSystem,
      language
    );
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      newPackageJsonContent
    );

    if (validation) {
      injectValidation({
        projectPath,
        rootPath,
        language,
        moduleSystem,
        structure,
      });
    }
    // Cleanup
    console.log(chalk.gray('🧹 Cleaning up temporary files...'));
    cleanupFiles(projectPath);
    if (git) {
      initiateGit(projectPath);
    }

    console.log(chalk.green.bold('\n✅Project scaffolded successfully!'));
    console.log(`\nNext steps:`);
    if (projectName !== '.') {
      console.log(chalk.yellow(`  cd ${formattedProjectName}`));
    }
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
