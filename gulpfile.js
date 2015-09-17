var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

var params = {
    out : 'public',
    htmlSrc : 'index.html',
    levels : 'css'
};

gulp.task('default', ['server','build']);

//поднимаем сервер
gulp.task('server', function(){
    browserSync.init({
        server : params.out
    });
    //смотрим за изменениями в html  выполняем команду html
    gulp.watch('*.html', ['html']);
});

//Задача для сборки
gulp.task('build', ['html', 'css']);

//Сборка html файлов
gulp.task('html', function(){
    gulp.src(params.htmlSrc)
    .pipe(rename('index.html'))
    .pipe(gulp.dest(params.out))
    .pipe(reload({stream : true}));
});

gulp.task('css', function(){
    gulp.src(['css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(params.out))
    .pipe(reload({stream : true}));
});