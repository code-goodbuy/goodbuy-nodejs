import express from 'express';
import { getAllProducts, createProduct, getProduct } from '../controllers/product';
import { createProductValidator } from '../validator/product';
const router = express.Router();

router.get('/', getAllProducts);
// only if validation is passed it will continue to the product creation
router.post('/product', createProductValidator, createProduct);
router.get('/product/:barcode', getProduct);

export default router;
