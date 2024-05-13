import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema({

    first_name: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, 'Firstname is not valid']
    },

    last_name: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, 'Lastname is not valid']
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is not valid'],
        lowercase: true
    },

    age: {
        type: Number
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    cartId: {
        type: Types.ObjectId,
        ref: 'Cart'
    },

    phone: {
        type: String,
        trim: true
    },

    role: {
        type: String,
        default: 'user'
    },

    status: {
        type: Boolean,
        default: false
    },

    documents: [{
        name: String,
        reference: String
    }],

    last_connection: Date,

    githubId: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false
})

export default model('User', userSchema)