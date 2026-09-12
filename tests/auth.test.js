const supertest = require('supertest');
jest.mock('puppeteer', () => ({
    launch: jest.fn()
}));
const app = require('../src/server');

describe('Register User tests', () => {
    test('successful registration to return a 201', async () => {

        const email = `test.emailx${Date.now()}@testmail.com`
        const payload = {
            email: email,
            password: "Fd43#dhshd",
            firstName: "Test User"
        }
        const response = await supertest(app)
        .post('/api/v1/auth/register')
        .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Account successfully created");

    });
        const malformedPayloads = [
            {   
                password: "123456789",
                firstName: "Demo User",
                email: "test.email@testmail.com" 
            }, //password schema violaton
            {
                password: "Fd43#dhshd",
                firstName: "", // Empty name
                email: "test.email@testmail.com"
            }
        ];

    test.each(malformedPayloads)('Reject invalidated inputs', async (payload) => {

        const response = await supertest(app)
        .post('/api/v1/auth/register')
        .send(payload)
        
        expect(response.status).toBe(400);
    });

    // End of describe
});