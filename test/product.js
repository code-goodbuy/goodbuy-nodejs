let mongoose = require("mongoose");
let Product = require('../models/product');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('Product', () => {
    beforeEach((done) => {
        Product.remove({}, (err) => {
           done();
        });
    });

  /*
  * Test the /POST route
  */
  describe('/POST product', () => {
      it('it should POST a product', (done) => {
          let product = {
            "name": "test_product", 
            "brand": "test_product", 
            "corporation": "test_corp", 
            "barcode": "123456789", 
            "state": "unverified"
          }
        chai.request(server)
            .post('/product')
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
        let product = new Product({
            "name": "test_product", 
            "brand": "test_product", 
            "corporation": "test_corp", 
            "barcode": "123456789", 
            "state": "unverified"
          });
          console.log(product.barcode);
          product.save((err, product) => {
            chai.request(server)
          .get('/product/' + product.barcode)
          .send(product)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.product.should.have.property('name');
                res.body.product.should.have.property('brand');
                res.body.product.should.have.property('corporation');
                res.body.product.should.have.property('state');
                res.body.should.have.property('barcode').eql(product.barcode);
            done();
          });
        });
    });
});
