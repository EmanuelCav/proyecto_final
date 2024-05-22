import Product from '../model/product.js'

import MongoProductManager from '../dao/MongoProductManager.js';
import { ProductDTO } from '../dto/product.dto.js';

import CustomErrors from '../lib/errors.js';

import { statusMessage, nameMessage } from '../helper/statusMessage.js';
import { cloud } from '../helper/cloud.js';
import { removeProductEmail } from '../helper/message.js';

const ProductManager = new MongoProductManager()

export const products = async (req, res) => {

    const { limit } = req.query

    try {

        const result = await ProductManager.getProducts(limit)

        return res.status(statusMessage.OK).json(result)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const productGet = async (req, res) => {

    const { pid } = req.params

    try {

        const result = await ProductManager.getProductsId(pid)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).json(result)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const productCreate = async (req, res) => {

    const { title, description, code, price, status, stock, category } = req.body

    try {

        const numbers = /^[0-9]*$/

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                error: 'There are empty fields. Please complete',
                user: req.user
            })
        }

        if(!numbers.test(price)) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                error: 'Price field must be a number',
                user: req.user
            })
        }

        if(!numbers.test(stock)) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                error: 'Stock field must be a number',
                user: req.user
            })
        }

        let routeImages = []

        if (req.files.length === 0) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                error: 'You have upload images',
                user: req.user
            })
        }

        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const result = await cloud.uploader.upload(req.files[i].path)
                routeImages.push({
                    image: result.url,
                    imageId: result.public_id
                })
            }
        }

        await ProductManager.createProducts(new ProductDTO({
            title,
            description,
            code,
            price: Number(price),
            status: status === undefined ? true : status,
            stock: Number(stock),
            category,
            thumbnails: routeImages,
            owner: req.user.id
        }))

        return res.status(statusMessage.CREATED).render('panel', {
            layout: 'home',
            message: 'Product created successfully',
            user: req.user
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const productUpdate = async (req, res) => {

    const { title, description, code, price, stock, category } = req.body
    const { pid } = req.params

    try {

        const numbers = /^[0-9]*$/

        const product = await Product.findById(pid).lean()

        if (!product) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product does not exists", statusMessage.BAD_REQUEST)
        }

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(statusMessage.BAD_REQUEST).render('update', {
                layout: 'home',
                user: req.user,
                product,
                error: "There are empty fields"
            })
        }

        if(!numbers.test(price)) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                user: req.user,
                product,
                error: 'Price field must be a number',
            })
        }

        if(!numbers.test(stock)) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                user: req.user,
                product,
                error: 'Stock field must be a number',
            })
        }

        const result = await ProductManager.updateProduct(pid, req.body)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.CREATED).render('update', {
            layout: 'home',
            user: req.user,
            product: result,
            message: "Product updated successfully"
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const productDelete = async (req, res) => {

    const { pid } = req.params

    try {

        const result = await ProductManager.removeProduct(pid, req.user)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product does not exists or you cannot remove this product", statusMessage.BAD_REQUEST)
        }

        const user = await User.findById(req.user.id).select("-password")

        if(user.role === 'premium') {
            await removeProductEmail(user.email)
        }

        return res.status(statusMessage.OK).redirect('/panel')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}