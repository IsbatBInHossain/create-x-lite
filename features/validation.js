import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';

const getUserRouteInfos = (isESM, isFeature, isTypeScript) => {
  const basePath = isFeature
    ? './features/user/user.routes'
    : './routes/user.routes';
  const extension = isESM || isTypeScript ? '.js' : '';

  const userRouteImport =
    isESM || isTypeScript
      ? `import userRouter from '${basePath}${extension}';`
      : `const userRouter = require('${basePath}');`;

  const userRouteUse = `app.use('/api/v1/users', userRouter);`;

  return { userRouteImport, userRouteUse };
};

const getTemplateFile = isTypeScript => {
  return isTypeScript ? 'user.routes.ts.hbs' : 'user.routes.js.hbs';
};

export const injectValidation = ({
  projectPath,
  rootPath,
  language,
  moduleSystem,
  structure,
}) => {
  console.log(chalk.gray('🔧 Integrating Zod validation...'));

  const isTypeScript = language === 'ts';
  const isESM = moduleSystem === 'esm';
  const ext = isTypeScript ? 'ts' : 'js';
  const isFeature = structure === 'feature';

  // Snippet and Destination Paths
  const snippetBase = path.join(rootPath, 'snippets', 'validation');
  let snippetLangPath;
  if (isTypeScript) {
    snippetLangPath = path.join(snippetBase, 'ts');
  } else if (isESM) {
    snippetLangPath = path.join(snippetBase, 'js');
  } else {
    snippetLangPath = path.join(snippetBase, 'cjs');
  }

  const middlewareFile = `zod.middleware.${ext}`;
  const schemaFile = `user.schema.${ext}`;
  let destMiddlewarePath;
  let destSchemaPath;

  if (isFeature) {
    destMiddlewarePath = path.join(projectPath, 'src', 'core', 'middlewares');
    destSchemaPath = path.join(projectPath, 'src', 'features', 'user');
  } else {
    destMiddlewarePath = path.join(projectPath, 'src', 'middlewares');
    destSchemaPath = path.join(projectPath, 'src', 'schemas');
  }

  fs.ensureDirSync(destMiddlewarePath);
  fs.ensureDirSync(destSchemaPath);

  // Copy the static snippet files
  fs.copySync(
    path.join(snippetLangPath, middlewareFile),
    path.join(destMiddlewarePath, middlewareFile)
  );
  fs.copySync(
    path.join(snippetLangPath, schemaFile),
    path.join(destSchemaPath, schemaFile)
  );

  // User route generation
  console.log(
    chalk.gray('  -> Generating user routes from Handlebars template...')
  );

  const userRouteTemplatePath = path.join(
    rootPath,
    'snippets',
    'handlebars',
    'user.routes.hbs'
  );

  // Get template file
  const templateFile = getTemplateFile(isTypeScript);
  // Build a safe, absolute path
  const templatePath = path.join(
    rootPath,
    'snippets',
    'handlebars',
    templateFile
  );
  const templateString = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateString);

  const userRouteContent = template({
    isESM: isESM,
    isFeature: isFeature,
  });

  // Write the new user route file
  let userRoutePath;

  if (isFeature) {
    userRoutePath = path.join(
      projectPath,
      'src',
      'features',
      'user',
      `user.routes.${ext}`
    );
  } else {
    userRoutePath = path.join(
      projectPath,
      'src',
      'routes',
      `user.routes.${ext}`
    );
  }

  fs.createFileSync(userRoutePath);
  fs.writeFileSync(userRoutePath, userRouteContent);

  const indexPath = path.join(projectPath, 'src', `index.${ext}`);
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  const { userRouteImport, userRouteUse } = getUserRouteInfos(
    isESM,
    isFeature,
    isTypeScript
  );

  // Find any healthcheck import line and add user import after it
  indexContent = indexContent.replace(
    /((?:import|const).*healthcheckRouter.*(?:from|require).*healthcheck\.routes.*[;"'])/,
    `$1\n${userRouteImport}`
  );

  // Add route usage after healthcheck route
  indexContent = indexContent.replace(
    /(app\.use\(["']\/api\/v1\/healthcheck["'], healthcheckRouter\);)/,
    `$1\n\n${userRouteUse}`
  );
  fs.writeFileSync(indexPath, indexContent);
};
