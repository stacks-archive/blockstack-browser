import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildBlockstackVenvForMac', shell.task([
  'bash ./native/macos/build_blockstack_virtualenv.sh'
]))
