import { Application, Request, Response, NextFunction } from 'express';
import { User } from '../db/entity/user';
import { NameListServer } from './name.list';

let nameData = require('../data/name.list.json');

export function nameList(app: Application) {
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
    (req: Request, res: Response, next: NextFunction) => {
      nameListServer.getAllUsers().then((result: any) => {
        if (result.errors) {
              res.json({ info: 'error during User create', error: result.errors });
          }
          res.json({ info: 'User saved successfully', data: result });
      });
    });

  /**
   * Add new name.
   * @database
   */
  app.post('/api/name-list',
    (req:any, res:any, next:any) => {
      var newUser = new User(req.body);
      nameListServer.saveUser(newUser).then((res: any) => {
        if (res.errors) {
              res.json({ info: 'error during User create', error: res.errors });
          }
          res.json({ info: 'User saved successfully', data: newUser });
      });
    });
}
