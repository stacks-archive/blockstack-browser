'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev', ['clean'], function(cb) {
  console.log(process.argv)
  if(process.argv.length < 5) {
    console.error("Please provide your Core API password as an argument to this npm script:")
    console.error("npm run dev -- --api-password <password>")
    console.error("or")
    console.error("npm run dev-ui -- --api-password <password>")
    process.exit()
  } else {
    var spawn = require('child_process').spawn;
    console.log("Configuring Core API password...")
    require('fs').writeFileSync('./app/js/utils/core-api-password.js', `export const CORE_API_PASSWORD = '${process.argv[4]}'`);
  }
  cb = cb || function() {};

  global.isProd = false;

  process.env.NODE_ENV = 'test';

  return runSequence(['imagemin', 'browserify', 'copyFonts', 'copyFontAwesomeFonts', 'copyStyles', 'copyIndex', 'copyIcons'], 'watch', cb);

});
