export class RegisterDTO {

    constructor(data) {
        this.first_name = data.first_name
        this.last_name = data.last_name
        this.email = data.email
        this.password = data.password
        this.role = data.role
    }

}

export class UserDTO {
    constructor(data) {
        this.first_name = data.first_name
        this.last_name = data.last_name
        this.email = data.email
        this.role = data.role
    }
}