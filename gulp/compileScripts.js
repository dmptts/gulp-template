import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpackConfig from './../webpack.config.cjs';

export const compileScripts = () => {
  return gulp
    .src(['src/js/index.js'])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/js'));
};
