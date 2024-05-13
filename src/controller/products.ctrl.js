import fs from 'fs-extra'

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
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "There are empty fields. Please complete", statusMessage.BAD_REQUEST)
        }

        let routeImages = []

        if (req.files.length === 0) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "You have upload images", statusMessage.BAD_REQUEST)
        }

        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const result = await cloud.uploader.upload(req.files[i].path)
                routeImages.push(result.public_id)
                await fs.unlink(req.files[i].path)
            }
        }

        const result = await ProductManager.createProducts(new ProductDTO({
            title,
            description,
            code,
            price,
            status: status === undefined ? true : status,
            stock,
            category,
            thumbnails: req.files ? routeImages : [],
            owner: req.user._id ? req.user._id : 'admin'
        }))

        return res.status(statusMessage.OK).json({
            message: "Product added successfully",
            product: result
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

        return res.status(statusMessage.OK).json({ message: "Product removed sucessfully" })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}