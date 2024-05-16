import { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types

const productCartSchema = new Schema({

    product: {
        type: ObjectId,
        ref: 'Product'
    },

    quantity: {
        type: Number,
        default: 0
    },

    cart: {
        type: ObjectId,
        ref: 'Cart'
    }

}, {
    timestamps: true,
    versionKey: false
})

export default model('ProductCart', productCartSchema)