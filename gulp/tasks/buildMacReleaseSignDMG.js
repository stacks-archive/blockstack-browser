import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMacReleaseSignDMG', shell.task([
  'codesign --force --sign "Developer ID Application: Appartisan Limited" ./native/macos/export/Blockstack.dmg'
]))
