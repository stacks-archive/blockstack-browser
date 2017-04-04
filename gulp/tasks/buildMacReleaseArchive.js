import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMacReleaseArchive', shell.task([
  'xcodebuild -workspace ./native/macos/Blockstack/Blockstack.xcworkspace -scheme Blockstack -configuration Release -archivePath ./native/macos/archive/Blockstack archive'
]))
