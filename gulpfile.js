var gulp     = require('gulp');
var plumber  = require('gulp-plumber');
var uglify   = require('gulp-uglify');
var rename   = require('gulp-rename');

gulp.task('js', function () {
	gulp.src('src/js/**/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
	gulp.src(['src/sass/**'], {base: 'src/sass'})
	.pipe(gulp.dest('dist/sass'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('build', ['js', 'sass']);
gulp.task('default', ['js', 'sass', 'watch']);
