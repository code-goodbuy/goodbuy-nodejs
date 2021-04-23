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

