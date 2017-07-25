
var
    // normalized pathing
    path = require('path'),
    src = path.resolve(__dirname, './src'),
    source = {
        common: path.join(src, './simmerplate-common.css'),
        normalize: path.resolve(__dirname, './node_modules/normalize.css/normalize.css'),
        sans: path.join(src, './simmerplate-sans.css'),
        sansFont: path.resolve(__dirname, './fonts/Lato*.ttf'),
        serif: path.join(src, './simmerplate-serif.css'),
        serifFont: path.resolve(__dirname, './fonts/ZillaSlab*.ttf'),
    },
    output = {
        css: path.resolve(__dirname, './css'),
        downloads: path.resolve(__dirname, './downloads'),
        temp: path.resolve(__dirname, './temp'),
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
gulp.task('clean-css', function() {
    return del(output.css);
});

gulp.task('clean-downloads', function() {
    return del(output.downloads);
});

gulp.task('clean-temp', function() {
    return del(output.temp);
});

gulp.task('clean', ['clean-css', 'clean-downloads', 'clean-temp']);


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
            .pipe(concat(variantFile, {
                rebaseUrls: false, // our build accounts for relative pathing
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.css));
}

gulp.task('build-sans', ['lint'], function() {
    return extendCommon('sans');
});

gulp.task('build-serif', ['lint'], function() {
    return extendCommon('serif');
});

gulp.task('build', ['build-sans', 'build-serif']);

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

gulp.task('build-prod', ['build-min', 'bundle']);



/**
 * ========================================================
 * Bundling/Zipping
 */

// helper functions to package up font and CSS files into a single archive; as
// with the extendCommon method above we expect a variant of sans or serif
function copyFont(variant) {
    var
        sourceKey = variant + 'Font',
        outputPath = path.join(output.temp, './' + variant + '/fonts');

    return gulp.src(source[sourceKey]).pipe(gulp.dest(outputPath));
}

function copyCss(variant) {
    var
        cssPattern = './simmerplate-' + variant + '*.css*',
        cssFiles = path.join(output.css, cssPattern),
        outputPath = path.join(output.temp, './' + variant + '/css');

    return gulp.src(cssFiles).pipe(gulp.dest(outputPath));
}

function bundle(variant) {
    var
        sourcePath = path.join(output.temp, './' + variant + '/**/*'),
        bundleName = 'simmerplate-' + variant + '.zip';

    gulp.src(sourcePath)
        .pipe(zip(bundleName))
        .pipe(gulp.dest(output.downloads));
}

/* ... sans ... */
gulp.task('copy-sansFont', ['clean-temp'], function() {
    return copyFont('sans');
});

gulp.task('copy-sansCss', ['build-min'], function() {
    return copyCss('sans');
});

gulp.task('bundle-sans', ['copy-sansFont', 'copy-sansCss'], function() {
    return bundle('sans');
});

/* ... serif ... */
gulp.task('copy-serifFont', ['clean-temp'], function() {
    return copyFont('serif');
});

gulp.task('copy-serifCss', ['build-min'], function() {
    return copyCss('serif');
});

gulp.task('bundle-serif', ['copy-serifFont', 'copy-serifCss'], function() {
    return bundle('serif');
});

// we bookend this process with deleting the temp folder to make sure we start
// from scratch and end clean
gulp.task('bundle', ['bundle-sans', 'bundle-serif']);



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
