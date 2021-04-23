require("./test/auth");
require("./test/rabbitmq");
require("./test/dbBackup.test");
require("./test/product");
require("./test/cleanup");
// FIXME figure out why profile test should be the last for testing pass :/
require("./test/profile");

// Add the test files in the order you want them executed.
// Leave cleanup as last requirement
