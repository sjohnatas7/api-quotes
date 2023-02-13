const app = require('../index')
const request = require('supertest')

let payloadUser1;
let payloadUser2;

beforeAll(async () => {
    const createUserResponse = await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'getQuote1@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'getQuote2@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    expect(createUserResponse.statusCode).toBe(201);

    const loginResponse = await request(app)
        .post('/signin')
        .send({
            email: 'getQuote1@example.com',
            password: 'password'
        });
    const loginResponse2 = await request(app)
        .post('/signin')
        .send({
            email: 'getQuote2@example.com',
            password: 'password'
        });
    payloadUser1 = loginResponse.body;
    payloadUser2 = loginResponse2.body;
    expect(loginResponse.statusCode).toBe(200);
    expect(payloadUser1.token).toBeTruthy();
    expect(payloadUser2.token).toBeTruthy();
})
describe("test the different types to get quotes", () => {

    it('Get All Quotes', async () => {
        const newQuoteFromUser1 = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Money don't make you happy"
            })
        const newQuoteFromUser2 = await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser2.token}`)
            .send({
                quote: "No pain no gain"
            })
        expect(newQuoteFromUser1.statusCode).toBe(201)
        expect(newQuoteFromUser2.statusCode).toBe(201)

        const response = await request(app)
            .get(`/quotes`)
            .set('Authorization', `Bearer ${payloadUser1.token}`);

        expect(response.statusCode).toBe(200);

        const quotes = response.body;
        const quote1 = quotes.filter(quote => quote.quote === "Money don't make you happy");
        const quote2 = quotes.filter(quote => quote.quote === 'No pain no gain');

        expect(quote1).toBeDefined();
        expect(quote2).toBeDefined();
    })
    it('Check Quotes from User', async () => {
        await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Ask not what your country can do for you, ask what you can do for your country."
            })
        const responseUser1 = await request(app)
            .get(`/users/${payloadUser1.id}/quotes`)
            .set('Authorization', `Bearer ${payloadUser1.token}`);
        expect(responseUser1.statusCode).toBe(200);
        expect(responseUser1.body).toBeDefined()

        await request(app)
            .post(`/quotes/`)
            .set('Authorization', `Bearer ${payloadUser2.token}`)
            .send({
                quote: "Ask not what your country can do for you, ask what you can do for your country."
            })

        const responseUser2 = await request(app)
            .get(`/users/${payloadUser2.id}/quotes`)
            .set('Authorization', `Bearer ${payloadUser2.token}`);
        expect(responseUser2.statusCode).toBe(200);
        expect(responseUser1.body).toBeTruthy()
    });

    it('Trys to Get a Not Existing Quote ', async () => {
        const response = await request(app)
            .get(`/quotes/1000`)
            .set('Authorization', `Bearer ${payloadUser1.token}`);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Não foi possível encontrar essa citação')
    });
   
    it('Trys to get a not number id quote', async () => {
        const response = await request(app)
            .get(`/users/a/quotes`)
            .set('Authorization', `Bearer ${payloadUser1.token}`);

            expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('O campo id do autor deve ser válido')
    })
})