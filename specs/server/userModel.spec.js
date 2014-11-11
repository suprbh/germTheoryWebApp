// var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var sequelize = require('sequelize');
var userController = require('../../server/controllers/userController.js');
var db = require('../../server/database/dbSchema.js');
var request = require('supertest');
// var expect = require('../../node_modules/chai/chai').expect;
// var express = require('express');

// Controller tests
describe('User Controller',function(){
  it('User Controller should be an object', function() {
    expect(userController).to.be.an('object');
  })

   it('should have a method called signin', function() {
    expect(userController.signin).to.be.ok;
  })

  it('should have a method called signup', function() {
    expect(userController.signup).to.be.ok;
  })

});

describe('User',function() {
  before(function(done){
    db.sequelize.sync({force: true})
      .then(function(){
        done();
      }, function(err){
        done(err);
      })
  });

  it('It should add a user to the database', function(done) {
      db.saveUser({name: 'test', gender: 'F'}, function(user){
        // console.log("saveUser in test: ", user.name);
        expect(user.name).to.be('test');
        done();
      });

    });

    it('It should find User from the database', function(done){
      db.findUser({name: 'test', gender: 'F'}, function(user){
        // console.log("findUser in test: ", user);
        expect(user[0].dataValues.name).to.be('test');
        done();
      });
    });

});

describe('User REST resource', function(done){
  var app;

  before(function(){
    // setup a test server
    app = require('../../server/server.js');
  });

  it('GET /api/user/:id should return a specified User record', function(done) {
    db.saveUser({name: "hello", gender: 'F'}, function(user){
      request(app)
        .get('/api/users/2')
        .expect(200)
        .end(function(err,res){
          // console.log("parsed response:", res.body);
          expect(res.body[0].name).to.equal("hello");
          done();
        });
      });
  });

  it('POST /api/user/signup should insert a new User record', function(done) {
    request(app)
      .post('/api/users/signup')
      .send({
        name: 'John Smith',
        gender: 'M'
      })
      .expect(200)
      .end(function(err,res) {
        db.User.find({where:{name:res.body.name}})
        .then(function(found){
          expect(found).not.to.equal(null);
          done();
        },function(){
          done('expected to find posted value in the database');
        });
      })
  });

  xit('respond with json', function(done) {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});




