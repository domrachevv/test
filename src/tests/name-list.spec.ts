import {} from 'mocha';
import { expect, should } from 'chai';
import { NameListService } from '../server/services/name.list';

import { User, IUserModel } from '../server/db/entity/user';
var dbURI    = 'mongodb://localhost/mongotest';
var mongoose = require('mongoose');
//to avoid mongoose deprecation warning
mongoose.Promise = global.Promise;
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

    it("check user list is defined", function(done: MochaDone) {
        nameListService.getAllUsers().then((res: IUserModel[]) => {
            expect(res.length).to.not.be.undefined;
            done();
        });
    });

    it("check static user list", function(done: MochaDone) {
        should().equal(nameListService.getStaticUsers(), nameData);
        done();
    });

    it("check user is saved successfully", function(done: MochaDone) {
        let fakeUser = createUser("fake user");

        nameListService.saveUser(fakeUser)
            .then((user: IUserModel) => {
                should().equal(user, fakeUser);
            })
            .then(() => cleanUpFakeUser(fakeUser._id, done))
            .catch(() => cleanUpFakeUser(fakeUser._id, done));
    });

    function cleanUpFakeUser(userId: string, done: MochaDone) {
        User.findByIdAndRemove(userId, done);
    }
});
