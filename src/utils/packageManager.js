import fs from 'fs-extra';
import path from 'path';

// Resolves the dependencies for a given template.
export const resolveDependencies = (templatePath, rootPath, options) => {
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

  if (options.validation) {
    const zodDep = allDeps.validators.zod;
    dependencies.zod = zodDep;
  }

  return { dependencies, devDependencies };
};

// Generates the package.json content as a string.
export const generatePackageJson = (
  projectName,
  dependencies,
  devDependencies,
  moduleSystem = 'esm',
  language = 'ts'
) => {
  const newPackageJson = {
    name: projectName,
    version: '1.0.0',
    description: '',
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

  if (moduleSystem === 'esm') {
    newPackageJson.type = 'module';
  } else {
    newPackageJson.type = 'commonjs';
  }
  if (language === 'ts') {
    newPackageJson.main = 'dist/index.js';
  } else {
    newPackageJson.main = 'src/index.js';
  }

  return JSON.stringify(newPackageJson, null, 2);
};
