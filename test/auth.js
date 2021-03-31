let mongoose = require("mongoose");
let UserModel = require('../dist/models/user.model');
const { createAccessToken, createRefreshToken } = require('../dist/controllers/auth')
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiCookie = require('chai-expected-cookie');
let server = require('../dist/server');
const { exception } = require("console");
let expect = chai.expect;
let should = chai.should()
chai.use(chaiHttp);
chai.use(chaiCookie);

describe('Authentication', () => {
    describe('/POST register', () => {
        it('should register a user', (done) => {
            let user = {
                "username": "test_user",
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true,
                "tokenVersion": 0

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
        it('should return that the user with that email already exist(409)', (done) => {
            let user = {
                "username": "test_user",
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true,
                "tokenVersion": 0

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
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('jwtAccessToken');
                expect(res).to.have.cookie('jid');
                done();
            })
        })
        it('should fail because the email doesnt exist', (done) => {
            let loginData = {
                "email": "testm123ail123@test.de",
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
    // Todo send the tokenVersion and the email in the refresh cookie
    // i think if we have the refresh cookie here we dont need to change anything
    describe('/Logout user', () => {
        it('should fail because the jwt is invalid', (done) => {
            let loginData = {
                "email": "testmail@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/logout')
            .set({ "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHRlc3QuZGUiLCJpYXQiOjE2MTY1ODI3MjksImV4cCI6MTYxNzE4NzUyOX0.PBf0yNGC705vwFkvbMH1vCyUa--V1adrWfIK6GBvfOk`})
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('err').eql({
                    "name": "JsonWebTokenError",
                    "message": "invalid signature"
                });                
            done();
            })
        })
        it('should logout a user', (done) => {
            let tokenVer = 1
            let loginData = {
                "username": "dmar2io",
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true,
                "tokenVersion": tokenVer
            }
            const accessToken = createAccessToken("testmail123@test.de")
            chai.request(server)
            .post('/logout')
            .set({ "Authorization": `Bearer ${accessToken}`})
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(200);   
            done();
            })
        })
        it('the logout should have incremented the tokenVersion', () => {
            const user = UserModel.default.findOne({ email: "testmail123@test.de" })
            .then(user => {
                user.tokenVersion.should.eql(tokenVer +1);
            })     
        })
    })
    describe('/refresh_token', () => {
        it('should fail because the refresh token is missing', (done) => {
            chai.request(server)
            .post('/refresh_token')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql( "JWT Refresh Token is missing, access denied");
                done();
            })
        })
        it('should fail because the refresh token is invalid', (done) => {
            chai.request(server)
            .post('/refresh_token')
            .set('Cookie', "jid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RtYWlsMTIzQHRlc3QuZGUiLCJ0b2tlblZlcnNpb24iOjExMTUsImlhdCI6MTYxNzExNTMzNiwiZXhwIjoxNjE3NzIwMTM2fQ.cj51uRNpOc0UgX-SsF0uhcnBHkJD2hVvNgLa4QVg21o")
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('err').eql({
                    "name": "JsonWebTokenError",
                    "message": "invalid signature"
                });
                done();
            })

        })
        it('should succeed and return a new accessToken', (done) => {
            let refreshToken = createRefreshToken("testmail123@test.de", 2)
            chai.request(server)
            .post('/refresh_token')
            .set('Cookie', `jid=${refreshToken}`)
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('accessToken');
                done();
            })
        })
    })
})