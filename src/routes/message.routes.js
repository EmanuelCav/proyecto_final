import { Router } from 'express';

import { createMessages, getAllMessages } from '../controller/message.ctrl.js';

import { auth } from '../middleware/auth.js';

const router = Router()

router.get('/api/messages', getAllMessages)
router.post('/api/messages', auth, createMessages)

export default router


