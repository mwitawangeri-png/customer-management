const supertest = require('supertest');
jest.mock('puppeteer', () => ({
    launch: jest.fn()
}));

const prisma = require('../src/config/db')
const app = require('../src/server');
const bcrypt = require('bcrypt');

describe('Register User tests', () => {
    test('successful registration to return a 201', async () => {

        const email = `test.emailx${Date.now()}@testmailauth.com`
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
                email: "test.email@testmailauth.com" 
            }, //password schema violaton
            {
                password: "Fd43#dhshd",
                firstName: "", // Empty name
                email: "test.email@testmailauth.com"
            }
        ];

    test.each(malformedPayloads)('Reject invalidated inputs', async (payload) => {

        const response = await supertest(app)
        .post('/api/v1/auth/register')
        .send(payload)
        
        expect(response.status).toBe(400);
    });

    afterAll(async () => {

        await prisma.user.deleteMany({
            where:{
                email: {contains: '@testmailauth.com'}
            }
        });

        await prisma.$disconnect();
    });
    // End of describe - registration
});

describe('Log user in tests', () => {

        const rawPassword = 'SecurePassword123!';
        const initEmail = 'login.test@testmailauth.com';
  
    beforeAll(async () => {

        const passwordHash = await bcrypt.hash(rawPassword, 10);

        await prisma.user.create({
            data:{
                firstName: "Login",
                email: initEmail,
                passwordHash: passwordHash
            }
        });
    });

    test('successful login returns a 200 and a token', async () => {

        const response = await supertest(app)
        .post('/api/v1/auth/login')
        .send({email: initEmail, password: rawPassword});

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();

    });

    const malformedPayloads =[
        {
            email: "",
            password: rawPassword
        },
        {
            email: initEmail,
            password: ""
        }
    ]

    test.each(malformedPayloads)('Require validation, return a 400 error', async (payload) => {
        
        const response = await supertest(app)
        .post('/api/v1/auth/login')
        .send(payload);

        expect(response.status).toBe(400);
    });

    afterAll( async () => {
        await prisma.user.deleteMany({
            where: {
                email: {contains: '@testmailauth.com'}
            }
        });

       await prisma.$disconnect();
    });


    // End of describe - login
});