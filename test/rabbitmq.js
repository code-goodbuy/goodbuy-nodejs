let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/server');
let should = chai.should()
chai.use(chaiHttp);

describe('Product not in DB', () => {
    describe('/GET product', () => {
        it('should register a user', (done) => {
            let requested_barcode = { barcode: "1234567890123" }
            chai.request(server)
                .get('/product/' + requested_barcode.barcode)
                .send(requested_barcode)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                })
        })
    })
})
