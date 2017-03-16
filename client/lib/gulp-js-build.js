const browserify = require('browserify');
const gulp = require('gulp');
const gulpBuffer = require('gulp-buffer');
const eventStream = require('event-stream');
const gulpPlumber = require('gulp-plumber');
const gulpUglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');
const gulpRename = require('gulp-rename');
const envify = require('envify/custom');

/**
 * simple log function used in pipeline
 * @param {object} vinyl file object
 */
const printFilePath = (file, done) => {
  gulpUtil.log( file.path );
  done(null, file);
};

const bundler = (filepath, envifyOption = {}) => {
  const b = browserify(filepath, {
    extensions: ['.js', '.jsx']
  });

  b.transform(envify(envifyOption));

  return b;
};

/**
 * @param {Object} buildParam
 * @param {Object} buildParam.jsSrcFiles 1st argument for gulp.src and list of entry points for browserify to bundle
 * @param {string} buildParam.jsDestPath destination directory
 *
 * @param {Object} [options]
 * @param {boolean} [options.isUglify] enable uglifing built js (default -> true
 * @param {boolean} [options.isVerbose] enable verbose log in this task (default -> false
 * @param {boolean} [options.exitOnError] enable to exit when error has occured in this taks (default -> false
 * @param {string}  [options.nodeEnv] production or development default -> production
 */
module.exports = function(buildParam, options) {
  var JS_SRC_FILES = buildParam.jsSrcFiles;
  var JS_DEST_PATH = buildParam.jsDestPath;

  options = Object.assign({
    isUglify: true,
    isVerbose: false,
    exitOnError: true,
    nodeEnv: 'production'
  }, options);

  var isUglify = options.isUglify;
  var isVerbose = options.isVerbose;
  var exitOnError = options.exitOnError;

  return gulp.src(JS_SRC_FILES, {read: false})
          .pipe(
            exitOnError ?
              gulpUtil.noop() :
              gulpPlumber({
                errorHandler (error) {
                  gulpUtil.log(error.message);
                  gulpUtil.log(error.stack);
                  this.emit('end');
                }
              })
          )
          .pipe(eventStream.map((file, done) => {
            gulpUtil.log('bundling ' + file.path);
            // replace contents with browserify's bundle stream
            bundler(file.path, {NODE_ENV: options.nodeEnv})
              .bundle( (err, buf) => {
                if (err) {
                  done(err);
                  return;
                }

                file.contents = buf;
                gulpUtil.log(`done bundle ${file.path}`);
                done(null, file);
              });
          }))
          // convert into buffer contents
          // since gulp-rev does not support streaming
          .pipe(gulpBuffer())
          .pipe(gulpRename({
            extname: '.js'
          }))
          .pipe(isUglify ? gulpUglify() : gulpUtil.noop())
          .on('error', (error) => {
            gulpUtil.log(error);
            throw error;
          })
          .pipe(isVerbose ? eventStream.map(printFilePath) : gulpUtil.noop())
          .pipe(gulp.dest(JS_DEST_PATH));
};
