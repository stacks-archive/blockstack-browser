'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('mac-release', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = true;

  process.env.NODE_ENV = 'production';

  runSequence('prod','copyBrowserForMac', 'compileBlockstackProxyForMac', 'compileCorsProxyForMac', 'buildBlockstackVenvForMac', 'buildMacReleaseArchive', 'buildMacReleaseExport', 'buildMacReleaseBuildDMG', 'buildMacReleaseSignDMG', cb);

});
