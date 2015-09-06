var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

var params = {
	out: 'public',
	htmlSrc: 'index.html',
	level: ['common.blocks']
};

gulp.task('default',['server'],['build']);

gulp.task('server',function(){
	browserSync.init({
		server: params.out
	});
});

gulp.task('build',['html']);

gulp.task('html', function(){
	gulp.src(params.htmlSrc)
	.pipe(rename('index.html'))
	.pipe(gulp.dest(params.out));
});
