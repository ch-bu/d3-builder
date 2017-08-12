'use strict';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import include from 'gulp-include';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
const babel = require('gulp-babel');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

/**
 * Lint javascript files
 */
gulp.task('lint', () =>
  gulp.src('app/app.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

gulp.task('babel', () => {
  return gulp.src('app/babel/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('app'));
});


/**
 * Watch files for changes & reload
 */
gulp.task('serve', ['babel'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    port: 3002,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'https://open-api.bahn.de');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
      }
    }
  });

  gulp.watch(['app/*.html'], reload);
  gulp.watch(['app/babel/*.js'], ['babel', 'lint', reload]);
});
