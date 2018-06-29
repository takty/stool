'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({pattern:['gulp-*']});


gulp.task('js', () => {
	return gulp.src('src/js/**/*.js')
		.pipe($.plumber())
		.pipe($.babel({presets: [['env', {targets: {ie: 11}}]]}))
		.pipe($.uglify())
		.pipe($.rename({extname: '.min.js'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', () => {
	return gulp.src(['src/sass/**/*.scss'], {base: 'src/sass'})
		.pipe($.plumber())
		.pipe($.changed('dist/sass'))
		.pipe(gulp.dest('dist/sass'));
});

gulp.task('watch', () => {
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('build', gulp.parallel('js', 'sass'));

gulp.task('default', gulp.series('build', 'watch'));


// -----------------------------------------------------------------------------

gulp.task('docs-sass', gulp.series('sass', () => {
	return gulp.src('docs/style.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.autoprefixer({browsers: ['ie >= 11'], remove: false}))
		.pipe($.rename({extname: '.min.css'}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('docs'));
}));

gulp.task('docs-watch', () => {
	gulp.watch('src/sass/**/*.scss', gulp.series('docs-sass'));
	gulp.watch('docs/style.scss',    gulp.series('docs-sass'));
});

gulp.task('docs-build', gulp.series('docs-sass'));

gulp.task('docs-default', gulp.series('docs-build', 'docs-watch'));

gulp.task('docs', gulp.parallel('default', 'docs-default'));
