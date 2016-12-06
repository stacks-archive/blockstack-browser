import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('proxy', shell.task([
  './node_modules/.bin/corsproxy'
]))
