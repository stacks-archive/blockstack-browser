'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev-windows', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = false;
  global.isWindows = true;

  process.env.NODE_ENV = 'test';

  return runSequence(['imagemin', 'browserify', 'copyFonts', 'copyFontAwesomeFonts', 'copyStyles', 'copyIndex', 'copyIcons'], 'watch', cb);

});
