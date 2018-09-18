const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync').create(),
  imagemin = require('gulp-imagemin'),
  collector = require('gulp-rev-collector'),
  replace = require('gulp-string-replace'),
  gulpif = require('gulp-if'),
  minimist = require('minimist'),
  polyfill = require('babel-polyfill')

var config = minimist(process.argv.slice(2) || 'production')

var isReplace_js = function () {
  return replace(/https:\/\/www\.eelly\.test/,'http://localhost:8083')
}

var pxToRem = function () {
  // return replace(/px/,function () {
  //   return 'rem'
  // })

}

// sass预编译
gulp.task('css', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(autoprefixer())
    // .pipe(pxToRem())
    .pipe(sass())
  .pipe(gulp.dest('dist/css'))
})


gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(gulpif(config.env=== 'development',isReplace_js()))
    .pipe(babel())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist')) // 不处理html
  // .pipe(browserSync.stream())
})

gulp.task('imagemin', function () {
  return gulp.src('app/images/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.jpegtran({ optimizationLevel: 7 })
    ]))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('server', [ 'css', 'js', 'html', 'imagemin' ], function () {
  browserSync.init({
    files: [ 'dist/**/*' ],
    server: {
      baseDir: 'dist',
      index: '/index.html'
    },
    port: '8083'
  })
  gulp.watch('app/scss/*.scss', [ 'css' ])
  gulp.watch('app/js/*.js', [ 'js' ])
  gulp.watch('app/*.html', [ 'html' ])
  gulp.watch('app/images/*', [ 'imagemin' ])
})

gulp.task('default', [ 'server' ]);
