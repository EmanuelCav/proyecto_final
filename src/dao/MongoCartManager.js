import Stripe from 'stripe'

import Cart from '../model/cart.js';
import ProductCart from '../model/productCart.js';
import Product from '../model/product.js';
import Ticket from '../model/ticket.js';

import ProductManager from './MongoProductManager.js';

import { secret_key } from '../config/config.js';

const productManager = new ProductManager()

const stripe = new Stripe(`${secret_key}`)

export default class CartDAO {

    async createCart(user) {

        const result = await new Cart({
            user
        })

        return await result.save()

    }

    async getCartById(cid) {

        const result = await Cart.findById(cid).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        if (!result) {
            return
        }

        return result

    }

    async addProduct(cid, pid) {

        const cart = await Cart.findById(cid).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        if (!cart) {
            return
        }

        const product = await Product.findById(pid)

        if (!product) {
            return
        }

        const newProductCart = new ProductCart({
            cart: cid,
            product: pid
        })

        const productCartSaved = await newProductCart.save()

        const result = await Cart.findByIdAndUpdate(cid, {
            $push: {
                products: productCartSaved._id
            }
        }, {
            new: true
        }).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        return result

    }

    async removeProductFromCart(cid, pid) {

        const cart = await Cart.findById(cid)

        if (!cart) {
            return
        }

        const product = await ProductCart.findById(pid)

        if (!product) {
            return
        }

        const result = await Cart.findByIdAndUpdate(cid, {
            $pull: {
                products: product._id
            }
        }, {
            new: true
        }).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        await ProductCart.findByIdAndDelete(pid)

        return result

    }

    async updateCartProducts(cid) {

        const cart = await Cart.findById(cid)

        if (!cart) {
            return
        }

        const products = await productManager.getProducts()

        const result = await Cart.findByIdAndUpdate(id, {
            $set: {
                products
            }
        }).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        return result

    }

    async updateQuantityProducts(quantity, cid, pid) {

        const product = await ProductCart.findById(pid)

        if (!product) {
            return
        }

        await ProductCart.findByIdAndUpdate(pid, {
            quantity
        }, {
            new: true
        })

        const result = await Cart.findById(cid).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        if (!result) {
            return
        }

        return result

    }

    async removeAllProductsFromCart(cid) {

        const cart = await Cart.findById(cid)

        if (!cart) {
            return
        }

        await ProductCart.deleteMany({
            cart: cid
        })

        const result = await Cart.findByIdAndUpdate(cid, {
            $set: {
                products: []
            }
        }, {
            new: true
        }).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })

        return result

    }

    async purchaseCartProducts(cid, userId) {

        const cart = await Cart.findById(cid).populate({
            path: "products",
            populate: {
                path: "product"
            }
        })
            .populate("user", "email")

        if (!cart) {
            return
        }

        let productsFail = []

        let sum = 0

        for (let i = 0; i < cart.products.length; i++) {

            if (cart.products[i].product.stock > 0) {

                await Product.findByIdAndUpdate(cart.products[i].product._id, {
                    stock: cart.products[i].product.stock - cart.products[i].quantity
                }, {
                    new: true
                })

                await Cart.findByIdAndUpdate(cid, {
                    $pull: {
                        products: cart.products[i]._id
                    }
                }, {
                    new: true
                })

                sum+=cart.products[i].product.price

            } else {
                productsFail.push(cart.products[i].product._id)
            }

        }

        const tickets = await Ticket.find()

        const newTicket = new Ticket({
            code: `${tickets.length + 1}`,
            purchase_datetime: new Date(),
            amount: cart.products.length,
            purchaser: cart.user.email
        })

        await newTicket.save()

        await stripe.paymentIntents.create({
            amount: sum,
            currency: 'usd',
            metadata: {
                userId
            }
        })

        return await Product.find({
            stock: {
                $gt: 0
            }
        }).lean()

    }

}
