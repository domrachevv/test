import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import Config from './tools/config';
import { loadTasks } from './tools/utils';
const settings = require('./tools/tasks/extra/buildSettings');
const removeDirRecursive = require('./tools/tasks/extra/removeDirRecursive');

loadTasks(Config.SEED_TASKS_DIR);
loadTasks(Config.PROJECT_TASKS_DIR);


// --------------
// Build dev light.
gulp.task('build.dev', (done: any) =>
  runSequence(//'clean.dev',
              //'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.index.dev',
              'build.server.dev',
              'copy.server.assets',
    done));

// Build dev_full
gulp.task('build.dev_full', (done: any) =>
  runSequence('clean.dev',
              //'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.index.dev',
              'build.server.dev',
              'copy.server.assets',
    done));

// --------------
// Build dev watch.
gulp.task('build.dev.watch', (done: any) =>
  runSequence('build.dev',
              'watch.dev',
              done));

// --------------
// Build e2e.
gulp.task('build.e2e', (done: any) =>
  runSequence('clean.dev',
              'tslint',
              'build.assets.dev',
              'build.js.e2e',
              'build.index.dev',
              'build.server.dev',
              'copy.server.assets',
              done));

// --------------
// Build prod.
gulp.task('build.prod', (done: any) =>
  runSequence('check.tools',
              'clean.prod',
              //'tslint',
              'build.assets.prod',
              'build.html_css',
              'copy.prod',
              'copy.server.js.prod',
              'build.server.prod',
              'build.js.prod',
              'build.bundles',
              'build.bundles.app',
              'minify.bundles',
              'build.index.prod',
              'copy.server.assets',
              done));

// --------------
// Build prod.
gulp.task('build.prod.exp', (done: any) =>
  runSequence('check.tools',
              'clean.prod',
              'tslint',
              'build.assets.prod',
              'build.html_css',
              'copy.prod',
              'copy.server.js.prod',
              'build.server.prod',
              'compile.ahead.prod',
              'build.js.prod.exp',
              'build.bundles',
              'build.bundles.app.exp',
              'minify.bundles',
              'build.index.prod',
              'build.server.prod',
              'copy.server.assets',
              done));

// --------------
// Build test.
gulp.task('build.test', (done: any) =>
  runSequence('clean.once',
              //'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.js.test',
              'build.index.dev',
              'build.server.dev',
              'copy.server.assets',
              done));

// --------------
// Build test.server
gulp.task('build.test.server', (done: any) =>
  runSequence('clean.once',
              //'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.js.test.server',
              'build.index.dev',
              'build.server.dev',
              'copy.server.assets',
              done));

// --------------
// Build test watch.
gulp.task('test.watch', (done: any) =>
  runSequence('build.test',
              'watch.test',
              'karma.watch',
              done));


// --------------
// Docs
// gulp.task('docs', (done: any) =>
//   runSequence('build.docs',
//               'serve.docs',
//               done));

// --------------
// Serve dev
gulp.task('serve.dev', (done: any) =>
  runSequence('build.dev',
              'server.start',
              'watch.dev',
              done));

// --------------
// Serve e2e
gulp.task('serve.e2e', (done: any) =>
  runSequence('build.e2e',
              'server.start',
              'watch.e2e',
              done));


// --------------
// Serve prod
gulp.task('serve.prod', (done: any) =>
  runSequence('build.prod',
              'start.server.prod',
              done));


// --------------
// Serve prod exp
gulp.task('serve.prod.exp', (done: any) =>
  runSequence('build.prod.exp',
              'server.prod',
              done));

// --------------
// Test.
gulp.task('test', (done: any) =>
  runSequence('cleanup',
              'build.test',
              'karma.run',
              done));

// --------------
// Test.server.
gulp.task('test.server', (done: any) =>
  runSequence('cleanup',
              'build.test.server',
              'run.tests',
              done));

gulp.task('cleanup', function () {
  removeDirRecursive(settings.buildDir);
});

// --------------
// Clean directories after i18n
// TODO: find a better way to do it
gulp.task('clean.i18n', (done: any) =>
  runSequence('clear.files',
              done));

// --------------
// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('check.tools', 'clean.dev', 'clean.coverage', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});

