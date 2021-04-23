require("./test/auth");
require("./test/rabbitmq");
require("./test/dbBackup.test");
require("./test/product");
require("./test/cleanup");

// need user info in the db
require("./test/profile");

// Add the test files in the order you want them executed.
// Leave cleanup as last requirement
