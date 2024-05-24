import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'
import { expect } from 'chai'
import dotenv from 'dotenv'

dotenv.config()

global.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGY3NWE5ZWU3M2QyM2E3MTg0MmEyZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTY1MDI2MDEsImV4cCI6MTcxNzEwNzQwMX0.hRXcBkHKKanee_Tb6BRseWdAwGgaH3DGULjLhc_TuHk"

describe('Test General', () => {

    before(async () => {
        await mongoose.connect(process.env.MONGO_DB);
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('Products', () => {

        it('Products should be an array', async () => {
            const response = await request(app).get("/api/products").set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGY3NWE5ZWU3M2QyM2E3MTg0MmEyZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTY0ODQ0OTQsImV4cCI6MTcxNzA4OTI5NH0.4SVZ3EbayH2TMuLR4bnrQ3ciaxuy2jYfX2mGfn5HePU`)
            expect(response.body).to.be.an('array')
        })

        const productId = "6643e444908d3f86a4e0746f"

        it('Get product must be a successfully response', async () => {
            const response = await request(app).get("/api/products/" + productId).set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGY3NWE5ZWU3M2QyM2E3MTg0MmEyZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTY0ODQ0OTQsImV4cCI6MTcxNzA4OTI5NH0.4SVZ3EbayH2TMuLR4bnrQ3ciaxuy2jYfX2mGfn5HePU`)
            expect(response.statusCode).to.equal(200)
        })

        it('Remove product should response OK', async () => {
            const response = await request(app).delete("/api/products/" + productId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGY3NWE5ZWU3M2QyM2E3MTg0MmEyZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTY0ODQ0OTQsImV4cCI6MTcxNzA4OTI5NH0.4SVZ3EbayH2TMuLR4bnrQ3ciaxuy2jYfX2mGfn5HePU')
            expect(response.ok).to.be.true
        })

    })

    describe('Session', () => {

        const dataRegister = {
            firstname: "example",
            lastname: "sample",
            email: 'example@gmail.com',
            password: "password",
            confirm: "password"
        }

        it('Should create a user successfully', async () => {
            const response = await request(app).post("/register").send(dataRegister)
            expect(response.ok).to.be.true
        })

        const dataLogin = {
            email: "cavallinema@gmail.com",
            password: "password"
        }

        it('Login body should response 200', async () => {
            const response = await request(app).post("/login").send(dataLogin)
            expect(response.statusCode).to.equal(200)
        })

        it('GET userShould response OK', async () => {
            const response = await request(app).get("/api/users").set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGY3NWE5ZWU3M2QyM2E3MTg0MmEyZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTY0ODQ0OTQsImV4cCI6MTcxNzA4OTI5NH0.4SVZ3EbayH2TMuLR4bnrQ3ciaxuy2jYfX2mGfn5HePU')
            expect(response.ok).to.be.true
        })

    })

    describe('Carts', () => {

        const cartId = '6644f850e88091d78d7be659'

        it('GET cart Should response a successfully status', async () => {
            const response = await request(app).get("/api/carts/" + cartId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.statusCode).to.equal(200)
        })

        it('Remove should response OK', async () => {
            const response = await request(app).delete("/api/carts/" + cartId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.ok).to.be.true
        })

        it('Create cart must have cart property', async () => {
            const response = await request(app).post(`/api/carts`).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.body).to.have.property("cart")
        })

    })

})