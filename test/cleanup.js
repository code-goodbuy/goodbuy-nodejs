let mongoose = require("mongoose");
let chai = require('chai');

describe('Cleanup', () => {

after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

})