import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('mock-core', shell.task([
  'node ./utils/mockBlockstackCoreApi.js'
]))
