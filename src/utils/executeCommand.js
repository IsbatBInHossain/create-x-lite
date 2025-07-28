import { spawnSync } from 'child_process';
import path from 'path';

export const commandExists = command => {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(checker, [command], { shell: true });
  return result.status === 0;
};

export function executeCommand(command, args = [], options = {}) {
  const { cwd, silent = false, shell = false } = options;

  if (!commandExists(command)) {
    throw new Error(
      `❌ Command not found: "${command}". Make sure it's installed and in your PATH.`
    );
  }

  const result = spawnSync(command, args, {
    cwd: cwd ? path.resolve(cwd) : undefined,
    shell: shell,
    stdio: silent ? 'ignore' : 'inherit',
  });

  if (result.error) {
    throw new Error(
      `❌ Failed to execute "${command}": ${result.error.message}`
    );
  }

  if (result.status !== 0) {
    throw new Error(
      `❌ Command "${command} ${args.join(' ')}" failed with exit code ${
        result.status
      }`
    );
  }
}
