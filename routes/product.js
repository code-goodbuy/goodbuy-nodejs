const express = require('express');
const {getAllProducts, createProduct, getProduct} = require('../controllers/product');
const {createProductValidator} = require('../validator/product');
const router = express.Router();

router.get('/', getAllProducts);
// only if validation is passed it will continue to the product creation
router.post('/product', createProductValidator, createProduct);
router.get('/product', getProduct)

module.exports = router;
