import { faker } from '@faker-js/faker';

export const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 0, max: 20 }),
        category: faker.word.words({
            count: 1
        }),
        thumbnails: faker.helpers.arrayElements(['image1', 'image2', 'image3', 'image4', 'image5'])
    }
}