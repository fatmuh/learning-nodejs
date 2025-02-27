import supertest from "supertest";
import {web} from "../src/application/web.js";
import {
    createTestUser,
    getTestUser,
    removeTestUser
} from "./test-util.js";
import {logger} from "../src/application/logging.js";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {
    afterEach(async () => {
        await removeTestUser()
    })

    it('Should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "test",
                password: "admin",
                name: "test",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
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
                username: "test",
                password: "admin",
                name: "test",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined()

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: "test",
                password: "admin",
                name: "test",
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('Should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "test",
                password: "admin"
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    })

    it('Should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "",
                password: ""
            });

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('Should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "test",
                password: "salah"
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })

    it('Should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "salah",
                password: "salah"
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    })

    it('Should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
    })

    it('Should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })
})

describe('PATCH /api/users/current',  () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    })


    it('Should can update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: "Fathur",
                password: "rahasia"
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("Fathur");

        const user = await getTestUser()
        expect(await bcrypt.compare("rahasia", user.password)).toBe(true)
    })

    it('Should can update user name', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: "Fathur",
                password: "rahasia"
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("Fathur");
    })

    it('Should can update user password', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: "rahasia"
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");

        const user = await getTestUser()
        expect(await bcrypt.compare("rahasia", user.password)).toBe(true)
    })

    it('Should reject if request is not valid', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'salah')
            .send({});

        logger.info(result.body)

        expect(result.status).toBe(401);
    })
})

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    })

    it('Should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test');

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const user = await getTestUser();
        expect(user.token).toBeNull()
    })

    it('Should reject logout if token is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah');

        logger.info(result.body)

        expect(result.status).toBe(401)
    })
})