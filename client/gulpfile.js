const { task, src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');

path = {
  toSass: './src/sass/**/*.scss',
  toCss: './src/css/'
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

task('watch', () => {
  watch(path.toSass, series('style'));
});
