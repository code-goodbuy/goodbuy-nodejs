import express from 'express';
import { isAdmin } from '../controllers/admin';
import { authenticateToken } from '../controllers/jwt';
import { getAllProducts, createProduct, getProduct, deleteProduct} from '../controllers/product';
import { createProductValidator } from '../validator/product';
const router = express.Router();

router.get('/products', getAllProducts);
router.post('/product', authenticateToken, createProductValidator, createProduct);
router.delete('/product', authenticateToken, isAdmin, deleteProduct);
router.get('/product/:ean', getProduct);

export default router;
