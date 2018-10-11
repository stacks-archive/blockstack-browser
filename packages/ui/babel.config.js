module.exports = {
  presets: [
    ['@babel/env', { loose: true, useBuiltIns: 'usage', debug: true }],
    '@babel/react'
  ],
  plugins: ['@babel/plugin-transform-regenerator']
}
