import express from 'express';
import { authenticateToken } from '../controllers/auth';
import { getAllProducts, createProduct, getProduct, deleteProduct } from '../controllers/product';
import { createProductValidator, deleteProductValidator } from '../validator/product';
const router = express.Router();

router.get('/products', getAllProducts);
router.post('/product', authenticateToken, createProductValidator, createProduct);
router.delete('/product', authenticateToken, deleteProductValidator, deleteProduct);
router.get('/product/:ean', getProduct);

export default router;
