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

// FIXME need to mock user login for not using actual user info in the local db

describe("Authorization", () => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = jwt.sign(
    { email: "testmail12345@test.de" },
    accessTokenSecret,
    { expiresIn: "5m" }
  );

  describe("/GET user information", () => {
    it("should get user profile result", (done) => {
      let userInfo = {
        email: "testmail12345@test.de",
      };
      chai
        .request(server)
        .get("/api/profile")
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo)
        .end((res) => {
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
      const userInfo = { email: "testmail12345@test.de" };
      const userContent = {
        description: "some test",
        imageURL: "http://someurl.com/image.jpg",
      };
      chai
        .request(server)
        .get("/api/profile")
        .send(userInfo)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
  });

  describe("/POST user information", () => {
    const userInfo = {
      email: "testmail12345@test.de",
    };
    const userContent = {
      description: "some test",
      imageURL: "http://test.com/some-image.jpeg",
    };

    it("should post user info with token", (done) => {
      chai
        .request(server)
        .post("/api/profile")
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(userInfo)
        .send(userContent)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("username");
          res.body.should.have.property("email");
          res.body.should.have.property("description");
          res.body.should.have.property("imageURL");
        });
      done();
    });

    it("should fail to post user info without token ", (done) => {
      chai
        .request(server)
        .post("/api/profile")
        .send(userInfo)
        .send(userContent)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
  });
});
