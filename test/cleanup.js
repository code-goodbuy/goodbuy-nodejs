let mongoose = require("mongoose");
let chai = require('chai');

describe('Cleanup', () => {
  describe('Cleaning up the database', () => {
    it('should drop the database', (done) => {
      done();
    })
  }) 
  after(function(done){
      mongoose.connection.db.dropDatabase(function(){
        mongoose.connection.close(done);
      });
    });

})