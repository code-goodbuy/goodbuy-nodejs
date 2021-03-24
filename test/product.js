let mongoose = require("mongoose");
let Product = require('../dist/models/product');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/server');
const { token } = require("morgan");
let should = chai.should();
let config = require('config');

chai.use(chaiHttp);

describe('Product', () => {

  /*
  * Test the /POST route
  */
  describe('/POST product', () => {
      it('it should POST a product', (done) => {
          let product = {
            name: "test_product",
            brand: "test_product",
            corporation: "test_corp",
            barcode: "123456789",
            state: "unverified"
          }
          const accessTokenSecret = config.get("ACCESS_TOKEN_SECRET")
          var jwt = require('jsonwebtoken');
          const accessToken = jwt.sign({email: "testmail@test.de"}, accessTokenSecret, { expiresIn: '168h' })
        chai.request(server)
            .post('/product')
            .set({ "Authorization": `Bearer ${accessToken}`})
            .send(product)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.product.should.have.property('name');
                  res.body.product.should.have.property('brand');
                  res.body.product.should.have.property('corporation');
                  res.body.product.should.have.property('state');
              done();
            });
      });
  });
});
    /*
  * Test the /GET route
  */
  describe('/GET/:barcode product', () => {
    it('it should GET the product by the given barcode', (done) => {
        let product = new Product.default({
            name: "test_product",
            brand: "test_product",
            corporation: "test_corp",
            barcode: "999999",
            state: "unverified"
          });
          product.save((err, product) => {
            chai.request(server)
          .get('/product/'+ product.barcode)
          .send(product)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.product[0].should.have.property('name');
                res.body.product[0].should.have.property('brand');
                res.body.product[0].should.have.property('corporation');
                res.body.product[0].should.have.property('state');
                res.body.product[0].should.have.property('barcode').eql(product.barcode);
            done();
          });
        });
    });
});
