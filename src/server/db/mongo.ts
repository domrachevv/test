import * as mongoose from 'mongoose';

export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export function Init() {
  let uri = 'mongodb://localhost/mongotest';
  mongoose.connect(uri, (err: any) => {
    if (err) {
      console.log(err.message);
      console.log(err);
    }  else {
      console.log('Connected to MongoDb');
    }
  });
}
