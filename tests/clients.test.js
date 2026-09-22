const supertest = require('supertest');

jest.mock('puppeteer', () => ({
    launch: jest.fn()
}));

const prisma = require('../src/config/db');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('Happy Path Client Endpoints tests', () => {

    beforeAll(async () => {
        // Create a user then log them in to get a jwt token
        const userPayload = {
            email: `testuser+${Date.now()}@testmail.com`,
            password: '123StrongPassword#'
        };

        const passwordHash = await bcrypt.hash(userPayload.password, 10);

        await prisma.user.create({
            data: {
                email: userPayload.email,
                passwordHash //
            }
        });
        
    });
    test('Create Client return 201 success code', () => {

    });

    test('Get Clients return 200 success code', () => {

    });

    test('create project return 201 success code', () => {

    });

    test('delete client return 200 sucess code', () => {

    });

    // End of describe
})