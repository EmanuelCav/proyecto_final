import passport from 'passport';
import { Strategy } from 'passport-local';
import GithubStrategy from 'passport-github2';
import bcryptjs from 'bcryptjs';

import User from '../model/user.js';
import { RegisterDTO } from '../dto/user.dto.js';

import { github_client_id, github_client_secret } from '../config/config.js';

import { infoEmail } from '../helper/message.js';
import { generateToken } from '../helper/token.js';

passport.use('login', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (email, password, done) => {

    if (!email || !password) {
        return done(null, false, {
            message: "There are empty fields"
        })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return done(null, false, {
            message: "User does not exists"
        })
    }

    const verifyPassword = await bcryptjs.compare(password, user.password)

    if (!verifyPassword) {
        return done(null, false, {
            message: "Fields do not match"
        })
    }

    const token = generateToken(user._id, user.role, user.email)

    const userData = {
        token,
        user
    }

    return done(null, userData, {
        message: "¡Welcome!"
    })

}))

passport.use("register", new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.phone || !req.body.confirm) {
        return done(null, false, {
            message: "There are empty fields"
        })
    }

    if (req.body.password.length < 6) {
        return done(null, false, {
            message: "The password must have at least 6 charactes"
        })
    }

    if(req.body.confirm !== req.body.password) {
        return done(null, false, {
            message: "Passwords do not match"
        })
    }

    const userExists = await User.findOne({ email: req.body.email })

    if (userExists) {
        return done(null, false, {
            message: "The email is already registered"
        })
    }

    const salt = await bcryptjs.genSalt(8)
    const hash = await bcryptjs.hash(req.body.password, salt)

    const newUser = new User(new RegisterDTO({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
        role: req.body.role && req.body.role
    }))

    const userSaved = await newUser.save()

    const user = await User.findById(userSaved._id).select("-password")

    if (!user) {
        return done(null, false, {
            message: "User does not exists"
        })
    }

    req.logIn(user, {
        session: false
    }, (err) => {
        done(null, err)
    })

    const token = generateToken(user._id, user.role, user.email)

    await infoEmail(req.body.email)
    
    const userConnected = await User.findById(userSaved._id, {
        last_connection: new Date()
    }, {
        new: true
    }).select("-password")

    const userData = {
        token,
        user: userConnected
    }


    return done(null, userData, {
        message: "¡Welcome!"
    })

}))

passport.use("current", new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {


    const user = await User.findById(req.user.id)

    return done(null, user)

}))

passport.use("github", new GithubStrategy.Strategy({
    clientID: `${github_client_id}`,
    clientSecret: `${github_client_secret}`,
    callbackURL: "http://127.0.0.1:4000/auth/github/callback"
}, async function (accessToken, refreshToken, profile, cb) {

    const user = await User.findOne({ githubId: profile.id });

    if (user) {
        return cb(null, profile)
    }

    const salt = await bcryptjs.genSalt(8)
    const password = await bcryptjs.hash(profile.nodeId, salt)

    const newUser = new User({
        githubId: profile.id,
        firstname: profile.displayName.split(" ")[0],
        lastname: profile.displayName.split(" ")[1],
        email: `${String(profile.username).toLowerCase()}@gmail.com`,
        password,
        role: 'usuario'
    })

    const userSaved = await newUser.save()

    return cb(null, userSaved)
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    User.findById(id).then((data) => {
        done(null, data)
    }).catch((err) => {
        done(err, false)
    })
})