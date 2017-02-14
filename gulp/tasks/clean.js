'use strict';

import gulp   from 'gulp';
import del    from 'del';
import config from '../config';


gulp.task('clean', function() {
  var spawn = require('child_process').spawn;
  spawn('rm', ['-Rf', './native/macos/Blockstack/Blockstack/browser/']);
  spawn('mkdir', ['./native/macos/Blockstack/Blockstack/browser/']);
  spawn('touch', ['./native/macos/Blockstack/Blockstack/browser/.gitkeep']);

  return del([config.buildDir]);

});
