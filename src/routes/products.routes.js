import { Router } from 'express';

import { upload } from '../lib/images.js';

import * as productCtrl from '../controller/products.ctrl.js';
import { auth, admin, premium } from '../middleware/auth.js';

const router = Router()

router.get('/api/products', auth, productCtrl.products)
router.get('/api/products/:pid', auth, productCtrl.productGet)

router.post('/products', [auth, premium], upload.array("files", 10), productCtrl.productCreate)

router.put('/products/update/:pid', [auth, admin], productCtrl.productUpdate)

router.delete('/api/products/:pid', [auth, premium], productCtrl.productDelete)

export default router


