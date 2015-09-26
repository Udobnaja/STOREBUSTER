var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gcmq = require('gulp-group-css-media-queries'),
    cssmin = require('gulp-cssmin'),
    csscomb = require('gulp-csscomb'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    runTimestamp = Math.round(Date.now()/1000);

var params = {
    out : 'public',
    htmlSrc : '*.html',
    levels : 'css'
};

    /*getFileNames = require('html2bl').getFileNames(params);*/

gulp.task('default', ['server', 'build']);

//поднимаем сервер
gulp.task('server', function () {
    browserSync.init({
        server : params.out
    });
    //смотрим за изменениями в html  выполняем команду html
    gulp.watch('*.html', ['html']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('js/*.js', ['js']);
});

//Задача для сборки
gulp.task('build', ['html', 'css', 'images', 'js']);

//Сборка html файлов
gulp.task('html', function () {
    gulp.src(params.htmlSrc)
        .pipe(gulp.dest(params.out))
        .pipe(reload({stream : true}));
});

gulp.task('css', function () {
    
    gulp.src(['css/*.css'])
        .pipe(concat('styles.css'))
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] })]))
        .pipe(gcmq())
        .pipe(csscomb())
        .pipe(gulp.dest(params.out))
        /*.pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(params.out))*/
        .pipe(reload({stream : true}));
});

gulp.task('images', function () {
    gulp.src('images/*.{jpg,png,svg}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(params.out + '/images'));
});

gulp.task('js', function () {
    gulp.src('js/*.js')
        .pipe(gulp.dest(params.out + '/js'))
        .pipe(reload({stream : true}));
});

gulp.task('Iconfont', function(){
   gulp.src(['images/*.svg'])
    .pipe(iconfont({ fontName: 'storeBusters' }))
    .on('glyphs', function(glyphs) {
      var options = {
        glyphs: glyphs.map(function(glyph) {
          // this line is needed because gulp-iconfont has changed the api from 2.0
          return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
        }),
        fontName: 'storeBusters',
        fontPath: '/fonts/', 
        className: 'font-ico'
      };
      gulp.src('fonts-ico.css')
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename : 'storeBusters' }))
        .pipe(gulp.dest('css/')); // set path to export your CSS

    })
    .pipe(gulp.dest( params.out +'/fonts/')); // set path to export your fonts
});

