import express from 'express';
import { authenticateToken, isAuthorizied } from '../controllers/auth';
import { getAllProducts, createProduct, getProduct, deleteProduct} from '../controllers/product';
import { createProductValidator } from '../validator/product';
const router = express.Router();

router.get('/products', getAllProducts);
router.post('/product', authenticateToken, createProductValidator, createProduct);
router.delete('/product', authenticateToken, isAuthorizied, deleteProduct);
router.get('/product/:ean', getProduct);

export default router;
