export const generatePackageJson = projectName => {
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
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies: {
      cors: 'latest',
      dotenv: 'latest',
      express: 'latest',
      helmet: 'latest',
    },
    devDependencies: {
      '@eslint/js': 'latest',
      eslint: 'latest',
      'typescript-eslint': 'latest',
      globals: 'latest',
      '@types/cors': 'latest',
      '@types/express': 'latest',
      '@types/node': 'latest',
      nodemon: 'latest',
      prettier: 'latest',
      tsx: 'latest',
      typescript: 'latest',
    },
  };
  return JSON.stringify(newPackageJson, null, 2);
};
