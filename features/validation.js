import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';

export const injectValidation = ({
  projectPath,
  rootPath,
  language,
  moduleSystem,
}) => {
  console.log(chalk.gray('🔧 Integrating Zod validation...'));

  const isTypeScript = language === 'ts';
  const isESM = moduleSystem === 'esm';
  const ext = isTypeScript ? 'ts' : 'js';

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

  const destMiddlewarePath = path.join(projectPath, 'src', 'middlewares');
  const destSchemaPath = path.join(projectPath, 'src', 'schemas');
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
  const templateString = fs.readFileSync(userRouteTemplatePath, 'utf8');
  const template = handlebars.compile(templateString);

  // Generate content from template
  const userRouteContent = template({
    isESM: isESM,
  });

  // Write the new user route file
  const userRoutePath = path.join(
    projectPath,
    'src',
    'routes',
    `user.routes.${ext}`
  );
  fs.writeFileSync(userRoutePath, userRouteContent);

  const indexPath = path.join(projectPath, 'src', `index.${ext}`);
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  const userRouteImport = isESM
    ? `import userRouter from './routes/user.routes.js';`
    : `const userRouter = require('./routes/user.routes');`;
  const userRouteUse = `app.use('/api/v1/users', userRouter);`;

  indexContent = indexContent.replace(
    /(const app = express\(\);)/,
    `$1\n${userRouteImport}`
  );
  indexContent = indexContent.replace(
    /(app\.listen\()/s,
    `${userRouteUse}\n\n$1`
  );
  fs.writeFileSync(indexPath, indexContent);
};
