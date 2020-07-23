module.exports = {
  rollup(config, options) {
    if (options.format === 'esm') {
      config = { ...config, preserveModules: true };
      config.output = { ...config.output, dir: 'dist/', entryFileNames: '[name].esm.js' };
      delete config.output.file;
    }
    return config;
  },
};
