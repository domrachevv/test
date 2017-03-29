import {} from 'mocha';
import { NameListService } from '../server/services/name.list';

import { User, IUserModel } from '../server/db/entity/user';
var dbURI    = 'mongodb://localhost/mongotest';
var should   = require('chai').should();
var mongoose = require('mongoose');
let nameData = require('../server/data/name.list.json');

function createUser(value: string) {
    return new User({
        email: value,
        last_name: value,
        first_name: value
    });
}

describe('Mongoose ', function () {
    let nameListService = new NameListService;

    before(function(done: MochaDone) {
        mongoose.connect(dbURI, done);
    });

    after(function (done: MochaDone) {
        mongoose.connection.close(done);
    });

    it("check user list is empty", function(done: MochaDone) {
        nameListService.getAllUsers().then((res: any) => {
            res.should.eql([]);
            done();
        });
    });

    it("check static user list", function(done: MochaDone) {
        nameListService.getStaticUsers().should.eql(nameData);
        done();
    });

    it("check user is saved successfully", function(done: MochaDone) {
        let user = createUser("fake user");

        nameListService.saveUser(user)
            .then((res: IUserModel) => {
                should(res.first_name).eql(user.first_name);
            })
            .then(() => cleanUpFakeUser(user._id, done))
            .catch(() => cleanUpFakeUser(user._id, done));
    });

    function cleanUpFakeUser(userId: string, done: MochaDone) {
        User.findByIdAndRemove(userId, done);
    }
});
