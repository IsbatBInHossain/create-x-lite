import chalk from 'chalk';
import { executeCommand } from './executeCommand.js';
import path from 'path';

export const initiateGit = projectPath => {
  executeCommand('git', ['init'], { cwd: projectPath });
  executeCommand('git', ['add', '.'], { cwd: projectPath });
  executeCommand('git', ['commit', '-m', 'Initial commit from create-x-lite'], {
    cwd: projectPath,
  });
  console.log(
    chalk.gray(
      `📦 Initialized a Git repository at ${path.basename(projectPath)}`
    )
  );
};
