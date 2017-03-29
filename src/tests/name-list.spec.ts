import {} from 'mocha';
import { NameListServer } from '../server/services/name.list';

var UserModel = require('../server/db/entity/user');
var dbURI    = 'mongodb://localhost/mongotest';
var should   = require('chai').should();
var mongoose = require('mongoose');
let nameData = require('../server/data/name.list.json');

function createUser(value: string) {
    var user = new UserModel();
    user.email = value;
    user.last_name = value;
    user.first_name = value;

    return user;
}

describe('Mongoose ', function () {
    let nameListServer = new NameListServer;
    var user = createUser("fake user");
    var userId = user._id;

    beforeEach(function(done: any) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    after(function (done: any) {
        mongoose.connection.db.dropDatabase(function () {
             mongoose.connection.close(function () {
                  done();
              });
         });
    });

    it("can save dummy user", function(done: any) {
        new UserModel(user).save(function(err: any, model: any){
            UserModel.find(user, function(err: any, docs: any){
                 if (err) return done(err);
                 docs.length.should.equal(1);
                 done();
            });
        });
    });

    it("check user list is empty", function(done: any) {
        nameListServer.getAllUsers().then((res: any) => {
            res.should.eql([]);
            done();
        });
    });

    it("check static user list", function(done: any) {
        nameListServer.getStaticUsers().should.eql(nameData);
        done();
    });

    it("check user is saved successfully", function(done: any) {
        nameListServer.saveUser(user).then((res: any) => {
            res.first_name.should.eql(user.first_name);
            done();
        });
    });
});

