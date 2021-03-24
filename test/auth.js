let mongoose = require("mongoose");
let UserModel = require('../dist/models/user.model')
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/server');
let should = chai.should()
chai.use(chaiHttp);

describe('Authentication', () => {

    describe('/POST register', () => {
        it('should register a user', (done) => {
            let user = {
                "_id": "12345",
                "username": "test_user",
                "email": "testmail@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql("User was successfully created");
                    done();
                })
        })
    })
    describe('/POST register', () => {
        it('should return that the user with that email already exist(409)', (done) => {
            let user = {
                "_id": "54321",
                "username": "test_user",
                "email": "testmail@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message').eql("User does not exist or password/email is wrong");
                    done();
                })
        })
    })

    describe('/POST login', () => {
        it('should login a user', (done) => {
            let loginData = {
                "email": "testmail@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('jwtAccessToken');
                done();
            })
        })
    })
    describe('/POST login', () => {
        it('should fail because the email doesnt exist', (done) => {
            let loginData = {
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property('message').eql("User does not exist or password/email is wrong");
                done();
            })
        })
    })
    describe('/POST login', () => {
        it('should fail because the password is wrong', (done) => {
            let loginData = {
                "email": "testmail@test.de",
                "password": "Wrong_pass1!",
            }
            chai.request(server)
            .post('/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property('message').eql("User does not exist or password/email is wrong");
                done();
            })
        })
    })
})