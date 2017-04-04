import { Application, Request, Response, NextFunction } from 'express';
import { User } from '../db/entity/user';
import { NameListService } from './name.list';

let nameData = require('../data/name.list.json');

export function nameList(app: Application) {
  let nameListService = new NameListService;
  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req: Request, res: Response, next: NextFunction) => {
      var result = nameListService.getStaticUsers();
      res.json(result);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req: Request, res: Response, next: NextFunction) => {
      nameListService.getAllUsers()
        .then((result: any) => {
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
    (req: Request, res: Response, next: NextFunction) => {
      var newUser = new User(req.body);
      nameListService.saveUser(newUser)
        .then((result: any) => {
          if (result.errors) {
            res.json({ info: 'error during User create', error: result.errors });
          }
          res.json({ info: 'User saved successfully', data: result });
        });
    });
}
