import { Observable } from 'rxjs/Observable';
import { User, IUserModel } from '../db/entity/user';

let nameData = require('../data/name.list.json');
export class NameListService {
  getStaticUsers(){
    return nameData;
  }

  getAllUsers() {
    return User.find().catch((err: any) => err);
  }

  saveUser(user: IUserModel): Promise<IUserModel> {
    return user.save().catch((err: any) => err);
  }
}
