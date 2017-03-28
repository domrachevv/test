import * as express from 'express';
import * as user from '../db/entity/user';

let nameData = require('../data/name.list.json');

export function nameList(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req:any, res:any, next:any) => {

      res.json(nameData);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req:any, res:any, next:any) => {
      user.find((err: any, users: any) => {
          if (err) {
              res.json({info: 'error during find Users', error: err});
          };
          res.json({info: 'Users found successfully', data: users});
      });
    });

  /**
   * Add new name.
   * @database
   */
  app.post('/api/name-list',
    (req:any, res:any, next:any) => {
      var newUser = new user(req.body);
      newUser.save((err : any) => {
          if (err) {
              res.json({info: 'error during User create', error: err});
          }
          res.json({info: 'User saved successfully', data: newUser});
      });
    });
}
