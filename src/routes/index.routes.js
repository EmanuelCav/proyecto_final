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

    const { limit } = req.query

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

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    let cart = await Cart.findOne({
        user: req.user.id
    }).lean()

    if(!cart) {

        const newCart = new Cart({
            user: req.user.id
        })

        await newCart.save()

        cart = await Cart.findOne({
            user: req.user.id
        }).lean()
    }

    res.render('cart', {
        layout: 'home',
        user: req.user,
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

    const { limit } = req.query

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const products = await Product.find().limit(limit).lean()

    res.render('panel', {
        layout: 'home',
        user: req.user,
        products
    })

})

router.get('/profile', auth, async (req, res) => {

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    res.render('profile', {
        layout: 'home',
        user: req.user
    })

})

router.get('/products/:id', auth, async (req, res) => {

    const { id } = req.params

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const product = await Product.findById(id).lean()

    if(!product) {
        return res.status(400).json({ message: "Product does not exists" })
    }

    res.render('product', {
        layout: 'home',
        user: req.user,
        product
    })

})

router.get('/update/:id', auth, async (req, res) => {

    const { id } = req.params

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const product = await Product.findById(id).lean()

    if(!product) {
        return res.status(400).json({ message: "Product does not exists" })
    }

    res.render('update', {
        layout: 'home',
        user: req.user,
        product
    })

})

export default router