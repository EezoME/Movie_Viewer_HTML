'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    //bourbon = require('node-bourbon'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    wait = require('gulp-wait'),
    uglify = require('gulp-uglifyjs');

var browserSync = require('browser-sync').create(),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps');
//var livereload = require('gulp-livereload');
//var uglify = require('gulp-uglify');

gulp.task('js', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({
        entries: './js/main.js',
        debug: true
    })
        .transform("babelify", {
            presets: ["es2015", "es2016"]
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./js/min'))
        .pipe(browserSync.stream());
});

// Scss stylesheets
gulp.task('stylesheets', function () {
    return gulp.src('stylesheets/**/*.scss')
        .pipe(wait(150))
        .pipe(sass({
            outputStyle: 'compressed',
            //includePaths: bourbon.includePaths
        })).on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    watch(['stylesheets/**/*.scss'], function (event, cb) {
        gulp.start('stylesheets');
    });
    watch(['./js/**/*.js', '!./js/min/*.js'], function (event, cb) {
        gulp.start('js');
    });

    gulp.watch("./*.html").on('change', browserSync.reload);
    // gulp.watch("./js/*.js").on('change', browserSync.reload);
});

gulp.task('serve', function () {
    browserSync.init({
        server: "./",
        // proxy: "http://local-site.loc/",
        open: true,
        port: 8081
    });

});

// Run
gulp.task('default', [
    'stylesheets',
    'serve',
    'js',
    'watch'
]);

gulp.task('wp', [
    'stylesheets',
    'watch'
]);
