var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')

gulp.task('js', function () {
  gulp.src([
    'app/app.js',
    'app/components/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
})

gulp.task('watch', ['js'], function () {
  gulp.watch(['./app/**/*.js', '!./build/*.js'], ['js'])
})
