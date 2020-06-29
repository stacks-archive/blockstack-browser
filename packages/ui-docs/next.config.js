const withMdxEnhanced = require('next-mdx-enhanced');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const remarkPlugins = [
  require('remark-external-links'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-unwrap-images'),
  require('remark-slug'),
];

module.exports = withBundleAnalyzer(
  withMdxEnhanced({
    layoutPath: 'src/components/layouts',
    defaultLayout: true,
    fileExtensions: ['mdx'],
    remarkPlugins,
    extendFrontMatter: {
      process: mdxContent => {
        const regex = /\n(#+)(.*)/gm;
        const found = mdxContent.match(regex);
        const headings = found && found.length ? found.map(f => f.split('# ')[1]) : [];
        return {
          headings,
        };
      },
    },
  })({
    experimental: {
      modern: true,
      polyfillsOptimization: true,
      jsconfigPaths: true,
    },
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    webpack: (config, options) => {
      if (!options.isServer) {
        config.node['fs'] = 'empty';
      }
      if (!options.dev) {
        const splitChunks = config.optimization && config.optimization.splitChunks;
        if (splitChunks) {
          const cacheGroups = splitChunks.cacheGroups;
          const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
          if (cacheGroups.framework) {
            cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
              test,
            });
            cacheGroups.commons.name = 'framework';
          } else {
            cacheGroups.preact = {
              name: 'commons',
              chunks: 'all',
              test,
            };
          }
        }

        // Install webpack aliases:
        const aliases = config.resolve.alias || (config.resolve.alias = {});
        aliases.react = aliases['react-dom'] = 'preact/compat';

        // https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
        aliases['buble'] = '@philpl/buble';
      }

      return config;
    },
  })
);
