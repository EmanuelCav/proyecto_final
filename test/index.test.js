import app from '../src/app.js'
import '../src/database/database.js'
import passport from 'passport'
import { expect } from 'chai'
import request from 'supertest'

app.use(passport.initialize())

import '../src/helper/passport.js'

const requester = request(app)

describe('Test General', () => {

    describe('Products', () => {

        it('Products should be an array', async () => {
            const response = await requester.get("/api/products").set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.body).to.be.a('array');
        })

        const productId = "65b54674647153e428f4b948"

        it('Get product must be a successfully response', async () => {
            const response = await requester.get("/api/products/" + productId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.statusCode).to.equal(200)
        })

        it('Remove product should response OK', async () => {
            const response = await requester.delete("/api/products/" + productId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.ok).to.be.true
        })

    })

    describe('Session', () => {

        const dataRegister = {
            firstname: "example",
            lastnname: "sample",
            phone: "+541166666666",
            email: 'example@gmail.com',
            password: "password",
            confiirm: "password"
        }

        it('Should create a user successfully', async () => {
            const response = await requester.post("/api/register").send(dataRegister)
            expect(response.ok).to.be.true
        })

        const dataLogin = {
            email: "example@gmail.com",
            password: "password"
        }

        it('Login body should have a email field', async () => {
            const response = await requester.post("/api/login").send(dataLogin)
            expect(response.body).to.have.property('email')
        })

        it('Should response OK', async () => {
            const response = await requester.get("/api/users")
            expect(response.ok).to.be.true
        })

    })

    describe('Carts', () => {

        const cartId = '66020b1c17cc34fb57ba5c21'
        const productId = "65b54674647153e428f4b948"

        it('GET cart Should response a successfully status', async () => {
            const response = await requester.get("/api/carts/" + cartId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.statusCode).to.equal(200)
        })

        it('Remove should response OK', async () => {
            const response = await requester.delete("/api/carts/" + cartId).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.ok).to.be.true
        })

        const data = {
            quantity: 2
        }

        it('Set quantity must have that property', async () => {
            const response = await requester.put(`/api/carts/${cartId}/products/${productId}`).send(data).set("Authorization", `Bearer ` + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU1Mzc3ZjlhNzc3NzliY2QwOTU1ZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5jb2RlckBjb2Rlci5jb20iLCJpYXQiOjE3MTE0MTI2NjIsImV4cCI6MTcxNjU5NjY2Mn0.7aoP3MPVAustQIoIYtIdZbFbwiZFEJaKSpp_Q_o-rYY')
            expect(response.body).to.have.property("quantity")
        })

    })

})