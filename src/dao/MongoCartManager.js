import Cart from '../model/cart.js';
import ProductCart from '../model/productCart.js';
import Product from'../model/product.js';
import Ticket from'../model/ticket.js';

import ProductManager from './MongoProductManager.js';

const productManager = new ProductManager()

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

    async addProduct(quantity, cid, pid) {

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
            quantity,
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

    async purchaseCartProducts(cid) {

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
            } else {
                productsFail.push(cart.products[i].product._id)
            }
        }

        if(productsFail.length > 0) {
            return productsFail
        }

        const tickets = await Ticket.find()

        const newTicket = new Ticket({
            code: `${tickets.length + 1}`,
            purchase_datetime: new Date().now(),
            amount: cart.products.length,
            purchaser: cart.user.email
        })

        return await newTicket.save()

    }

}
