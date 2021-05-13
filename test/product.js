let Product = require('../dist/models/product');
const { createAccessToken } = require('../dist/controllers/auth')
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
            name: "testname", 
            brand: "testrand", 
            corporation: "testcorp", 
            ean: "12345678"
        }
        const accessToken = createAccessToken("6099378003382e1813cd78c0")
        chai.request(server)
            .post('/api/product')
            .set({ "Authorization": `Bearer ${accessToken}`})
            .send(product)
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });
});
    /*
  * Test the /GET route
  */
  describe('/GET/:ean product', () => {
    it('it should GET the product by the given ean', (done) => {

            chai.request(server)
          .get('/api/product/'+ "12345678")
          .send()
          .end((err, res) => {
                res.should.have.status(409);
            done();
          });
    });
});
