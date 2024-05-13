import { Router } from 'express'

import Product from '../model/product.js'
import Cart from '../model/cart.js'
import User from '../model/user.js'

import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/products', auth, async (req, res) => {

    const { limit = 10 } = req.query

    const products = await Product.find().limit(limit).lean()

    res.render('products', {
        layout: 'home',
        message: "Welcome",
        products: products,
        user: req.user
    })
})

router.get('/carts/:cid', auth, async (req, res) => {

    const { cid } = req.params

    const cart = await Cart.findById(cid).lean()

    if (!cart) {
        return res.status({ message: "Cart does not exists" })
    }

    res.render('cartId', {
        layout: 'home',
        cart
    })
})

router.get('/', (req, res) => {

    res.render('login', {
        layout: 'home'
    })

})

router.get('/register', (req, res) => {

    res.render('register', {
        layout: 'home'
    })

})

router.get('/logout', async (req, res, next) => {

    await User.findById(userSaved._id, {
        last_connection: new Date()
    }, {
        new: true
    }).select("-password")

    req.logout(function (err) {
        if (err) return next(err)
        res.redirect('/login');
    });

})

export default router