import gulp from 'gulp';

export const copySvg = () =>
  gulp.src('source/img/**/*.svg', { base: 'source' }).pipe(gulp.dest('build'));

export const copyImages = () =>
  gulp
    .src('source/img/**/*.{png,jpg,jpeg,webp}', { base: 'source' })
    .pipe(gulp.dest('build'));

export const copy = () =>
  gulp
    .src(
      [
        'source/**.html',
        'source/fonts/**',
        'source/img/**',
        'source/favicon/**',
        'source/data/**',
      ],
      {
        base: 'source',
      }
    )
    .pipe(gulp.dest('build'));
