'use strict';

import gulp   from 'gulp';
import config from '../config';

gulp.task('copyStyles', function() {
  return gulp.src(
    [
      config.sourceDir + 'styles/*.css',
      config.sourceDir + '../node_modules/bootstrap/dist/css/*',
      config.sourceDir + '../node_modules/font-awesome/css/*',
    ]
  ).pipe(gulp.dest(config.buildDir + 'css/'));
});
