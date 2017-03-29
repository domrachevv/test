import * as express from 'express';
import * as user from '../db/entity/user';
import { NameListServer } from './name.list';

let nameData = require('../data/name.list.json');

export function nameList(app: express.Application) {
  let nameListServer = new NameListServer;
  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req:any, res:any, next:any) => {
      var result = nameListServer.getStaticUsers();
      res.json(result);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req:any, res:any, next:any) => {
      nameListServer.getAllUsers().then((result: any) => {
        if (result.errors) {
              res.json({info: 'error during User create', error: result.errors});
          }
          res.json({info: 'User saved successfully', data: result});
      });
    });

  /**
   * Add new name.
   * @database
   */
  app.post('/api/name-list',
    (req:any, res:any, next:any) => {
      var newUser = new user(req.body);
      nameListServer.saveUser(newUser).then((res: any) => {
        if (res.errors) {
              res.json({info: 'error during User create', error: res.errors});
          }
          res.json({info: 'User saved successfully', data: newUser});
      });
    });
}
