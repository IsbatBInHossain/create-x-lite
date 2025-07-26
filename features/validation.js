import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

// Injects the Zod validation feature into the scaffolded project.
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
  const routesExt = isTypeScript ? '.ts' : '.js';

  // Snippet paths
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

  // Destination paths
  const destMiddlewarePath = path.join(projectPath, 'src', 'middlewares');
  const destSchemaPath = path.join(projectPath, 'src', 'schemas');
  fs.ensureDirSync(destMiddlewarePath);
  fs.ensureDirSync(destSchemaPath);

  // Copy snippet files
  fs.copySync(
    path.join(snippetLangPath, middlewareFile),
    path.join(destMiddlewarePath, middlewareFile)
  );
  fs.copySync(
    path.join(snippetLangPath, schemaFile),
    path.join(destSchemaPath, schemaFile)
  );

  // Create a new user route to demonstrate validation
  const importOrRequire = mod => (isESM ? `import ${mod}` : `const ${mod}`);
  const fromOrRequire = path =>
    isESM ? `from '${path}';` : `= require('${path}');`;

  const userRouteContent = `${importOrRequire('{ Router }')} ${fromOrRequire(
    'express'
  )}
${importOrRequire('{ validate }')} ${fromOrRequire(
    `../middlewares/zod.middleware${routesExt}`
  )}
${importOrRequire('{ createUserSchema }')} ${fromOrRequire(
    `../schemas/user.schema${routesExt}`
  )}

const router = Router();

// This route is protected by Zod validation
router.post('/', validate(createUserSchema), (req, res) => {
  // If validation passes, the request body is safe to use
  res.status(201).json({ message: 'User created successfully!', user: req.body });
});

${isESM ? 'export default router;' : 'module.exports = router;'}`;

  const userRoutePath = path.join(
    projectPath,
    'src',
    'routes',
    `user.routes.${ext}`
  );
  fs.ensureFileSync(userRoutePath);
  fs.writeFileSync(userRoutePath, userRouteContent);

  // Modify the main index file to use the new user route
  const indexPath = path.join(projectPath, 'src', `index.${ext}`);
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  const userRouteImport = `${importOrRequire('userRouter')} ${fromOrRequire(
    `./routes/user.routes${routesExt}`
  )}`;
  const userRouteUse = `app.use('/api/v1/users', userRouter);`;

  indexContent = indexContent.replace(
    /(const app = express\(\);)/,
    `$1\n${userRouteImport}`
  );
  indexContent = indexContent.replace(
    /(app\.listen\()/s,
    `${userRouteUse}\n\n$1`
  ); // More robust injection point
  fs.writeFileSync(indexPath, indexContent);
};
