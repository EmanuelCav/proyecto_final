import http from 'http';
import { Server } from 'socket.io';
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { fileURLToPath } from 'url'
import { loggerDev } from './lib/logger.js'

import MessageDAO from './dao/MongoMessageManager.js'

import app from './app.js'

import { port } from './config/config.js'

import './database/database.js'

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Documentation about products and carts",
            description: "API for products and carts from eCommerce documentation"
        }
    },
    apis: [`${path.dirname(fileURLToPath(import.meta.url))}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const httpServer = http.createServer(app)

httpServer.listen(port, () => {
    loggerDev.info("Server running on port " + port)
})

const io = new Server(httpServer)

const messageDao = new MessageDAO()

io.on('connection', async (socket) => {

    loggerDev.info("You are connected")

    socket.on("newMessage", async (message) => {
        await messageDao.createMessage(message.user, message.message)
        const messages = await messageDao.getMessages()
        io.emit("updateMessages", messages)
    })


})