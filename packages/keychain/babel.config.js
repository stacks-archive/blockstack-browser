module.exports = function (api) {

  // TODO: Should cache on api.caller and api.env for faster build times.
  api.cache.invalidate(() => true);

  const isTestEnv = api.env("test");
  const isDevEnv = api.env("development");

  // Babel config for web browser lib dist with wide-spread browser support.
  let opts = {
    presets: [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread"
    ]
  };

  // Use full source maps in development env.
  if (!opts.sourceMaps && isDevEnv) {
    opts.sourceMaps = "both";
  }

  return opts;
}
