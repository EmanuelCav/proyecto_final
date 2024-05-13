import mongoose from 'mongoose';

import { loggerDev } from '../lib/logger.js';

import { mongo_db } from '../config/config.js';

(async () => {

    try {

        const connection = await mongoose.connect(`${mongo_db}`)

        if(connection.STATES.connected) {
            loggerDev.info("Base de datos funcionando")
        }
        
    } catch (error) {
        loggerDev.error(error)
    }

})()