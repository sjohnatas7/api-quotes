const app = require('../index')
const request = require('supertest')




describe("test the different types to get quotes", () => {
    it('Creates two users', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'Test User',
                email: 'createUser1@example.com',
                password: 'password',
                confirmPassword: 'password'
            });
        await request(app)
            .post('/signup')
            .send({
                name: 'Test User',
                email: 'createUser2@example.com',
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(201);

        const loginResponse = await request(app)
            .post('/signin')
            .send({
                email: 'createUser1@example.com',
                password: 'password'
            });
        const loginResponse2 = await request(app)
            .post('/signin')
            .send({
                email: 'createUser2@example.com',
                password: 'password'
            });
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.token).toBeTruthy();
        expect(loginResponse2.body.token).toBeTruthy();
    })
    it('trys to create a user without name', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                email: 'createUser3@example.com',
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe('O campo nome é necessário')
    })
    it('trys to create a user incorrect name', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 9,
                email: 'createUser4@example.com',
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe("\"Nome\" tem que ser do tipo 'texto'")
    })
    it('trys to create a user without email', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'user',
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe('O campo email é necessário')
    })
    it('trys to create a user incorrect email', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'user',
                email: false,
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe("\"Email\" tem que ser do tipo 'texto'")
    })
    it('trys to create a user without password', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'user',
                email: 'createUser5@example.com',
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe('O campo senha é necessário')
    })
    it('trys to create a user incorrect email', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'user',
                email: 'createUser6@example.com',
                password: 'pass',
                confirmPassword: 'pass'
            });
        expect(createUserResponse.statusCode).toBe(400)
        expect(createUserResponse.body.message).toBe("\"Senha\" deve ter no mínimo 8 letras")
    })
})