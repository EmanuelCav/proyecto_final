import Product from'../model/product.js';

import { cloud } from '../helper/cloud.js';

export default class ProductDAO {

    async createProducts(product) {

        const result = new Product(product)

        return await result.save()

    }

    async getProducts(limit) {

        const result = await Product.find().limit(limit)

        return result
    }

    async getProductsId(id) {
        const result = await Product.findById(id)

        if (!result) {
            return
        }

        return result
    }

    async removeProduct(id, user) {

        const product = await Product.findById(id)

        if (user.role === 'premium') {
            if (product.owner !== user._id) {
                return
            }
        }

        if (!product) {
            return
        }

        for (let i = 0; i < product.thumbnails.length; i++) {
            await cloud.uploader.destroy(product.thumbnails[i].imageId)
        }

        await Product.findByIdAndDelete(id)

        const result = await Product.find().lean()

        return result
    }

    async updateProduct(id, product) {

        await Product.findById(id)

        if (!product) {
            return
        }

        const result = await Product.findByIdAndUpdate(id, product, {
            new: true
        }).lean()

        return result

    }

}