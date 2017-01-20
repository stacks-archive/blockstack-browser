import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('compileBlockstackMockCoreForMac', shell.task([
  'nexe -i ./utils/mockBlockstackCoreApi.js -o ./native/macos/Blockstack/mockBlockstackCoreApi'
]))
