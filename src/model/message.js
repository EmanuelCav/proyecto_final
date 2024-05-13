import { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types

const messageSchema = new Schema({

    message: {
        type: String,
        required: true,
        trim: true
    },

    user: {
        type: ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true,
    versionKey: false
})

export default model('Message', messageSchema)