const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')

imagemin(['build/static/images/**/*.{jpg,png}'], 'build/static/images', {
  use: [imageminWebp({ quality: 45 })]
}).then(() => {
  console.log('Images converted to webp!')
})
