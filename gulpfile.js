'use strict';

const del = require('del');
const gulp = require('gulp');
const path = require('path');

const jsBuild = require('./client/lib/gulp-js-build.js');

const ROOT = __dirname;
const JS_SRC_FILES       = path.join(ROOT, 'client/src/**/*.*'); // watch target files
const JS_SRC_ENTRY_FILES = path.join(ROOT, 'client/src/*/*.*'); // entry points of browserify
const JS_DEST_PATH       = path.join(ROOT, 'public/client/builds'); // destination directory for built javasctipts

const jsBuildParams = {
  jsSrcFiles: [JS_SRC_ENTRY_FILES],
  jsDestPath: JS_DEST_PATH
};

gulp.task('build:js:production', ['clean'], () => {
  return jsBuild( jsBuildParams );
});

gulp.task('build:js:development', ['clean'], () => {
  return jsBuild( jsBuildParams, { isUglify: false, nodeEnv: 'development' } );
});

gulp.task('build:js:watch', ['clean'], () => {
  return jsBuild( jsBuildParams, { isUglify: false, exitOnError: false, isVerbose: true, nodeEnv: 'development' } );
});

// delete manifest and bundled files
gulp.task('clean', () => {
  return del([
    JS_DEST_PATH
  ]);
});

gulp.task('build:watch', ['build:js:watch']);
gulp.task('build:development', ['build:js:development']);
gulp.task('build:production', ['build:js:production']);
gulp.task('build:test', ['build:production']);

gulp.task('watch', ['build:development'], function(){
  gulp.watch(JS_SRC_FILES, ['build:watch']);
});
