/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  extends: 'dependency-cruiser/configs/recommended',

  forbidden: [
    {
      name: 'component-cannot-import-pages',
      // comment: 'pages cannot be imported by components',
      severity: 'error',
      to: { path: 'src/pages*' },
      from: { path: 'src/components*' },
    },

    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: {
        circular: true,
      },
    },

    // /* rules from the 'recommended' preset: */
    // {
    //   name: 'no-circular',
    //   severity: 'warn',
    //   comment:
    //     'This dependency is part of a circular relationship. You might want to revise ' +
    //     'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
    //   from: {},
    //   to: {
    //     circular: true,
    //   },
    // },
    // {
    //   name: 'no-orphans',
    //   comment:
    //     "This is an orphan module - it's likely not used (anymore?). Either use it or " +
    //     "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
    //     'add an exception for it in your dependency-cruiser configuration. By default ' +
    //     'this rule does not scrutinize dotfiles (e.g. .eslintrc.js), TypeScript declaration ' +
    //     'files (.d.ts), tsconfig.json and some of the babel and webpack configs.',
    //   severity: 'warn',
    //   from: {
    //     orphan: true,
    //     pathNot: [
    //       '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
    //       '\\.d\\.ts$', // TypeScript declaration files
    //       '(^|/)tsconfig\\.json$', // TypeScript config
    //       '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$', // other configs
    //     ],
    //   },
    //   to: {},
    // },
    // {
    //   name: 'no-deprecated-core',
    //   comment:
    //     'A module depends on a node core module that has been deprecated. Find an alternative - these are ' +
    //     "bound to exist - node doesn't deprecate lightly.",
    //   severity: 'warn',
    //   from: {},
    //   to: {
    //     dependencyTypes: ['core'],
    //     path: [
    //       '^(v8/tools/codemap)$',
    //       '^(v8/tools/consarray)$',
    //       '^(v8/tools/csvparser)$',
    //       '^(v8/tools/logreader)$',
    //       '^(v8/tools/profile_view)$',
    //       '^(v8/tools/profile)$',
    //       '^(v8/tools/SourceMap)$',
    //       '^(v8/tools/splaytree)$',
    //       '^(v8/tools/tickprocessor-driver)$',
    //       '^(v8/tools/tickprocessor)$',
    //       '^(node-inspect/lib/_inspect)$',
    //       '^(node-inspect/lib/internal/inspect_client)$',
    //       '^(node-inspect/lib/internal/inspect_repl)$',
    //       '^(async_hooks)$',
    //       '^(assert)$',
    //       '^(punycode)$',
    //       '^(domain)$',
    //       '^(constants)$',
    //       '^(sys)$',
    //       '^(_linklist)$',
    //       '^(_stream_wrap)$',
    //     ],
    //   },
    // },
    // {
    //   name: 'not-to-deprecated',
    //   comment:
    //     'This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later ' +
    //     'version of that module, or find an alternative. Deprecated modules are a security risk.',
    //   severity: 'warn',
    //   from: {},
    //   to: {
    //     dependencyTypes: ['deprecated'],
    //   },
    // },
    // {
    //   name: 'no-non-package-json',
    //   severity: 'error',
    //   comment:
    //     "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
    //     "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
    //     'available on live with an non-guaranteed version. Fix it by adding the package to the dependencies ' +
    //     'in your package.json.',
    //   from: {},
    //   to: {
    //     dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
    //   },
    // },
    // // {
    // //   name: 'not-to-unresolvable',
    // //   comment:
    // //     "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
    // //     'module: add it to your package.json. In all other cases you likely already know what to do.',
    // //   severity: 'error',
    // //   from: {},
    // //   to: {
    // //     couldNotResolve: true,
    // //   },
    // // },
    // {
    //   name: 'no-duplicate-dep-types',
    //   comment:
    //     "Likeley this module depends on an external ('npm') package that occurs more than once " +
    //     'in your package.json i.e. bot as a devDependencies and in dependencies. This will cause ' +
    //     'maintenance problems later on.',
    //   severity: 'warn',
    //   from: {},
    //   to: {
    //     moreThanOneDependencyType: true,
    //   },
    // },

    // /* rules you might want to tweak for your specific situation: */
    // {
    //   name: 'not-to-test',
    //   comment:
    //     "This module depends on code within a folder that should only contain tests. As tests don't " +
    //     "implement functionality this is odd. Either you're writing a test outside the test folder " +
    //     "or there's something in the test folder that isn't a test.",
    //   severity: 'error',
    //   from: {
    //     pathNot: '^(tests)',
    //   },
    //   to: {
    //     path: '^(tests)',
    //   },
    // },
    // {
    //   name: 'not-to-spec',
    //   comment:
    //     'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +
    //     "If there's something in a spec that's of use to other modules, it doesn't have that single " +
    //     'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',
    //   severity: 'error',
    //   from: {},
    //   to: {
    //     path: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$',
    //   },
    // },
    // {
    //   name: 'not-to-dev-dep',
    //   severity: 'error',
    //   comment:
    //     "This module depends on an npm package from the 'devDependencies' section of your " +
    //     'package.json. It looks like something that ships to production, though. To prevent problems ' +
    //     "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
    //     'section of your package.json. If this module is development only - add it to the ' +
    //     'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',
    //   from: {
    //     path: '^(src)',
    //     pathNot: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$',
    //   },
    //   to: {
    //     dependencyTypes: ['npm-dev'],
    //   },
    // },
    // {
    //   name: 'optional-deps-used',
    //   severity: 'info',
    //   comment:
    //     'This module depends on an npm package that is declared as an optional dependency ' +
    //     "in your package.json. As this makes sense in limited situations only, it's flagged here. " +
    //     "If you're using an optional dependency here by design - add an exception to your" +
    //     'depdency-cruiser configuration.',
    //   from: {},
    //   to: {
    //     dependencyTypes: ['npm-optional'],
    //   },
    // },
    // {
    //   name: 'peer-deps-used',
    //   comment:
    //     'This module depends on an npm package that is declared as a peer dependency ' +
    //     'in your package.json. This makes sense if your package is e.g. a plugin, but in ' +
    //     'other cases - maybe not so much. If the use of a peer dependency is intentional ' +
    //     'add an exception to your dependency-cruiser configuration.',
    //   severity: 'warn',
    //   from: {},
    //   to: {
    //     dependencyTypes: ['npm-peer'],
    //   },
    // },
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
