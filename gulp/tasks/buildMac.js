import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMac', shell.task([
  'xcodebuild -project ./native/macos/Blockstack/Blockstack.xcodeproj'
]))
