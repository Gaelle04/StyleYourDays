const express = require("express");
const path = require("path");

const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");
app.set('views', __dirname);


  app.get('/',(req,res)=>{
    res.render('index');
  });

app.get('/about',(req, res) => {
    res.render('about');
});

app.get('/foryou',(req, res) => {
  res.render('foryou');
})

app.get('/latesttrends',(req, res) => {
  res.render('latesttrends');
});



const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

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
