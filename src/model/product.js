import { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    }, 

    description: {
        type: String,
        required: true
    }, 

    code: {
        type: String,
        required: true,
        unique: true
    }, 
    
    price: {
        type: Number,
        required: true
    }, 
    
    status: {
        type: Boolean,
        default: true
    }, 
    
    stock: {
        type: Number,
        required: true
    }, 
    
    category: {
        type: String,
        required: true
    },

    thumbnails: [{
        image: String,
        imageId: String
    }],

    owner: {
        type: ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true,
    versionKey: false
})

export default model('Product', productSchema)