/* eslint-disable consistent-return  */
/* eslint-disable global-require  */
const requireHacker = require('require-hacker')
const mock = require('mock-require')

// Images are empty strings
requireHacker.hook('png', () => 'module.exports = ""')
requireHacker.hook('svg', () => 'module.exports = ""')
requireHacker.hook('webp', () => 'module.exports = ""')
requireHacker.hook('css', () => 'module.exports = ""')

// Stub out workers
const workers = ['encrypt', 'decrypt', 'crypto-check']
function makeWorkerFactory(module) {
  return () => module
}

workers.forEach(worker => {
  const path = `../app/js/utils/workers/${worker}.worker.js`
  const source = require(path)
  return mock(path, makeWorkerFactory(source))
})
