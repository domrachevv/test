import { Observable } from 'rxjs/Observable';
import * as user from '../db/entity/user';

let nameData = require('../data/name.list.json');
export class NameListServer {

  getStaticUsers(){
    return nameData;
  }

  getAllUsers() {
    return user.find().catch((err: any) => err);
  }

  saveUser(user: any){
    return user.save().catch((err: any) => (err));
  }
}
