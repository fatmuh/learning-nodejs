import supertest from "supertest";
import {web} from "../src/application/web.js";
import {prismaClient} from "../src/application/database.js";

describe('POST /api/users', () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "fatmuh"
            }
        })
    })

    it('Should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "fatmuh",
                password: "admin",
                name: "Fathur Muhammad",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("fatmuh")
        expect(result.body.data.name).toBe("Fathur Muhammad")
        expect(result.body.data.password).toBeUndefined()
    })

    it('Should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "",
                password: "",
                name: "",
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it('Should reject if username already exist', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: "fatmuh",
                password: "admin",
                name: "Fathur Muhammad",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("fatmuh")
        expect(result.body.data.name).toBe("Fathur Muhammad")
        expect(result.body.data.password).toBeUndefined()

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: "fatmuh",
                password: "admin",
                name: "Fathur Muhammad",
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})