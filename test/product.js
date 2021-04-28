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
            name: "testname", 
            brand: "testrand", 
            corporation: "testcorp", 
            ean: 12345678,
            state: "unverified"
        }
          const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
          const accessToken = jwt.sign({email: "testmail123@test.de"}, accessTokenSecret, { expiresIn: '5m' })
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
          .get('/api/product/'+ 12345678)
          .send()
          .end((err, res) => {
                res.should.have.status(409);
            done();
          });
    });
});
