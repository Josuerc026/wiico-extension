var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pretty = require('gulp-jsbeautifier'),
    stripDebug = require('gulp-strip-debug');

var prjctRoot = 'wiico/';

gulp.task('sass', function(){
  gulp.src(prjctRoot + 'src/css/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(prjctRoot + 'dist/css'));
});

gulp.task('styles',function(){
  gulp.src(prjctRoot + 'dist/css/*.css')
      .pipe(pretty())
      .pipe(gulp.dest(prjctRoot + 'dist/css'));
});

gulp.task('scripts', function(){
  gulp.src(prjctRoot + 'src/js/*.js')
      .pipe(stripDebug())
      .pipe(pretty())
      .pipe(gulp.dest(prjctRoot + 'dist/js/'));
});

gulp.task('default', ['sass', 'watch', 'scripts', 'styles']);
gulp.task('watch', function(){
  gulp.watch(prjctRoot + 'src/css/*.scss', ['sass']);
  gulp.watch(prjctRoot + 'src/js/*.js', ['scripts']);
  gulp.watch(prjctRoot + 'dist/css/*.css', ['styles']);
});
