import express from 'express';
import { redirectToDocumentation } from '../controllers/documentation';

const router = express.Router();

router.get('/', redirectToDocumentation); 


export default router;
