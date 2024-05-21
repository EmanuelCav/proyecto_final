import passport from 'passport';

import MongoUserManager from '../dao/MongoUserManager.js';

import CustomErrors from '../lib/errors.js';

import User from '../model/user.js'

import { statusMessage, nameMessage } from '../helper/statusMessage.js';
import { generateToken, linkToken } from '../helper/token.js';
import { comparePassword, hashPassword } from '../helper/encrypt.js';
import { infoEmail } from '../helper/message.js';

import { RegisterDTO } from '../dto/user.dto.js';

const userManager = new MongoUserManager()

export const users = async (req, res) => {

    try {

        const result = await userManager.getUsers()

        return res.status(statusMessage.OK).json(result)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const forgotPassword = async (req, res) => {

    const { email } = req.body

    try {

        const result = await userManager.passwordForgot(email)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists", statusMessage.BAD_REQUEST)
        }

        const token = linkToken(email)

        return res.status(statusMessage.OK).json({
            message: "Check your email",
            token
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const recoverPassword = async (req, res) => {

    const { email } = req.params
    const { password } = req.body

    try {

        const result = await userManager.passwordRecover(email, password)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or password is not avaible", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).json({
            message: "Password updated successfully",
            user: result
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

// export const login = passport.authenticate('login', {
//     failureRedirect: '/login',
//     successRedirect: '/products',
//     successFlash: true,
//     failureFlash: true,
//     session: false
// })

// export const register = passport.authenticate('register', {
//     failureRedirect: '/register',
//     successRedirect: '/products',
//     successFlash: true,
//     failureFlash: true,
//     session: false
// })

export const updatePremium = async (req, res) => {

    const { id } = req.params

    try {

        const result = await userManager.userPremium(id)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or documents have not valid information", statusMessage.BAD_REQUEST)
        }

        return res.status(200).json({ message: "Now user is premium" })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const uploadDocument = async (req, res) => {

    const { uid } = req.params

    try {

        if (req.files.length === 0) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "You have to upload a file", statusMessage.BAD_REQUEST)
        }

        const result = await userManager.documents(uid, req.files)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or user is not premium", statusMessage.BAD_REQUEST)
        }

        return res.status(200).json({ message: "File uploaded successfully" })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const login = async (req, res) => {

    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(statusMessage.BAD_REQUEST).render('login', {
                layout: 'home',
                error: 'There are empty fields'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(statusMessage.BAD_REQUEST).render('login', {
                layout: 'home',
                error: 'User does not exists or password is incorrect'
            })
        }

        const verifyPassword = await comparePassword(password, user.password)

        if (!verifyPassword) {
            return res.status(statusMessage.BAD_REQUEST).render('login', {
                layout: 'home',
                error: 'User does not exists or password is incorrect'
            })
        }

        const token = generateToken(user._id, user.role, user.email)

        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.cookie('isLoggedIn', true, { httpOnly: true, secure: true, maxAge: 3600000 })

        return res.status(statusMessage.OK).redirect('/products')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const register = async (req, res) => {

    const { email, password, firstname, lastname, confirm, role } = req.body

    try {

        const letters = /^[a-zA-Z]*$/

        if (!email || !password || !firstname || !lastname || !confirm) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'There are empty fields'
            })
        }

        if (password.length < 6) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'Password must have more than 5 characters'
            })
        }

        if (confirm !== password) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'Passwords do not match'
            })
        }

        if (!letters.test(firstname) || !letters.test(lastname)) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'Only letters are allowed in name field'
            })
        }

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'Email is already registered. Please try another'
            })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = new User(new RegisterDTO({
            first_name: firstname,
            last_name: lastname,
            email,
            password: hashedPassword,
            role: role ? role : 'user'
        }))

        const userSaved = await newUser.save()

        const user = await User.findById(userSaved._id).select("-password")

        if (!user) {
            return res.status(statusMessage.BAD_REQUEST).render('register', {
                layout: 'home',
                error: 'User does not exists'
            })
        }

        const token = generateToken(user._id, user.role, user.email)

        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.cookie('isLoggedIn', true, { httpOnly: true, secure: true, maxAge: 3600000 })

        await infoEmail(email)

        return res.status(statusMessage.OK).redirect('/products')

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const removeUsers = async (req, res) => {

    try {

        await userManager.inactiveUsers()

        return res.status(statusMessage.OK).json({ message: "User removed successfully" })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const removeUser = async (req, res) => {

    const { id } = req.params

    try {

        const result = await userManager.deleteUser(id, req.user.email)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).render('users', {
            layout: 'home',
            user: req.user,
            users: result,
            message: "User removed successfully"
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}
