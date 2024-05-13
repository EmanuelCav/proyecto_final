import { Router } from 'express'

import Product from '../model/product.js'
import Cart from '../model/cart.js'
import User from '../model/user.js'

import { auth, admin } from '../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {

    res.redirect('/login')

})

router.get('/products', auth, async (req, res) => {

    const { limit = 10 } = req.query

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const products = await Product.find().limit(limit).lean()

    res.render('products', {
        layout: 'home',
        message: "Welcome",
        products,
        user: req.user
    })
})

router.get('/cart', auth, async (req, res) => {

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

router.get('/login', (req, res) => {

    if (req.cookies.isLoggedIn) {
        res.redirect('/products')
        return
    }

    res.render('login', {
        layout: 'home'
    })

})

router.get('/register', (req, res) => {

    if (req.cookies.isLoggedIn) {
        res.redirect('/products')
        return
    }

    res.render('register', {
        layout: 'home'
    })

})

router.get('/logout', auth, async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, {
        last_connection: new Date()
    }, {
        new: true
    }).select("-password")

    res.clearCookie('jwt')
    res.clearCookie('isLoggedIn')

    res.redirect('/login');

})

router.get('/panel', [auth, admin], async (req, res) => {

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    res.render('panel', {
        layout: 'home'
    })

})

router.get('/profile', auth, async (req, res) => {

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    res.render('profile', {
        layout: 'home'
    })

})

export default router