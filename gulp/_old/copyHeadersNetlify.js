'use strict';

import gulp   from 'gulp';
import config from '../config';

gulp.task('copyHeadersNetlify', function() {

  gulp.src([config.sourceDir + '_headers'])
    .pipe(gulp.dest(config.buildDir));

});
