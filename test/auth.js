let UserModel = require('../dist/models/user.model');
const { createRefreshToken, createAccessToken } = require('../dist/controllers/auth')
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiCookie = require('chai-expected-cookie');
let server = require('../dist/server');
let expect = chai.expect;
let jwt = require('jsonwebtoken');
chai.use(chaiHttp);
chai.use(chaiCookie);


describe('Authentication', () => {
    describe('/POST register', () => {
        it('should register a user', (done) => {
            let user = {
                "username": "testuser",
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true
             }
            chai.request(server)
                .post('/api/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql("User was successfully created, please check your email");
                    done();
                })
        })
        it('should return that the user with that email already exist', (done) => {
            let user = {
                "username": "testuser",
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
                "acceptedTerms": true,
                "hasRequiredAge": true,
            }
            chai.request(server)
                .post('/api/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message').eql("User does not exist or password/email is wrong");
                    done();
                })
        })
    })
    describe('/POST login', () => {
        it('should fail because the email is not verified', (done) => {
            let loginData = {
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/api/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
        })
        it('should login a user', (done) => {
            let loginData = {
                "email": "testmail123@test.de",
                "password": "Test_pass1!",
            }
            UserModel.default.findOne({
                email: "testmail123@test.de",
              })
              .then((user) => {
                user.active = true;
                user.save((err) => {
            chai.request(server)
            .post('/api/login')
            .send(loginData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('jwtAccessToken');
                expect(res).to.have.cookie('jid');
                done();
            })
        });
    })
        })
        it('should fail because the email doesnt exist', (done) => {
            let loginData = {
                "email": "testm123ail123@test.de",
                "password": "Test_pass1!",
            }
            chai.request(server)
            .post('/api/login')
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
            .post('/api/login')
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
                name: "testproduct",
                brand: "testproduct",
                corporation: "testcorp",
                ean: "123456789",
                state: "unverified"
            }
            chai.request(server)
            .post('/api/product')
            .send(product)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql("JWT is missing, access denied");
                done();
            })    
        })
        it('should fail because of manipulated authentication token', (done) => {
            let product = {
                name: "testproduct",
                brand: "testproduct",
                corporation: "testcorp",
                ean: "123456789",
                state: "unverified"
            }
            chai.request(server)
            .post('/api/product')
            .set({ "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuZGUiLCJpYXQiOjE2MTY1ODI3MjksImV4cCI6MTYxNzE4NzUyOX0.SXWuVkQu1fz0eCfLzN1E93TtZEYsoR60KB_UywiqIQ0`})
            .send(product)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })     
        })
    })
    describe('/refresh_token', () => {
        it('should fail because the refresh token is missing', (done) => {
            chai.request(server)
            .post('/api/refresh_token')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql( "JWT Refresh Token is missing, access denied");
                done();
            })
        })
        it('should fail because the refresh token is invalid', (done) => {
            chai.request(server)
            .post('/api/refresh_token')
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
            let refreshToken = createRefreshToken("testmail123@test.de", 0)
            chai.request(server)
            .post('/api/refresh_token')
            .set('Cookie', `jid=${refreshToken}`)
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('accessToken');
                done();
            })
        })
        it('should fail because the token verion is invalid', (done) => {
            let refreshToken = createRefreshToken("testmail123@test.de", 2)
            chai.request(server)
            .post('/api/refresh_token')
            .set('Cookie', `jid=${refreshToken}`)
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property("message").eql("Invalid refresh token version");
                done();
            })
        })
    })
    describe('/Logout user', () => {
        it('should fail because the jwt is invalid', (done) => {
            chai.request(server)
            .post('/api/logout')
            .set({ "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHRlc3QuZGUiLCJpYXQiOjE2MTY1ODI3MjksImV4cCI6MTYxNzE4NzUyOX0.PBf0yNGC705vwFkvbMH1vCyUa--V1adrWfIK6GBvfOk`})
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql('Invalid Access Token');                
            done();
            })
        })
        it('should logout a user', (done) => {
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
            const accessToken = jwt.sign({email: "testmail123@test.de"}, accessTokenSecret, { expiresIn: '1m' })
            let refreshToken = createRefreshToken("testmail123@test.de", 0)
            const cookieValue =  'jid=' + JSON.stringify(refreshToken)
            chai.request(server)
            .post('/api/logout')
            .set({ "Authorization": `Bearer ${accessToken}`})
            .set('Cookie', `jid=${refreshToken}`)
            .send()
            .end((err, res) => {
                res.should.have.status(200);   
            done();
            })
        })
    })
   
})