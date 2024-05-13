import Product from'../model/product.js';

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

        const result = await Product.findByIdAndDelete(id)

        return result
    }

    async updateProduct(id, product) {

        await Product.findById(id)

        if (!product) {
            return
        }

        const result = await Product.findByIdAndUpdate(id, product, {
            new: true
        })

        return result

    }

}