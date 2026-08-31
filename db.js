const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma once. It handles its own connection pool securely.
const prisma = new PrismaClient();

module.exports = prisma;