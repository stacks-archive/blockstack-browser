'use strict';

import gulp   from 'gulp';
import config from '../config';

gulp.task('copyFonts', function() {

  return gulp.src([config.sourceDir + '../node_modules/font-awesome/fonts/**/*'])
    .pipe(gulp.dest(config.buildDir + 'fonts/'));

});
