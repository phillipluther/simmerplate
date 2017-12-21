
var
    // normalized pathing
    path = require('path'),
    src = path.resolve(__dirname, './src'),
    source = {
        common: path.join(src, './simmerplate-common.scss'),
        normalize: path.resolve(__dirname, './node_modules/normalize.css/normalize.css'),
        sans: path.join(src, './simmerplate-sans.css'),
        serif: path.join(src, './simmerplate-serif.css'),
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
    sass = require('gulp-sass'),
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
        variantFile = 'simmerplate-' + variant + '.scss',
        variantSource = path.join(src, variantFile);

    return gulp.src(variantSource)
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.temp));
}

function normalizeAndPrefix(variant) {
    var
        variantFile = 'simmerplate-' + variant + '.css',
        tempBuild = path.join(output.temp, variantFile);

    return gulp.src([source.normalize, tempBuild])
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(concat(variantFile, {
                rebaseUrls: false, // our build accounts for relative pathing
            }))
            .pipe(autoprefix(autoprefixConf))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.css));
}

gulp.task('sass-sans', ['lint'], function() {
    return extendCommon('sans');
});

gulp.task('sass-serif', ['lint'], function() {
    return extendCommon('serif');
});

gulp.task('build-sans', ['sass-sans'], function() {
    return normalizeAndPrefix('sans');
});

gulp.task('build-serif', ['sass-serif'], function() {
    return normalizeAndPrefix('serif');
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
gulp.task('copy-sansCss', ['build-min'], function() {
    return copyCss('sans');
});

gulp.task('bundle-sans', ['copy-sansCss'], function() {
    return bundle('sans');
});

/* ... serif ... */
gulp.task('copy-serifCss', ['build-min'], function() {
    return copyCss('serif');
});

gulp.task('bundle-serif', ['copy-serifCss'], function() {
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

    gulp.watch(src + '/**/*.scss', [
        'build'
    ]);
});
