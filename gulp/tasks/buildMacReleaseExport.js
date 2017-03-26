import gulp from 'gulp'
var shell = require('gulp-shell')


gulp.task('buildMacReleaseExport', shell.task([
  'xcodebuild -archivePath ./native/macos/archive/Blockstack.xcarchive -exportOptionsPlist ./native/macos/Blockstack/export.plist -exportArchive -exportPath ./native/macos/export/'
]))
