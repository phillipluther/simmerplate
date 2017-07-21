
var
    // normalized pathing
    path = require('path'),
    src = path.resolve(__dirname, './src'),
    lib = path.resolve(__dirname, './lib'),
    nodeModules = path.resolve(__dirname, './node_modules'),
    sources = {
        built: path.join(lib, './*.css'),
        css: path.join(src, '**/*.css'),
        dest: lib,
        fonts: path.join(src, './fonts/**/*.ttf'),
        normalize: path.join(nodeModules, './normalize.css/normalize.css'),
        simmerplate: path.join(src, './simmerplate.css'),
        variants: path.join(src, './simmerplate-*.css'),
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
    rename = require('gulp-rename'),
    refresh = require('gulp-refresh'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('lint', function() {
    return gulp.src([sources.simmerplate, sources.variants])
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

gulp.task('clean', function() {
    del(sources.dest);
});

gulp.task('build-core', ['lint'], function() {
    return gulp.src([sources.normalize, sources.simmerplate])
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(autoprefix(autoprefixConf))
            .pipe(concat('simmerplate.css'))
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
    return gulp.src(sources.dest)
        .pipe(refresh());
});

gulp.task('build-prod', ['build'], function() {
    return gulp.src(sources.built)
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(minify())
            .pipe(rename({
                suffix: '.min'
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sources.dest));
});

gulp.task('clean-and-build-prod', ['clean', 'build-prod']);

gulp.task('watch', ['build'], function() {
    refresh.listen();

    gulp.watch(sources.css, [
        'build'
    ]);
});
