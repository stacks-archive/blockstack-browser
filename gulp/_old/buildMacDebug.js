import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMacDebug', shell.task([
  'xcodebuild -workspace ./native/macos/Blockstack/Blockstack.xcworkspace -scheme Blockstack -configuration Debug'
]))
