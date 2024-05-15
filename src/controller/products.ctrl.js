import MongoProductManager from '../dao/MongoProductManager.js';
import { ProductDTO } from '../dto/product.dto.js';

import CustomErrors from '../lib/errors.js';

import { statusMessage, nameMessage } from '../helper/statusMessage.js';
import { cloud } from '../helper/cloud.js';

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

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(statusMessage.BAD_REQUEST).render('panel', {
                layout: 'home',
                error: 'There are empty fields. Please complete',
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

    const { pid } = req.params

    try {

        const result = await ProductManager.updateProduct(pid, req.body)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Product does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.CREATED).json({
            message: "Product updated succesfully",
            product: result
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

        return res.status(statusMessage.OK).redirect('/panel')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}