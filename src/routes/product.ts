import express from 'express';
import { authenticateToken } from '../controllers/auth';
import { getAllProducts, createProduct, getProduct } from '../controllers/product';
import { createProductValidator, getProductValidator } from '../validator/product';
const router = express.Router();

router.get('/products', getAllProducts);
router.post('/product', authenticateToken, createProductValidator, createProduct);
router.get('/product/:ean', getProduct);

export default router;
