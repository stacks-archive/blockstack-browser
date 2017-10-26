'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('prod-windows', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = true;

  global.isWindows = true;

  process.env.NODE_ENV = 'production';

  runSequence(['imagemin', 'browserify', 'copyFonts','copyFontAwesomeFonts', 'copyStyles', 'copyIndex', 'copyIcons'], cb);

});
