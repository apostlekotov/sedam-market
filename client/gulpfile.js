const { task, src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
// const imagemin = require('gulp-imagemin');

path = {
  toSass: './src/sass/**/*.scss',
  toCss: './src/css/',
  fromImg: './public/img/sales/*',
  toImg: './build/img/sales'
};

task('style', () => {
  return src(path.toSass)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(dest(path.toCss));
});

// task('compress', () => {
//   return src(path.fromImg)
//     .pipe(imagemin())
//     .pipe(dest(path.toImg));
// });

task('watch', () => {
  watch(path.toSass, series('style'));
  // watch(path.fromImg, series('compress'));
});
