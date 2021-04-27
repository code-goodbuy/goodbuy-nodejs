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
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  
  const accessToken = jwt.sign(
    { email: "testmail12345@test.de" },
    accessTokenSecret,
    { expiresIn: "5m" }
  );
  
  const userInfo = {
    email: "testmail12345@test.de",
    imageURL: "https://picsum.photos/1200/1400.jpg",
    description: "some description"
  }

describe("/GET user profile", () => {
  it("should get user profile result", (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({email: "testmail12345@test.de"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.product.should.have.property("_id");
        res.body.product.should.have.property("username");
        res.body.product.should.have.property("email");
      });
    done();
  });

  it("should fail without token", (done) => {
    chai
      .request(server)
      .get("/api/profile")
      .send(userInfo.email)
      .end((err, res) => {
        res.should.have.status(409);
      });
    done();
  });
});

describe("/POST user information", () => {
  it('should post user profile with token', (done) => {
    chai
      .request(server)
      .put('/api/profile')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.product.should.have.property("_id");
        res.body.product.should.have.property("username");
        res.body.product.should.have.property("description");
        res.body.product.should.have.property("imageURL");
      })
    done();
  })

  it("should fail to post user info without token ", (done) => {
    chai
      .request(server)
      .put("/api/profile")
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(409);
      });
    done();
  });
});
});
