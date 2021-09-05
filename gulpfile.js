/**
 *
 * Gulpfile
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2021-06-12
 *
 */


/* eslint-disable no-undef */
'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });


gulp.task('js', () => gulp.src('src/js/**/*.js')
	.pipe($.plumber())
	.pipe($.babel())
	.pipe($.terser())
	.pipe($.rename({ extname: '.min.js' }))
	.pipe(gulp.dest('./dist/js'))
);

gulp.task('sass', () => gulp.src(['src/sass/**/*.scss'], {base: 'src/sass'})
	.pipe($.plumber())
	.pipe($.changed('./dist/sass'))
	.pipe(gulp.dest('./dist/sass'))
);

gulp.task('watch', () => {
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('build', gulp.parallel('js', 'sass'));

gulp.task('default', gulp.series('build', 'watch'));


// -----------------------------------------------------------------------------


gulp.task('docs-sass', gulp.series('sass', () => gulp.src('docs/style.scss', { sourcemaps: true })
	.pipe($.plumber())
	.pipe($.dartSass({ outputStyle: 'compressed' }))
	.pipe($.autoprefixer({ remove: false }))
	.pipe($.rename({ extname: '.min.css' }))
	.pipe(gulp.dest('./docs/css', { sourcemaps: '.' })))
);

gulp.task('docs-js', gulp.series('js', () => gulp.src([
		'node_modules/stile/dist/js/stile-full.min.js',
		'dist/**/*.min.js'
	])
	.pipe($.plumber())
	.pipe(gulp.dest('./docs')))
);

gulp.task('docs-watch', () => {
	gulp.watch('src/js/**/*.js',     gulp.series('js', 'docs-js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('sass', 'docs-sass'));
	gulp.watch('docs/style.scss',    gulp.series('docs-sass'));
});

gulp.task('docs-build', gulp.parallel('docs-js', 'docs-sass'));

gulp.task('docs-default', gulp.series('docs-build', 'docs-watch'));

gulp.task('docs', gulp.parallel('default', 'docs-default'));
