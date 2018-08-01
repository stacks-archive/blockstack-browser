/* eslint-disable consistent-return  */
/* eslint-disable global-require  */
const requireHacker = require('require-hacker')

// Images are empty strings
requireHacker.hook('png', () => 'module.exports = ""')
requireHacker.hook('svg', () => 'module.exports = ""')
requireHacker.hook('webp', () => 'module.exports = ""')
requireHacker.hook('css', () => 'module.exports = ""')
