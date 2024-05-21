import User from '../model/user.js';

import { forgotPasswordEmail } from '../helper/message.js';
import { hashPassword } from '../helper/encrypt.js';

export default class UserDAO {

    async getUsers(limit) {

        const result = await User.find().limit(limit).select("first_name last_name email role")

        return result

    }

    async passwordForgot(email) {

        const result = await User.findOne({ email })

        if (!result) return

        await forgotPasswordEmail(email)

        return result

    }

    async passwordRecover(email, password) {

        const result = await User.findOne({ email })

        if (!result) return

        if (password.length < 6) return

        if (result.password === password) return

        const pass = await hashPassword(password)

        const passwordUpdated = await User.findOneAndUpdate({ email }, {
            password: pass
        }, {
            new: true
        }).select("-password")

        return passwordUpdated

    }

    async userPremium(id) {

        const result = await User.findById(id).select("-password -email")

        if (!result) return

        if (result.documents.length < 3) return

        await User.findByIdAndUpdate(id, {
            role: 'premium'
        }, {
            new: true
        })

        return result

    }

    async documents(id, files) {

        const result = await User.findById(id).select("-password -email")

        if (!result) return

        for (let i = 0; i < files.length; i++) {
            await User.findByIdAndUpdate(id, {
                $push: {
                    documents: {
                        name: files[i].originalname,
                        reference: files[i].path
                    }
                }
            }, {
                new: true
            })
        }

        const userUpdated = await User.findByIdAndUpdate(id, {
            status: true
        }, {
            new: true
        })

        return userUpdated

    }

    async inactiveUsers() {

        const users = await User.find({
            last_connection: {
                $lte: new Date(new Date() - 1000 * 86400 * 2)
            }
        })

        return users

    }

    async deleteUser(id, email) {

        const user = await User.findById(id)

        if (!user) {
            return
        }

        await User.findByIdAndDelete(id)

        return await User.find({
            email: {
                $nin: [email]
            }
        }).select("-password").lean()

    }

}