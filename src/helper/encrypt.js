import bcryptjs from 'bcryptjs'

export const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(8)
    return await bcryptjs.hash(password, salt)
}

export const comparePassword = async (password, hash) => {
    return await bcryptjs.compare(password, hash)
}