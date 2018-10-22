module.exports = {
  presets: [
    ['@babel/env', { loose: true, useBuiltIns: 'usage' }],
    '@babel/react'
  ],
  plugins: ['@babel/plugin-transform-regenerator', '@babel/plugin-transform-runtime']
}
