const supertest = require('supertest');

jest.mock('puppeteer', () => ({
    launch: jest.fn()
}));

const prisma = require('../src/config/db');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('Happy Path Client Endpoints tests', () => {

    let authToken;
    let globalUser;

    const userPayload = {
        email: `testuser+${Date.now()}@testmailclient.com`,
        password: '123StrongPassword#'
    };

    const clientEmail = `testclient+${Date.now()}@testmailclient.com`

    beforeAll(async () => {
        // Create a user then log them in to get a jwt token
        const passwordHash = await bcrypt.hash(userPayload.password, 10);

        globalUser = await prisma.user.create({
            data: {
                email: userPayload.email,
                firstName: 'TestUser',
                passwordHash
            }
        });

        authToken = jwt.sign({id: globalUser.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        
    });
    test('Create Client return 201 success code', async () => {

        const response = await supertest(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({firstName: 'TestClient1', email: `${clientEmail}`});

        expect(response.status).toBe(201);
        expect(response.body.client.email).toBe(`${clientEmail}`);

    });

    test('Get Clients return 200 success code', async () => {

        const response = await supertest(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200);
        expect(response.body.clients).toBeDefined();

    });

    test('delete client return 200 sucess code', async () => {

        const client = await prisma.client.findFirst({
            where: {
                email: `${clientEmail}`
            }
        });

        const response = await supertest(app)
        .delete(`/api/v1/clients/${client.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({userId: globalUser.id, clientId: client.id})

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();

    });

    afterAll(async () => {

        await prisma.client.deleteMany({
            where:{
                email: {contains: '@testmailclient'},
            }
        });

        await prisma.user.deleteMany({
            where:{
                email: {contains: '@testmailclient'}
            }
        });

        prisma.$disconnect();
    });

    // End of describe
})