'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({pattern:['gulp-*']});


gulp.task('js', function () {
	return gulp.src('src/js/**/*.js')
		.pipe($.plumber())
		.pipe($.babel({presets: ['es2015']}))
		.pipe($.uglify())
		.pipe($.rename({extname: '.min.js'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
	return gulp.src(['src/sass/**/*.scss'], {base: 'src/sass'})
		.pipe($.plumber())
		.pipe($.changed('dist/sass'))
		.pipe(gulp.dest('dist/sass'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['build', 'watch']);


// -----------------------------------------------------------------------------

gulp.task('docs-sass', ['sass'], function () {
	return gulp.src('docs/style.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.autoprefixer(['ie >= 11']))
		.pipe($.rename({extname: '.min.css'}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('docs'));
});

gulp.task('docs-js', ['js'], function () {
	return gulp.src(['dist/js/stile-full.min.js'])
		.pipe($.plumber())
		.pipe(gulp.dest('docs'));
});

gulp.task('docs', ['default'], () => {
	gulp.watch('src/js/**/*.js',     ['docs-js']);
	gulp.watch('src/sass/**/*.scss', ['docs-sass']);
	gulp.watch('docs/style.scss',    ['docs-sass']);
});
