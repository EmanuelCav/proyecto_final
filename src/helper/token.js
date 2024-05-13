import jwt from 'jsonwebtoken';

import { jwt_key, jwt_email_key } from '../config/config.js';

export const generateToken = (id, role, email) => {
    return jwt.sign({ id, role, email }, `${jwt_key}`, {
        expiresIn: '7d'
    })
}

export const linkToken = (email) => {
    return jwt.sign({ email }, `${jwt_email_key}`, {
        expiresIn: '1h'
    })
}