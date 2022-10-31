import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import { deleteAsync } from 'del';
import gulpPlumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import autoPrefixer from 'gulp-autoprefixer';
import GulpCleanCss from 'gulp-clean-css';
import webpack from 'webpack-stream';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import svgStore from 'gulp-svgstore';
import sourcemap from 'gulp-sourcemaps';

const isDev = !process.argv.includes('--build');

const copy = () => {
  return gulp.src([
    'src/fonts/**',
  ], {
    base: 'src'
  })
    .pipe(gulp.dest('./dist'));
}

const html = () => {
  return gulp.src('./src/*.html')
    .pipe(gulpPlumber())
    .pipe(fileinclude({
      basepath: "@root",
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
}

const sass = gulpSass(dartSass);

const scss = () => {
  return gulp.src('./src/scss/main.scss')
    .pipe(gulpPlumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(groupCssMediaQueries())
    .pipe(autoPrefixer())
    .pipe(GulpCleanCss())
    .pipe(rename({
      basename: 'styles.min'
    }))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
}

const js = () => {
  return gulp.src('./src/js/index.js')
    .pipe(gulpPlumber())
    .pipe(webpack({
      mode: isDev ? 'development' : 'production',
      output: {
        filename: 'index.min.js',
      },
      optimization: {
        minimize: isDev,
      },
      devtool: isDev ? 'source-map' : false,
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
}

const img = () => {
  return gulp.src('./src/img/content/*.{jpg,jpeg,png,gif,webp,svg}')
    .pipe(gulpPlumber())
    .pipe(newer('./dist/img/'))
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      optimizationLevel: 3,
    }))
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browserSync.stream());
}

const sprite = () => {
  return gulp.src('./src/img/sprite/*.svg')
    .pipe(gulpPlumber())
    .pipe(svgStore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browserSync.stream());
}

const createWebp = () => {
  return gulp.src('./src/img/content/**/*.{png,jpg,jpeg}')
    .pipe(newer('./src/img/content/'))
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('./src/img/content/'));
};

const reset = () => {
  return deleteAsync('./dist');
}

const server = () => {
  return browserSync.init({
    server: {
      baseDir: './dist/',
    },
    notify: false,
    port: 3000,
  });
}

const watcher = () => {
  gulp.watch('./src/**/*.html', html);
  gulp.watch('./src/scss/**/*.scss', scss);
  gulp.watch('./src/js/**/*.js', js);
  gulp.watch('./src/img/content/*.{jpg,jpeg,png,gif,webp,svg}', img);
  gulp.watch('./src/img/sprite/*.svg', sprite);
}

const mainTasks = gulp.parallel(copy, gulp.series(sprite, html), scss, js, img);

export const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
export const build = gulp.series(reset, mainTasks);

gulp.task('default', dev);
gulp.task('webp', createWebp);