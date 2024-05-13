import { MessageDTO } from '../dto/message.dto.js';

import Message from '../model/message.js';

export default class MessageDAO {

    async createMessage(user, message) {

        if(!message) {
            return
        }

        const newMessage = new Message(new MessageDTO({
            user,
            message
        }))

        return await newMessage.save()

    }

    async getMessages() {

        return await Message.find()

    }

}