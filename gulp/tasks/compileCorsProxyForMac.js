import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('compileCorsProxyForMac', shell.task([
  // 'nexe -i ./node_modules/.bin/corsproxy -o ./native/macos/Blockstack/corsproxy'
  'nexe -i ./corsproxy/corsproxy.js -o ./native/macos/Blockstack/corsproxy'
]))
