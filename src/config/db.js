const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing or undefined.");
}

const pool = new Pool({ 
  connectionString: connectionString,

  ssl: {

    rejectUnauthorized: false

  } });

const adapter = new PrismaPg(pool);

// Instantiate Prisma once. It handles its own connection pool securely.
const prisma = new PrismaClient({adapter});

module.exports = prisma;