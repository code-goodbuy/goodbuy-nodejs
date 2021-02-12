const express = require('express');
const productController = require('../controllers/product');
const validator = require('../validator');
const router = express.Router();

router.get('/', productController.getProducts);
// only if validation is passed it will continue to the product creation
router.post('/product', validator.createProductValidator, productController.createProduct);


module.exports = router;
