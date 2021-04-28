let UserModel = require("../dist/models/user.model");
const {
  createRefreshToken,
  createAccessToken,
} = require("../dist/controllers/auth");
let chai = require("chai");
let chaiHttp = require("chai-http");
let chaiCookie = require("chai-expected-cookie");
let server = require("../dist/server");
let expect = chai.expect;
let jwt = require("jsonwebtoken");
chai.use(chaiHttp);
chai.use(chaiCookie);

describe("Authorization", () => {

  const userInfo = {
    email: "testmail123@test.de",
    imageURL: "https://picsum.photos/1200/1400.jpg",
    description: "some description"
  }

  const accessToken = createAccessToken(userInfo.email)

  describe("/GET profile", () => {
    it("should get profile result", (done) => {
      chai
        .request(server)
        .get('/api/profile')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo.email)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("_id")
          res.body.should.have.property("username")
          res.body.should.have.property("email")
        })
      done();
    })
    it("should fail to get profile result", (done) => {
      chai
        .request(server)
        .get('/api/profile')
        .send(userInfo.email)
        .end((err, res) => {
          res.should.have.status(401);
        })
      done();
    })
  })

  describe("/POST profile", () => {
    it("should POST with token", (done) => {
      chai
        .request(server)
        .put('/api/profile')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("_id")
          res.body.should.have.property("username")
          res.body.should.have.property("description")
          res.body.should.have.property("imageURL")
        })
      done();
    })
    it("should fail to POST without token", (done) => {
      chai
        .request(server)
        .put('/api/profile')
        .send(userInfo)
        .end((err, res) => {
          res.should.have.status(401);
        })
      done();
    })
  })
})