
var
    // normalized pathing
    path = require('path'),
    src = path.resolve(__dirname, './src'),
    //lib = path.resolve(__dirname, './lib'),
    //nodeModules = path.resolve(__dirname, './node_modules'),
    source = {
        common: path.join(src, './simmerplate-common.css'),
        normalize: path.resolve(__dirname, './node_modules/normalize.css/normalize.css'),
        sans: path.join(src, './simmerplate-sans-css'),
        sansFont: path.resolve(__dirname, './fonts/Lato*.ttf'),
        serif: path.join(src, './simmerplate-serif.css'),
        serifFont: path.resolve(__dirname, './fonts/ZillaSlab*.ttf'),
        //built: path.join(lib, './*.css'),
        //css: path.join(src, '**/*.css'),
        //dest: lib,
        //fonts: path.join(src, './fonts/**/*.ttf'),
        //normalize: path.join(nodeModules, './normalize.css/normalize.css'),
        //simmerplate: path.join(src, './simmerplate.css'),
        //variants: path.join(src, './simmerplate-*.css'),
    },
    output = {
        css: path.resolve(__dirname, './css'),
        downloads: path.resolve(__dirname, './downloads')
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
    sourcemaps = require('gulp-sourcemaps'),
    zip = require('gulp-zip');


/**
 * ========================================================
 * Linting
 */
gulp.task('lint', function() {
    return gulp.src([source.common, source.sans, source.serif])
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


/**
 * ========================================================
 * Cleaning
 */
gulp.task('del-css', function() {
    return del(output.css);
});

gulp.task('del-downloads', function() {
    return del(output.downloads);
});

gulp.task('clean', ['del-css', 'del-downloads']);


/**
 * ========================================================
 * Building
 */

// simple helper for building off our common/normalize core; expects 'sans',
// or 'serif'
function extendCommon(variant) {
    var
        variantFile = 'simmerplate-' + variant + '.css',
        variantSource = path.join(src, variantFile);

    return gulp.src([source.normalize, source.common, variantSource])
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(autoprefix(autoprefixConf))
            .pipe(concat(variantFile))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.css));
}

gulp.task('build-sans', ['lint'], function() {
    return extendCommon('sans');
});

gulp.task('build-serif', ['lint'], function() {
    return extendCommon('serif');
});

gulp.task('build', ['build-sans', 'build-serif'], function() {
    refresh();
});

gulp.task('build-min', ['build'], function() {
    var built = path.join(output.css, '*.css');

    return gulp.src(built)
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(minify())
            .pipe(rename({
                suffix: '.min'
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.css));
});

// helper function to package up font and CSS files into a single archive; as
// with the extendCommon method above we expect a variant of sans or serif
function bundleCssAndFonts(variant) {
    var
        sourceKey = variant + 'Font',
        fontFiles = source[sourceKey],
        cssFiles = path.join(output.css, 'simmerplate-' + variant + '*'),
        bundleName = 'simmerplate-' + variant + '.zip';

    return gulp.src([fontFiles, cssFiles])
        .pipe(zip(bundleName))
        .pipe(gulp.dest(output.downloads));
}

gulp.task('build-sansDownload', ['build-min'], function() {
    return bundleCssAndFonts('sans');
});

gulp.task('build-serifDownload', ['build-min'], function() {
    return bundleCssAndFonts('serif');
});

gulp.task('build-downloads', ['build-sansDownload', 'build-serifDownload']);

gulp.task('build-prod', ['build-min', 'build-downloads']);


/**
 * ========================================================
 * Development Flow
 */
gulp.task('watch', ['build'], function() {
    refresh.listen();

    gulp.watch(src + '/simmerplate*.css', [
        'build'
    ]);
});
