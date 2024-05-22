import MongoCartManager from '../dao/MongoCartManager.js';

import CustomErrors from '../lib/errors.js';

import { statusMessage, nameMessage } from '../helper/statusMessage.js';

const CartManager = new MongoCartManager()

export const createCart = async (req, res) => {

    try {

        const result = await CartManager.createCart(req.user.id)

        return res.status(statusMessage.OK).json({
            message: "Cart added successfully",
            cart: result
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const getCart = async (req, res) => {

    const { cid } = req.params

    try {

        const result = await CartManager.getCartById(cid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Cart does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).json(result)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }


}

export const addProductCart = async (req, res) => {

    const { cid, pid } = req.params

    try {

        const result = await CartManager.addProduct(cid, pid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product or cart does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).redirect('/cart')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const removeProductCart = async (req, res) => {

    const { cid, pid } = req.params

    try {

        const result = await CartManager.removeProductFromCart(cid, pid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product or cart does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).redirect('/cart')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const quantityProductCart = async (req, res) => {

    const { cid, pid, quantity } = req.params
    const { operation } = req.query

    try {

        const result = await CartManager.updateQuantityProducts(operation === 'sum' ? Number(quantity) + 1 : Number(quantity) - 1, cid, pid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product or cart does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.CREATED).redirect('/cart')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const removeAllProducts = async (req, res) => {

    const { cid } = req.params

    try {

        const result = await CartManager.removeAllProductsFromCart(cid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Cart does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).redirect('/cart')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const purchaseCart = async (req, res) => {

    const { cid } = req.params

    try {

        const result = await CartManager.purchaseCartProducts(cid, req.user.id)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Error to generate ticket", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).render('products', {
            layout: 'home',
            message: "Thank you for your purchase",
            products: result,
            user: req.user
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }


}