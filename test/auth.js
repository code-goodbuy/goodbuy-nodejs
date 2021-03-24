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
    describe('/POST product', () => {
        it('should fail because of missing authentication token', (done) => {
            let product = {
                name: "test_product",
                brand: "test_product",
                corporation: "test_corp",
                barcode: "123456789",
                state: "unverified"
            }
            chai.request(server)
            .post('/product')
            .send(product)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql("JWT is missing, access denied");
                done();
            })     
        })
    })
    describe('/POST product', () => {
        it('should fail because of manipulated authentication token', (done) => {
            let product = {
                name: "test_product",
                brand: "test_product",
                corporation: "test_corp",
                barcode: "123456789",
                state: "unverified"
            }
            chai.request(server)
            .post('/product')
            .set({ "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuZGUiLCJpYXQiOjE2MTY1ODI3MjksImV4cCI6MTYxNzE4NzUyOX0.SXWuVkQu1fz0eCfLzN1E93TtZEYsoR60KB_UywiqIQ0`})
            .send(product)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('err').eql({
                    "name": "JsonWebTokenError",
                    "message": "invalid signature"
                });
                done();
            })     
        })
    })
})