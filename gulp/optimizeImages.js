import gulp from 'gulp';
import rename from 'rename';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import pngQuant from 'imagemin-pngquant';
import mozJpeg from 'imagemin-mozjpeg';
import svgo from 'imagemin-svgo';

export const sprite = () =>
  gulp
    .src('source/img/sprite/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));

export const optimizeSvg = () =>
  gulp
    .src('build/img/**/*.svg')
    .pipe(
      imagemin([
        svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeRasterImages',
              active: true,
            },
            {
              name: 'removeUselessStrokeAndFill',
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest('build/img'));

export const optimizeJpg = () =>
  gulp
    .src('build/img/**/*.{jpg,jpeg}')
    .pipe(imagemin([mozJpeg({ quality: 90, progressive: true })]))
    .pipe(gulp.dest('build/img'));

export const optimizePng = () =>
  gulp
    .src('build/img/**/*.png')
    .pipe(
      imagemin([
        pngQuant({
          speed: 1,
          strip: true,
          dithering: 1,
          quality: [0.8, 0.9],
        }),
      ])
    )
    .pipe(gulp.dest('build/img'));

export const createWebp = () => {
  const root = '';
  return gulp
    .src(`source/img/${root}**/*.{png,jpg}`)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`source/img/${root}`));
};
