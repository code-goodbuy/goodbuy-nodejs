const express = require('express');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/product', productController.createProduct);


module.exports = router;
