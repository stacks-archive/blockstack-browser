import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('compileBlockstackProxyForMac', shell.task([
  'nexe -i ./native/blockstackProxy.js -o ./native/macos/Blockstack/blockstackProxy'
]))
