import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMacReleaseBuildDMG', shell.task([
  'rm -Rf ./native/macos/export/Blockstack.dmg; node ./node_modules/appdmg/bin/appdmg.js ./native/macos/dmg.json ./native/macos/export/Blockstack.dmg'
]))
