import { MessageDTO } from '../dto/message.dto.js';

import Message from '../model/message.js';

export default class MessageDAO {

    async createMessage(user, message) {

        if (!message) {
            return
        }

        const newMessage = new Message(new MessageDTO({
            user,
            message
        }))

        await newMessage.save()

        return await Message.find().populate({
            path: 'user',
            select: 'first_name image'
        }).lean()

    }

    async getMessages() {

        return await Message.find()

    }

}