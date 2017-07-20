
var
    // normalized pathing
    path = require('path'),
    src = path.resolve(__dirname, './src'),
    nodeModules = path.resolve(__dirname, './node_modules'),
    sources = {
        css: path.join(src, '**/*.css'),
        dest: path.resolve(__dirname, './lib'),
        fonts: path.join(src, './fonts/**/*.ttf'),
        normalize: path.join(nodeModules, './normalize.css/normalize.css'),
        presswork: path.join(src, './presswork.css'),
        variants: path.join(src, './presswork-*.css'),
    },
    // config/build options
    autoprefixConf = {
        browsers: ['last 2 versions'],
        cascade: false
    },
    // gulpery
    gulp = require('gulp'),
    autoprefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat-css'),
    del = require('del'),
    lint = require('gulp-stylelint'),
    minify = require('gulp-clean-css'),
    refresh = require('gulp-refresh'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('lint', function() {
    return gulp.src([sources.presswork, sources.variants])
        .pipe(lint({
            failAfterError: false,
            reporters: [
                {
                    formatter: 'string',
                    console: true
                }
            ]
        }));
});

gulp.task('build-core', ['lint'], function() {
    return gulp.src([sources.normalize, sources.presswork])
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(autoprefix(autoprefixConf))
            .pipe(concat('presswork.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sources.dest));
});

gulp.task('build-variants', function() {
    return gulp.src(sources.variants)
        .pipe(autoprefix(autoprefixConf))
        .pipe(gulp.dest(sources.dest));
});

gulp.task('build-fonts', function() {
    var fontFolder = path.join(sources.dest, './fonts');
    return gulp.src(sources.fonts)
        .pipe(gulp.dest(fontFolder));
})

gulp.task('build', ['build-core', 'build-variants', 'build-fonts'], function() {
    refresh();
});

gulp.task('watch', ['build'], function() {
    refresh.listen();

    gulp.watch(sources.css, [
        'build'
    ]);
});
