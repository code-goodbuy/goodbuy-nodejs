let Product = require('../dist/models/product');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/server');
let jwt = require('jsonwebtoken')
chai.use(chaiHttp);

describe('Product', () => {

  /*
  * Test the /POST route
  */
  describe('/POST product', () => {
      it('it should POST a product', (done) => {
          let product = {
            name: "testproduct",
            brand: "testproduct",
            corporation: "testcorp",
            barcode: "123456789",
            state: "unverified"
          }
          const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
          const accessToken = jwt.sign({email: "testmail123@test.de"}, accessTokenSecret, { expiresIn: '5m' })
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
            name: "testproduct",
            brand: "testproduct",
            corporation: "testcorp",
            barcode: "99999999",
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
