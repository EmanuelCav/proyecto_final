import { Router } from 'express';
import Stripe from 'stripe';

import { auth } from '../middleware/auth.js';

import { secret_key } from '../config/config.js';

const stripe = new Stripe(`${secret_key}`)

const router = Router()

router.get('/api/order', auth, (req, res) => {

})

router.get('/api/success', auth, (req, res) => {
    
})

router.get('/api/error', auth, (req, res) => {
    
})

export default router


