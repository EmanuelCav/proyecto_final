import { statusMessage, nameMessage } from '../helper/statusMessage.js';

import CustomErrors from '../lib/errors.js';
import { generateProducts } from '../lib/mocks.js';

export const mocks = async (req, res) => {

    try {

        let products = []

        for (let i = 0; i < 100; i++) {
            products.push(generateProducts())
        }

        return res.status(statusMessage.OK).json(products)

    } catch (error) {
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}