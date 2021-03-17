const core = require('@actions/core');
const appPackage = require('../../../package.json');

const illegalVersionSymbol = ['~', '^', '>', '<'];

function containsIllegalChar(input) {
  return illegalVersionSymbol.some(symbol => input.includes(symbol));
}

(async () => {
  try {
    const dependencies = appPackage.dependencies;
    const devDependencies = appPackage.devDependencies;

    const allPackages = [...Object.entries(dependencies), ...Object.entries(devDependencies)];

    const illegalPackages = allPackages
      .filter(([package, version]) => containsIllegalChar(version))
      .map(([package, version]) => ({ package, version }));

    if (illegalPackages.length > 0) {
      core.setFailed(`
        There are packages with non-exact versions defined. This presents a security risk.
        ${JSON.stringify(illegalPackages, null, 2)}
      `);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
