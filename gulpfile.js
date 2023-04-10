import gulp from 'gulp';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import { compileStyles } from './gulp/compileStyles.js';
import { copy, copyImages, copySvg } from './gulp/copyAssets.js';
import { compileScripts } from './gulp/compileScripts.js';
import {
  optimizeSvg,
  sprite,
  createWebp,
  optimizePng,
  optimizeJpg,
} from './gulp/optimizeImages.js';
import { compilePug } from './gulp/compilePug.js';

const server = browserSync.create();
const streamStyles = () => compileStyles().pipe(server.stream());
const clean = () => deleteAsync('build');
const refresh = (done) => {
  server.reload();
  done();
};

const syncServer = () => {
  server.init({
    server: 'build/',
    index: 'sitemap.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/pug/**/*.pug', gulp.series(compilePug, refresh));
  gulp.watch('source/sass/**/*.{scss,sass}', streamStyles);
  gulp.watch('source/js/**/*.{js,json}', gulp.series(compileScripts, refresh));
  gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
  gulp.watch(
    'source/img/**/*.svg',
    gulp.series(copySvg, sprite, compilePug, refresh)
  );
  gulp.watch(
    'source/img/**/*.{png,jpg,webp}',
    gulp.series(copyImages, compilePug, refresh)
  );

  gulp.watch('source/favicon/**', gulp.series(copy, refresh));
  gulp.watch('source/video/**', gulp.series(copy, refresh));
  gulp.watch('source/downloads/**', gulp.series(copy, refresh));
  gulp.watch('source/*.php', gulp.series(copy, refresh));
};

const build = gulp.series(
  clean,
  copy,
  sprite,
  gulp.parallel(
    compileStyles,
    compileScripts,
    compilePug,
    optimizePng,
    optimizeJpg,
    optimizeSvg
  )
);

const start = gulp.series(
  clean,
  copy,
  sprite,
  gulp.parallel(compileStyles, compileScripts, compilePug),
  syncServer
);

export { createWebp as webp, build, start };
