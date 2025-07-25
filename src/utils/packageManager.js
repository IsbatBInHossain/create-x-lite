import fs from 'fs-extra';
import path from 'path';

// Resolves the dependencies for a given template.
export const resolveDependencies = (templatePath, rootPath) => {
  const allDeps = fs.readJsonSync(
    path.join(rootPath, 'src/constants/dependencies.json')
  );
  const templateConfig = fs.readJsonSync(
    path.join(templatePath, 'template.json')
  );

  const dependencies = {};
  const devDependencies = {};

  templateConfig.dependencies.forEach(key => {
    const [category, pkg] = key.split('.');
    dependencies[pkg] = allDeps[category][pkg];
  });

  templateConfig.devDependencies.forEach(key => {
    const [category, pkg] = key.split('.');
    devDependencies[pkg] = allDeps[category][pkg];
  });

  return { dependencies, devDependencies };
};

// Generates the package.json content as a string.
export const generatePackageJson = (
  projectName,
  dependencies,
  devDependencies
) => {
  const newPackageJson = {
    name: projectName,
    version: '1.0.0',
    description: '',
    main: 'dist/index.js',
    type: 'module',
    scripts: {
      start: 'node dist/index.js',
      dev: 'nodemon',
      build: 'tsc',
      lint: 'eslint .',
      format: 'prettier --write .',
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies,
    devDependencies,
  };
  return JSON.stringify(newPackageJson, null, 2);
};
