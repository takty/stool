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


gulp.task('docs-lib', () => gulp.src(['node_modules/stile/dist/**/*'])
	.pipe($.plumber())
	.pipe($.rename((p) => { p.dirname = p.dirname.replace(path.sep + 'dist', ''); }))
	.pipe(gulp.dest('./stile/'))
);

gulp.task('docs-sass', gulp.series('sass', () => gulp.src('docs/style.scss')
	.pipe($.plumber())
	.pipe($.sourcemaps.init())
	.pipe($.sass({ outputStyle: 'compressed' }))
	.pipe($.autoprefixer({ remove: false }))
	.pipe($.rename({ extname: '.min.css' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./docs')))
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
