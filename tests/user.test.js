const app = require('../index')
const request = require('supertest')



describe('checking user', () => {
    let payload;
    it('Creates User and Gets Token', async () => {
        const createUserResponse = await request(app)
            .post('/signup')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password',
                confirmPassword: 'password'
            });
        expect(createUserResponse.statusCode).toBe(201);

        const loginResponse = await request(app)
            .post('/signin')
            .send({
                email: 'testuser@example.com',
                password: 'password'
            });
        payload = loginResponse.body;
        expect(loginResponse.statusCode).toBe(200);
        expect(payload.token).toBeTruthy();
    });
    it('Check User Account', async () => {
        const response = await request(app)
            .get(`/users/${payload.id}`)
            .set('Authorization', `Bearer ${payload.token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe('testuser@example.com');
    });
    it('Changes User Email', async () => {
        const response = await request(app)
            .put(`/users/${payload.id}`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                email: 'newemail@example.com'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.updated).toBe(1);
    })
    it('Try to update a different user', async () => {
        const response = await request(app)
            .put(`/users/${payload.id + 1}`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                email: 'newemail@example.com'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Você não tem autorização para editar esse usuario')
    })
    it('Try to delete a different user', async () => {
        const response = await request(app)
            .delete(`/users/${payload.id + 1}`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                email: 'newemail@example.com'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Você não tem autorização para fazer isso')
    })
    it('Delete User', async () => {
        const response = await request(app)
            .delete(`/users/${payload.id}`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                email: 'newemail@example.com'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.deleted).toBe(1);
    })

})