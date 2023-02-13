const app = require('../index')
const request = require('supertest')

let payloadUser1;
let payloadUser2;
beforeAll(async () => {
    const createUserResponse = await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'updateQuotes1@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    await request(app)
        .post('/signup')
        .send({
            name: 'Test User',
            email: 'updateQuotes2@example.com',
            password: 'password',
            confirmPassword: 'password'
        });
    expect(createUserResponse.statusCode).toBe(201);

    const loginResponse = await request(app)
        .post('/signin')
        .send({
            email: 'updateQuotes1@example.com',
            password: 'password'
        });
    const loginResponse2 = await request(app)
        .post('/signin')
        .send({
            email: 'updateQuotes2@example.com',
            password: 'password'
        });
    payloadUser1 = loginResponse.body;
    payloadUser2 = loginResponse2.body;
    expect(loginResponse.statusCode).toBe(200);
    expect(payloadUser1.token).toBeTruthy();
    expect(payloadUser2.token).toBeTruthy();
})

describe("test the different types to get quotes", () => {


    it('creates a new quote and updates', async () => {
        const newUser = await request(app)
            .post('/signup')
            .send({
                email: 'updateQuotes3@example.com',
                password: 'password',
                confirmPassword: 'password',
                name: 'newUser',
            });
        const newUserLogin = await request(app)
            .post('/signin')
            .send({
                email: 'updateQuotes3@example.com',
                password: 'password'
            });
        const payload = newUserLogin.body;

        const QuoteFromUser1 = await request(app)
            .post(`/quotes`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                quote: "The only thing necessary for the triumph of evil is for good men to do nothing."
            })

        expect(QuoteFromUser1.statusCode).toBe(201)

        const getQuote = await request(app)
            .get(`/users/${payload.id}/quotes`)
            .set('Authorization', `Bearer ${payload.token}`)

        const quotes = getQuote.body
        const changeQuote = await request(app)
            .put(`/quotes/${quotes[0]['id']}`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                quote: "Only those who will risk going too far can possibly find out how far one can go."
            })
        const theNewQuote = await request(app)
            .get(`/quotes/${quotes[0]['id']}`)
            .set('Authorization', `Bearer ${payload.token}`)

        expect(changeQuote.statusCode).toBe(202)
        expect(changeQuote.body.message).toBe("Citação editada com sucesso")
        expect(theNewQuote.body.quote).toBe("Only those who will risk going too far can possibly find out how far one can go.")
    })

    it('Trys To Get A Quote From Not Existing User', async () => {
        const id = payloadUser1.id + 1000
        const response = await request(app)
            .get(`/users/${id}/quotes`)
            .set('Authorization', `Bearer ${payloadUser1.token}`);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Não foi possivel encontrar esse usuário')

    });
    it('trys to updated a using a not valid id', async () => {
        const changeQuote = await request(app)
            .put(`/quotes/a`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Only those who will risk going too far can possibly find out how far one can go."
            })
        expect(changeQuote.statusCode).toBe(400)
        expect(changeQuote.body.message).toBe("O campo id deve ser válido")
    })
    it('trys to updated a not existing quote', async () => {
        const changeQuote = await request(app)
            .put(`/quotes/10000`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Only those who will risk going too far can possibly find out how far one can go."
            })
        expect(changeQuote.statusCode).toBe(404)
        expect(changeQuote.body.message).toBe("Citação não encontrada")
    })
    it('trys to updates another user quote', async () => {
        const newUser = await request(app)
            .post('/signup')
            .send({
                email: 'updateQuotes3@example.com',
                password: 'password',
                confirmPassword: 'password',
                name: 'newUser',
            });
        const newUserLogin = await request(app)
            .post('/signin')
            .send({
                email: 'updateQuotes3@example.com',
                password: 'password'
            });
        const payload = newUserLogin.body;

        const QuoteFromUser1 = await request(app)
            .post(`/quotes`)
            .set('Authorization', `Bearer ${payload.token}`)
            .send({
                quote: "Success is not final, failure is not fatal: It is the courage to continue that counts."
            })

        expect(QuoteFromUser1.statusCode).toBe(201)

        const getQuote = await request(app)
            .get(`/users/${payload.id}/quotes`)
            .set('Authorization', `Bearer ${payload.token}`)

        const quotes = getQuote.body
        const changeQuote = await request(app)
            .put(`/quotes/${quotes[0]['id']}`)
            .set('Authorization', `Bearer ${payloadUser1.token}`)
            .send({
                quote: "Only those who will risk going too far can possibly find out how far one can go."
            })
        expect(changeQuote.statusCode).toBe(401)
        expect(changeQuote.body.message).toBe("Você não pode fazer isso")

    })
})