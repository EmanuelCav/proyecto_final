import MessageDAO from '../dao/MongoMessageManager.js';

import CustomErrors from '../lib/errors.js';

import { statusMessage, nameMessage } from '../helper/statusMessage.js';

const messageDAO = new MessageDAO()

export const createMessages = async (req, res) => {

    const { message } = req.body

    try {

        const showMessage = await messageDAO.createMessage(req.user._id, message)

        if(!showMessage) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Message field is empty. Please complete", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).json(showMessage)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const getAllMessages = async (req, res) => {

    try {

        const messages = await messageDAO.getMessages()

        return res.status(statusMessage.OK).json(messages)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}