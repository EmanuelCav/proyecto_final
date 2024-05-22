import { Router } from 'express';

import * as cartCtrl from '../controller/carts.ctrl.js';

import { auth } from '../middleware/auth.js';

const router = Router()

router.post('/api/carts', auth, cartCtrl.createCart)

router.get('/api/carts/:cid', auth, cartCtrl.getCart)

router.patch('/api/carts/:cid/products/:pid', auth, cartCtrl.addProductCart)

router.delete('/api/carts/:cid/products/:pid', auth, cartCtrl.removeProductCart)
router.delete('/api/carts/:cid', auth, cartCtrl.removeAllProducts)

router.put('/api/carts/:cid/products/:pid/:quantity', auth, cartCtrl.quantityProductCart)

router.post('/:cid/purchase', auth, cartCtrl.purchaseCart)

export default router