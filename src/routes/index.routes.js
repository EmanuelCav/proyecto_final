import { Router } from 'express'

import Product from '../model/product.js'
import Cart from '../model/cart.js'
import User from '../model/user.js'

import { auth, admin, emailAuth } from '../middleware/auth.js'

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
    }).lean().populate({
        path: "products",
        populate: {
            path: "product"
        }
    })

    if (!cart) {

        const newCart = new Cart({
            user: req.user.id
        })

        await newCart.save()

        cart = await Cart.findOne({
            user: req.user.id
        }).lean().populate({
            path: "products",
            populate: {
                path: "product"
            }
        })
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

    const user = await User.findById(req.user.id).select("-password").lean()

    res.render('profile', {
        layout: 'home',
        user: req.user,
        profile: user
    })

})

router.get('/products/:id', auth, async (req, res) => {

    const { id } = req.params

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const product = await Product.findById(id).lean()

    if (!product) {
        return res.status(400).json({ message: "Product does not exists" })
    }

    const cart = await Cart.findOne({
        user: req.user.id
    }).lean()

    if (!cart) {
        return res.status(400).json({ message: "Cart does not exists" })
    }

    res.render('product', {
        layout: 'home',
        user: req.user,
        product,
        cart
    })

})

router.get('/products/update/:id', [auth, admin], async (req, res) => {

    const { id } = req.params

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const product = await Product.findById(id).lean()

    if (!product) {
        return res.status(400).json({ message: "Product does not exists" })
    }

    res.render('update', {
        layout: 'home',
        user: req.user,
        product
    })

})

router.get('/users', [auth, admin], async (req, res) => {

    if (!req.cookies.isLoggedIn) {
        res.redirect('/login')
        return
    }

    const users = await User.find({
        email: {
            $nin: [req.user.email]
        }
    }).select("-password").lean()

    res.render('users', {
        layout: 'home',
        user: req.user,
        users
    })

})

router.get('/recover', emailAuth, async (req, res) => {

    if (!req.cookies.jwt_recover) {
        res.redirect('/login')
        return
    }

    if (req.cookies.isLoggedIn) {
        res.redirect('/products')
        return
    }

    res.render('recover', {
        layout: 'home'
    })

})

router.get('/email', async (req, res) => {

    if (req.cookies.isLoggedIn) {
        res.redirect('/products')
        return
    }

    res.render('email', {
        layout: 'home'
    })

})

export default router