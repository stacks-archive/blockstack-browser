import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('compileBlockstackProxyForMac', shell.task([
  './node_modules/.bin/nexe -i ./native/blockstackProxy.js -o ./native/macos/Blockstack/blockstackProxy'
]))
