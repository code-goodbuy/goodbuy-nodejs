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
      .get('/api/user/some-non-existing-user')
      .end((err, res) => {
        res.should.have.status(503);
      })
    done();
  })
})


