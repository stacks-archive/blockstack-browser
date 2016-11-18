'use strict';

import gulp    from 'gulp';
import {jsdom} from 'jsdom';
import {argv}  from 'yargs';
import gjc     from 'gulp-jsx-coverage';
import config  from '../config';

gulp.task('test', () => {

  let files;

  // Allow specification of a single test file
  if ( argv.f || argv.file ) {
    let singleFile = argv.f || argv.file;

    // Allow omission of directory and/or extension
    if ( singleFile.indexOf('tests/') === -1 ) { singleFile = `tests/${singleFile}`; }
    if ( singleFile.indexOf('.test.js') === -1 ) { singleFile += '.test.js'; }

    // Include top-level helper even when running specific tests
    files = ['tests/helper.js', singleFile];
  } else {
    // Default to all test files
    files = [config.scripts.test];
  }

  // Ensure that all window/DOM related properties
  // are available to all tests
  global.document = jsdom('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost'
  });
  global.window = document.defaultView;
  global.navigator = window.navigator;
  global.KeyboardEvent = window.KeyboardEvent;

  // Ensure that 'sinon' and 'chai' library methods will be
  // available to all tests
  global.sinon = require('sinon');
  global.assert = require('chai').assert;
  require('sinon-as-promised');

  return (gjc.createTask({
    src: files,

    istanbul: {
      coverageVariable: '__MY_TEST_COVERAGE__',
      exclude: /node_modules|tests|build|gulp|testHelpers/
    },

    transpile: {
      babel: {
        include: /\.jsx?$/,
        exclude: /node_modules/
      }
    },

    coverage: {
      reporters: ['text-summary', 'html'],
      directory: '__coverage__/'
    },

    mocha: {
      reporter: 'spec'
    },

    babel: {
      sourceMap: 'both'
    },

    cleanup: () => {
      process.exit(0);
    }
  }))();

});
