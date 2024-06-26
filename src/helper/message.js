import nodemailer from 'nodemailer';

import { my_host, my_mail, my_pass } from '../config/config.js';

const transport = nodemailer.createTransport({
    host: my_host,
    port: 587,
    secure: false,
    auth: {
        user: my_mail,
        pass: my_pass
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const infoEmail = async (email) => {

    try {

        await transport.sendMail({
            from: `'EMAILS' ${my_mail}`,
            to: email,
            subject: "eCommerce",
            html: "<b>¡Welcome to eCommerce!</b>"
        })

    } catch (error) {
        throw (error)
    }

}

export const forgotPasswordEmail = async (email) => {

    try {

        await transport.sendMail({
            from: `'EMAILS' ${my_mail}`,
            to: email,
            subject: "eCommerce - Forgot password",
            html: "<a href='http://localhost:4000/recover'>Recover account</a>"
        })
        
    } catch (error) {
        throw (error)
    }

}

export const removeProductEmail = async (email) => {

    try {

        await transport.sendMail({
            from: `'EMAILS' ${my_mail}`,
            to: email,
            subject: "eCommerce - Product removed",
            html: "Product removed successfully"
        })
        
    } catch (error) {
        throw (error)
    }

}

export const inactiveEmail = async (email) => {

    try {

        await transport.sendMail({
            from: `'EMAILS' ${my_mail}`,
            to: email,
            subject: "eCommerce - Deleted account",
            html: "Your account has been deleted due to inactivity"
        })
        
    } catch (error) {
        throw (error)
    }

}