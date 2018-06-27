const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')

imagemin(['build/images/**/*.{jpg,png}'], 'build/images', {
  use: [imageminWebp({ quality: 45 })]
}).then(() => {
  console.log('Images converted to webp!')
})
