import { nameList } from '../server/services/name.list';
import {} from 'mocha';
import Config from '../server/config/server.config';

var UserModel = require('../server/db/entity/user');
var express = require('express');
var dbURI    = 'mongodb://localhost/mongotest';
var supertest = require('supertest');
var server = supertest.agent("http://localhost:" + Config.PORT);
var should   = require('chai').should();
var mongoose = require('mongoose');
var clearDB  = require('mocha-mongoose')(dbURI);
var nameData = require('../server/data/name.list.json');
var app = express();
module.exports = app;

function createUser(value: string) {
    var user = new UserModel();
    user.email = value;
    user.last_name = value;
    user.first_name = value;

    return user;
}

describe('Mongoose ', function () {
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
        server.get('/api/name-list')
            .end(function(err: any,res: any){
                if (err) return done(err);
                // HTTP status should be 200
                res.status.should.equal(200);
                res.body.data.should.eql([]);
                done();
            });
    });

    it("check static name list", function(done: any) {
        server.get('/api/name-list/static')
            .end(function(err: any,res: any){
                if (err) return done(err);

                res.status.should.equal(200);
                res.body.should.eql(nameData);
                done();
            });
    });

    it("check user is saved successfully", function(done: any) {
        server.post('/api/name-list')
            .send(user)
            .end(function(err: any,res: any){
                if (err) return done(err);

                res.status.should.equal(200);
                res.body.data.first_name.should.equal(user.first_name);
                done();
            });
    });
});

