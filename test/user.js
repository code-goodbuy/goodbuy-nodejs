let UserModel = require("../dist/models/user.model");
const {
  createAccessToken,
} = require("../dist/controllers/auth");
let chai = require("chai");
let chaiHttp = require("chai-http");
let chaiCookie = require("chai-expected-cookie");
let server = require("../dist/server");
chai.use(chaiHttp);
chai.use(chaiCookie);

describe("/GET user info", () => {
  it("should get user profile with parameter without token", (done) => {
    chai
      .request(server)
      .get('/api/user/testuser')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("_id")
        res.body.should.have.property("email")
      })
    done();
  })
  it("should fail to get user profile if username doesn't exist", (done) => {
    chai
      .request(server)
      .get('/api/user/somenonexistinguser')
      .end((err, res) => {
        res.should.have.status(409);
      })
    done();
  })
  it("should fail when invalid username being requested", (done) => {
    chai
      .request(server)
      .get('/api/user/!U@S#E_R%')
      .end((err, res) => {
        res.body.should.have.eql("User name is invalid");
      })
    done();
  })
})


