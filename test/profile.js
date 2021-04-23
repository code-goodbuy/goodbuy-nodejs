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
  describe("/GET user information", () => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      { email: "testmail123@test.de" },
      accessTokenSecret,
      { expiresIn: "1m" }
    );

    it("login user should get user profile result", (done) => {
      let userInfo = {
        email: "testmail12345@test.de",
      };
      chai
        .request(server)
        .get("/api/profile")
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.product.should.have.property("_id");
          res.body.product.should.have.property("username");
          res.body.product.should.have.property("email");
          res.body.product.should.have.property("description");
          res.body.product.should.have.property("imageURL");
        });
      done();
    });

    it("should fail without token", (done) => {
      let userInfo = {
        email: "testmail12345@test.de",
      };
      chai
        .request(server)
        .get("/api/profile")
        // .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
  });
});
