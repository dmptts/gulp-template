import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import gcmq from 'gulp-group-css-media-queries';
import pug from 'gulp-pug';
import cached from 'gulp-cached';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.cjs';

export const compilePug = () => {
  return gulp
    .src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(cached('pug'))
    .pipe(gulp.dest('build'));
};

const sass = gulpSass(dartSass);

export const styles = () => {
  return gulp
    .src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          grid: true,
        }),
      ])
    )
    .pipe(gcmq()) // выключить, если в проект импортятся шрифты через ссылку на внешний источник
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'));
};

export const scripts = () => {
  return gulp
    .src(['src/js/index.js'])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/js'));
};
