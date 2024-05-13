export class ProductDTO {

    constructor(data) {
        this.title = data.title
        this.description = data.description
        this.code = data.code
        this.price = data.price
        this.status = data.status
        this.stock = data.stock
        this.category = data.category
        this.thumbnails = data.thumbnails
    }

}