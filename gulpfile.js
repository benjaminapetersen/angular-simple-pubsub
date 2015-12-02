var gulp = require('gulp'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  gulp.src('./pubsub.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['jshint']);
