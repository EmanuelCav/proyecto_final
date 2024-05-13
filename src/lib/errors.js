export default class CustomErrors {

    static generateError(name, message, status) {
        const error = new Error(message)
        error.name = name,
        error.status = status

        throw error
    }

}