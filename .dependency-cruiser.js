/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  extends: 'dependency-cruiser/configs/recommended',

  forbidden: [
    {
      name: 'component-cannot-import-pages-or-features',
      severity: 'error',
      from: { path: 'src/components*' },
      to: { path: ['^src/pages*', '^src/features/*'] },
    },
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: { circular: true },
    },
    {
      name: 'components-must-not-import-store',
      severity: 'error',
      from: { path: '^src/components/.*' },
      to: { path: '^src/store/.*' },
    },
    {
      name: 'features-cannot-import-pages',
      severity: 'error',
      from: { path: '^src/features/.*' },
      to: { path: '^src/pages/.*' },
    },
    {
      name: 'background-cannot-import-content-scripts',
      severity: 'error',
      from: { path: '^src/background/.*' },
      to: { path: '^src/content-scripts/.*' },
    },
    {
      name: 'content-cannot-import-background-script',
      severity: 'error',
      from: { path: '^src/content-scripts/.*' },
      to: { path: '^src/background/.*' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg'],
    },
    webpackConfig: {
      fileName: './webpack/webpack.config.prod.js',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        /* pattern of modules that can be consolidated in the detailed
           graphical dependency graph. The default pattern in this configuration
           collapses everything in node_modules to one folder deep so you see
           the external modules, but not the innards your app depends upon.
         */
        collapsePattern: 'node_modules/[^/]+',
      },
      archi: {
        /* pattern of modules that can be consolidated in the high level
          graphical dependency graph. If you use the high level graphical
          dependency graph reporter (`archi`) you probably want to tweak
          this collapsePattern to your situation.
        */
        collapsePattern: '^(node_modules|packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+',
      },
    },
  },
};
