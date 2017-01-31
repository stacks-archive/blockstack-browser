import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('mockCore', shell.task([
  'node ./utils/mockBlockstackCoreApi.js 8889 blockstack'
]))
