'use strict';

import gulp   from 'gulp';
import del    from 'del';
import config from '../config';

gulp.task('copyBrowserForMac', function() {

  var spawn = require('child_process').spawn;
  spawn('touch', ['./build/.gitkeep']);

  return gulp.src([config.buildDir + '**/*', config.buildDir + '.gitkeep'])
    .pipe(gulp.dest('./native/macos/Blockstack/Blockstack/browser/'));

});
