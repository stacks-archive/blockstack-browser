const withTM = require('./with-tm')(['@blockstack/ui']);

const withPlugins = require('next-compose-plugins');

const remarkPlugins = [
  require('remark-autolink-headings'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-slug'),
  require('remark-unwrap-images'),
];

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
  },
});

module.exports = withMDX(
  withTM({
    experimental: {
      modern: true,
      polyfillsOptimization: true,
      jsconfigPaths: true,
    },
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    webpack: (config, options) => {
      const aliases = config.resolve.alias || (config.resolve.alias = {});
      aliases['@blockstack/ui'] = require.resolve('../ui');
      if (!options.isServer) {
        config.node['fs'] = 'empty';
      }
      return config;
    },
  })
);
