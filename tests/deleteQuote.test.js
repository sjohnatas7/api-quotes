const app = require('../index')
const request = require('supertest')

let payloadUser1;
let payloadUser2;
beforeAll(async () => {
    const createUserResponse = await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'deleteQuote1@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'deleteQuote2@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    expect(createUserResponse.statusCode).toBe(201);

    const loginResponse = await request(app)
        .post('/signin')
        .send({
            email: 'deleteQuote1@example.com',
            password: 'password'
        });
    const loginResponse2 = await request(app)
        .post('/signin')
        .send({
            email: 'deleteQuote2@example.com',
            password: 'password'
        });
    payloadUser1 = loginResponse.body;
    payloadUser2 = loginResponse2.body;
    expect(loginResponse.statusCode).toBe(200);
    expect(payloadUser1.token).toBeTruthy();
    expect(payloadUser2.token).toBeTruthy();
})
describe("test the different types to delete quotes", () => {

    it('Creates a new quotes', async () => {
        const QuoteFromUser1 = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Be or not to be"
            })
        expect(QuoteFromUser1.statusCode).toBe(201)
    })
    it('Trys to where a quote where another user is the author', async () => {
        const response = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser2.token}`)
            .send({
                quote: "Be or not to be",
                user_id: 1
            })

        expect(response.statusCode).toBe(401)
    })
    it('trys to create a quotethat isn\'t a string',async()=>{
        const response = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser2.token}`)
            .send({
                quote: 9,
            })

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('A citação deve ser um texto')
    })
    it('trys to create a quote without the quote param',async()=>{
        const response = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser2.token}`)
            .send({
            })

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Citação não informada')
    })
})