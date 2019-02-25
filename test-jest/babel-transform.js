const fs = require('fs')
const path = require('path')

const { createTransformer } = require('babel-jest')

function makeConfig() {
  const filePath = path.resolve(__dirname, '../.babelrc')
  const rawContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const config = JSON.parse(rawContent)
  // config.presets[0][1].modules = 'commonjs'
  return config
}

module.exports = createTransformer(makeConfig())
