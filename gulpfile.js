const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

gulp.task('ejs', () => {
  return gulp.src('src/**/*.ejs')
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('ejs'));
