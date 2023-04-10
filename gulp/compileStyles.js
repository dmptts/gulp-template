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

const sass = gulpSass(dartSass);

export const compileStyles = () =>
  gulp
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
