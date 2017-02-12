'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = false;

  process.env.NODE_ENV = 'test';

  return runSequence(['imagemin', 'browserify', 'copyFonts', 'copyStyles', 'copyIndex', 'copyIcons'], 'watch', cb);

});
