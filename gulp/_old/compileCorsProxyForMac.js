import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('compileCorsProxyForMac', shell.task([
  // 'nexe -i ./node_modules/.bin/corsproxy -o ./native/macos/Blockstack/corsproxy'
  './node_modules/.bin/nexe -i ./corsproxy/corsproxy.js -o ./native/macos/Blockstack/corsproxy'
]))
