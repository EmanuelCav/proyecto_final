import { Router } from 'express';

import { mocks } from '../controller/mocks.ctrl.js';

const router = Router()

router.get('/api/mockingproducts', mocks)

export default router
