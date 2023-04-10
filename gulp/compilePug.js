import gulp from 'gulp';
import pug from 'gulp-pug';
import cached from 'gulp-cached';

export const compilePug = () => {
  return gulp
    .src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(cached('pug'))
    .pipe(gulp.dest('build'));
};
