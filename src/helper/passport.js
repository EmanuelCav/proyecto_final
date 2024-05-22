import passport from 'passport';
import { Strategy } from 'passport-local';
import GithubStrategy from 'passport-github2';
import bcryptjs from 'bcryptjs';

import User from '../model/user.js';

import { github_client_id, github_client_secret } from '../config/config.js';

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