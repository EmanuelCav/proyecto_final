import { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types

const cartSchema = new Schema({

    products: [{
        type: ObjectId,
        ref: 'ProductCart'
    }],

    user: {
        type: ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true,
    versionKey: false
})

export default model('Cart', cartSchema)