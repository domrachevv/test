# Introduction

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

This is a skeleton project for MEAN apps based on [Valentyn Yakymenko's](https://github.com/vyakymenko) [angular2-seed-express](https://github.com/vyakymenko/angular2-seed-express).
Include:
 
- Full include from [Valentyn Yakymenko's](https://github.com/vyakymenko) [angular2-seed-express](https://github.com/vyakymenko/angular2-seed-express).
- [Express](https://expressjs.com/) Node.js server for production/development build API.
- [MongoDB](https://www.mongodb.com/) full integration with configurable connection parameters.
- [PM2](http://pm2.keymetrics.io/) daemon for a server running.
- [Nginx](https://github.com/vyakymenko/angular2-nginx-config-example/blob/master/ng2-application.conf) configuration file for your server.

# Visual Studio Code

This project has full support for VS Code development including server side debugging. No additional actions required - there are 'debugging' menu options for your need:
- Start server debug (full)
- Start server debug (fast) - this configuration skips building 'scss' files thus speeding up the build a little bit
- Start server debug (no rebuild) - this one is handy to just start the node server, no build actions performed (extremely fast if you just want to restart the server with previously built sources)
- Start server debug (prod) - prod build and debug
- Start server debug (prod no rebuild)

# Fast start

For Angular 2 development information and wiki, look here:
 - [Angular2-Seed](https://github.com/mgechev/angular2-seed) This is our main parent repository
 - [Angular2-Seed-Express](https://github.com/mgechev/angular2-seed-express) This is our direct parent repository which we based our project on
 - [Angular2-Seed-WIKI](https://github.com/mgechev/angular2-seed/wiki) Wiki Information about Seed.
 - [Angular2-Seed-Advanced](https://github.com/mgechev/angular2-seed-advanced) It's a [Nathan's Walker](https://github.com/NathanWalker) child seed for multi-platform Angular2 apps.

```bash
git clone --depth 1 https://gitlab.com/azhiv/angular2-seed-mean.git
cd angular2-seed-mean
# install the project dependencies
$ npm install
# watches your files and uses livereload by default
$ npm start
# api document for the app
# $ npm run build.docs

# dev build
$ npm run build.dev
# prod build
$ npm run build.prod

# run Express server (keep in touch, only after `npm run build.prod` )
$ node app.server.prod.js
# or development
$ node app.server.dev.js

# run server in daemon mode
$ pm2 start app.server.prod.js
```

# Need to know

Before starting development. Run your development server:
```sh
# run dev server
$ node app.server.dev.js
```

# Express Server

Express server run for prod build.

```sh
# run Express server (keep in touch, only after `npm run build.prod` )
# keep in mind that prod build will be builded with prod env flag
$ node app.server.prod.js

# run Express server in dev mode
$ node app.server.dev.js
```

# Daemonize Server

For daemonize your server I propose to use `PM2`.
```sh
# before daemonize production server `npm run build.prod`
$ pm2 start app.server.prod.js

# restart only your project
$ pm restart <id>
# restart all project on daemon
$ pm2 restart all

# in cluster mode ( example 4 workers )
$ pm2 start app.server.prod.js -i 4
```

More details about [PM2](http://pm2.keymetrics.io/)

# How to configure my NginX

```
##
# Your Angular.io NginX .conf
##

http {
  log_format gzip '[$time_local] ' '"$request" $status $bytes_sent';
  access_log /dev/stdout;
  charset utf-8;

  default_type application/octet-stream;

  types {
    text/html               html;
    text/javascript         js;
    text/css                css;
    image/png               png;
    image/jpg               jpg;
    image/svg+xml           svg svgz;
    application/octet-steam eot;
    application/octet-steam ttf;
    application/octet-steam woff;
  }


  server {
    listen            3353;
    server_name       local.example.com;

    root app/;
    add_header "X-UA-Compatible" "IE=Edge,chrome=1";

    location ~ ^/(scripts|styles)/(.*)$ {
      root .tmp/;
      error_page 404 =200 @asset_pass;
      try_files $uri =404;
      break;
    }

    location @asset_pass {
      root app/;
      try_files $uri =404;
    }

    location / {
      expires -1;
      add_header Pragma "no-cache";
      add_header Cache-Control "no-store, no-cache, must-revalicate, post-check=0 pre-check=0";
      root app/;
      try_files $uri $uri/ /index.html =404;
      break;
    }
  }

  server {
    listen 3354;

    sendfile on;

    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_http_version 1.1;
    gzip_disable      "MSIE [1-6]\.";
    gzip_min_length   1100;
    gzip_vary         on;
    gzip_proxied      expired no-cache no-store private auth;
    gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level   9;


    root dist/;

    location ~ ^/(assets|bower_components|scripts|styles|views) {
      expires     31d;
      add_header  Cache-Control public;
    }

    ##
    # Main file index.html
    ##
    location / {
      try_files $uri $uri/ /index.html =404;
    }
  }
}
```

You can look in source file [here](https://github.com/vyakymenko/angular2-nginx-config-example/blob/master/ng2-application.conf).



# Express Configuration

`src/server/index.ts`

```ts
var _clientDir = '../client'; // Dist prod folder.
```

`app.server.dev.js`
```js
// Configure server Port ( keep in mind that this is important if you will use reverse-proxy)
// Dev mode will give you only middleware.
// WARNING! DEPENDS ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Development`.
 */
require('./server')(9001, 'dev');
```

`app.server.prod.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Prod mode give you middleware + static.
// WARNING! DEPENDS ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Production`.
 */
require('./server')(9000);
```

# Reverse Proxy NginX Config Example
```
server {
    listen 80;

    # App Web Adress Listener
    server_name www.example.com example.com;

    location / {
        # Port where we have our daemon `pm2 start app.server.js`
        proxy_pass http://example.com:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# MongoDB Download/Install

 - About [MongoDB](https://www.mongodb.com/).
 - [Download](https://www.mongodb.com/download-center#community) and [install](https://docs.mongodb.com/manual/administration/install-community/) latest stable version of MongoDB.
 - [Documentation](https://docs.mongodb.com/manual/) about MongoDB.

# MongoDB Start
After installation we need to start our server:
```sh
# start server
$ mongod
```

# MongoDB app configuration
By default our node application uses the following connection: 'mongodb://localhost/mongotest'. To override this setting you can simply pass the connection string via the cmd parameter:
```sh
# start node dev server
$ node app.server.dev.js --mongo_connection=[target mongo connection]
```

or by setting MONGO_CONNECTION environment variable. The priority is

`command line parameter > environment variable > default connection`

# Karma test configuration
If you want to reconfigure Karma check karma.conf.js file.

# Karma test launcher
Karma tests are executed via the console:
```sh
$ npm test
```

# Mocha test configuration
If you want to reconfigure/extend Mocha check run.tests.ts

# Mocha test launcher
You have two options to kick off mocha tests:

- via console:

```sh
$ npm run test.server
```
- via 'Mocha tests' configuration launch

# Test launcher
To launch both karma and mocha tests run the following command:
```sh
$ npm run tests.all
```

Test launcher is also included as a part of 'build.prod' npm runnable script (i.e. `npm run build.prod`).

# Test coverage
Application coverage is gathered by Istanbul. The coverage data (from the latest tests launch - either Karma or Mocha) is summarized in `coverage/index.html`.
Alternatively this file will be opened as a result of the following command:
```sh
$ npm run serve.coverage 
```

# Change Log

You can follow the [Angular 2 change log here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

# License

MIT
