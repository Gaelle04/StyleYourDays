const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

// Task to compile EJS to HTML
gulp.task('ejs', () => {
  return gulp.src('src/**/*.ejs')
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'));
});

// Task to copy CSS files to dist directory
gulp.task('copy-css', () => {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist'));
});

// Task to copy JavaScript files to dist directory
gulp.task('copy-js', () => {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'));
});

// Default task to run all tasks
gulp.task('default', gulp.series('ejs', 'copy-css', 'copy-js'));
