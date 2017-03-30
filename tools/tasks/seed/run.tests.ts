import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
const mocha = require('gulp-mocha');
const settings = require('../extra/buildSettings');

import Config from '../../config';
import { makeTsProject } from '../../utils';

const plugins = <any>gulpLoadPlugins();
const testSrc = settings.testRunDir + '/**/*.spec.js';
const wrap = require('../extra/wrap');

export = () => {
  return gulp.src(testSrc)
    .pipe(mocha({ 
      require: join(process.cwd(), 'mocha.conf.js')
    }));
};