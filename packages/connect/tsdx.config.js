const peerDepsExternal = require("rollup-plugin-peer-deps-external");

module.exports = {
  rollup(config) {
    config.plugins.push(
      peerDepsExternal()
    );
    return config;
  }
}
