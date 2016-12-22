/// <reference path="../../typings/index.d.ts" />

import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as routes from './routes';

import { Init } from './db/mongo';

var _clientDir = '../client';
var app = express();

export function init(port: number, mode: string) {

  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.text());
  app.use(compression());

  /* NOTE: This disables caching */
  app.all("/api/*", function noCache(req, res, next) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      res.header("Expires", "0");
      next();
  });

  // DB Init
  Init();

  app.use(express.static(path.resolve(process.cwd(), 'demo')));
  app.get(/^\/demo\/([a-zA-Z0-9/]+$)/, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let webLinkIndex = '/' + req.params[0] + '/demo/mbc/index.html';
    let relativePath = '/demo' + webLinkIndex;
    let indexPath = path.resolve(process.cwd(), '.' + relativePath);
    if (fs.existsSync(indexPath)) {
      res.redirect(webLinkIndex);
    }
    else {
      next();
    }
  });

  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode == 'dev') {
    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });

    routes.init(app);

    let root = path.resolve(process.cwd());
    app.use(express.static(root));
    app.use(express.static(_clientDir));

    let renderIndex = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };
    app.get('/*', renderIndex);
  }
  else {
    /**
     * Prod Mode.
     * @note Prod mod will give you static + middleware.
     */

    /**
     * Api Routes for `Production`.
     */
    routes.init(app);
    /**
     * Static.
     */
    app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
    app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
    app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));

    /**
     * Spa Res Sender.
     * @param req {any}
     * @param res {any}
     */
    let renderIndex = function (req: express.Request, res: express.Response) {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', renderIndex);
  }

  /**
   * Server with gzip compression.
   */
  return new Promise<http.Server>((resolve, reject) => {
    let server = app.listen(port, () => {
      var port = server.address().port;
      console.log('App is listening on port:' + port);
      resolve(server);
    });
  });
};
