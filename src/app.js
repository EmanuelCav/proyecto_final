import express from 'express';
import path from 'path';
import morgan from 'morgan';
import passport from 'passport';
import { engine } from 'express-handlebars'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'

import { addLogger } from './lib/logger.js'

import indexRoute from './routes/index.routes.js'
import userRoute from './routes/users.routes.js'
import productRoute from './routes/products.routes.js'
import cartRoute from './routes/carts.routes.js'
import loggerRoute from './routes/logger.routes.js'
import messageRoute from './routes/message.routes.js'
import mocksRoute from './routes/mocks.routes.js'

const app = express()

app.use(addLogger)

import './helper/passport.js'
import { equal } from './helper/hbs.js'

app.engine('handlebars', engine({
    helpers: {
        if_eq: equal.if_eq,
        if_gt: equal.if_gt
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), "./views"));
app.set('view options', { layout: 'home' });

app.use(methodOverride('_method'));
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))
app.use(passport.initialize())
app.use(cookieParser())

app.use(userRoute)
app.use(productRoute)
app.use(cartRoute)
app.use(loggerRoute)
app.use(messageRoute)
app.use(mocksRoute)
app.use(indexRoute)

app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../public")))
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../documents")))
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../products")))
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../profiles")))

export default app