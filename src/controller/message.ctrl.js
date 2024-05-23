import MessageDAO from '../dao/MongoMessageManager.js';

import CustomErrors from '../lib/errors.js';

import Message from '../model/message.js'

import { statusMessage, nameMessage } from '../helper/statusMessage.js';

const messageDAO = new MessageDAO()

export const createMessages = async (req, res) => {

    const { message } = req.body

    try {

        const messages = await Message.find().populate({
            path: 'user',
            select: 'first_name image'
        }).lean()

        if (!message) {
            return res.status(statusMessage.BAD_REQUEST).render('chat', {
                layout: 'home',
                messages,
                user: req.user,
                error: "Write a text to send a message"
            })
        }

        const result = await messageDAO.createMessage(req.user.id, message)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "Message field is empty. Please complete", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).render('chat', {
            layout: 'home',
            messages: result,
            user: req.user
        })

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